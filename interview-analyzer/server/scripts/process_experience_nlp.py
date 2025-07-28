#!/usr/bin/env python3
"""
NLP Pipeline for Processing Interview Experiences
Extracts insights, categorizes questions, performs sentiment analysis
"""

import json
import re
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.tag import pos_tag
from collections import Counter
import spacy
from datetime import datetime
import logging

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

try:
    nltk.data.find('averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')

try:
    nltk.data.find('stopwords')
except LookupError:
    nltk.download('stopwords')

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("spaCy model not found. Please install: python -m spacy download en_core_web_sm")
    nlp = None

class InterviewExperienceProcessor:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.stop_words = set(stopwords.words('english'))
        
        # Question patterns for categorization
        self.question_patterns = {
            'technical': [
                r'\b(algorithm|data structure|complexity|optimization|performance|scalability|database|api|framework|library|language|syntax|debugging|testing|deployment|architecture|design pattern|microservices|distributed system|concurrency|threading|memory|garbage collection|network|protocol|security|authentication|authorization|encryption|hashing|caching|load balancing|monitoring|logging|metrics|observability)\b',
                r'\b(implement|code|write|solve|optimize|design|build|create|develop|program|script|function|class|method|variable|loop|recursion|sorting|searching|graph|tree|array|linked list|stack|queue|heap|hash table|binary search|dynamic programming|greedy|backtracking|divide and conquer)\b'
            ],
            'behavioral': [
                r'\b(experience|project|team|leadership|conflict|challenge|problem|solution|collaboration|communication|feedback|mentor|mentee|growth|learning|improvement|goal|achievement|failure|success|stress|pressure|deadline|priority|decision|risk|innovation|creativity|adaptability|flexibility|resilience|perseverance)\b',
                r'\b(tell me about|describe|explain|how did you|what would you|situation|example|instance|time when|handled|managed|resolved|overcame|learned|grew|developed|improved|changed|adapted|flexed|resilient|persevered)\b'
            ],
            'system_design': [
                r'\b(system|architecture|design|scale|scalability|performance|throughput|latency|availability|reliability|fault tolerance|redundancy|load balancing|caching|database|storage|network|distributed|microservices|monolith|api|rest|graphql|message queue|event streaming|real-time|batch processing|data pipeline|etl|data warehouse|data lake|machine learning|ai|ml|recommendation|search|notification|payment|authentication|authorization|monitoring|logging|metrics|alerting|deployment|ci/cd|container|docker|kubernetes|cloud|aws|azure|gcp)\b',
                r'\b(design a|build a|create a|architect|scale to|handle|support|serve|process|store|retrieve|search|recommend|notify|authenticate|authorize|monitor|log|alert|deploy|containerize|orchestrate|manage|operate|maintain|upgrade|migrate|backup|recovery|disaster|failover|replication|sharding|partitioning|indexing|compression|encryption|compression|deduplication|archiving|tiering)\b'
            ],
            'coding': [
                r'\b(code|program|implement|write|solve|algorithm|data structure|complexity|time complexity|space complexity|optimization|performance|efficiency|correctness|edge case|test case|unit test|integration test|debug|fix|refactor|clean code|readable|maintainable|documentation|comment|naming|function|class|method|variable|type|interface|inheritance|polymorphism|encapsulation|abstraction|design pattern|solid principles|dry|kiss|yagni)\b',
                r'\b(leetcode|hackerrank|codility|topcoder|competitive programming|interview question|coding challenge|whiteboard|pair programming|code review|pull request|merge|conflict|version control|git|branch|commit|push|pull|rebase|merge|stash|reset|checkout|log|diff|blame|tag|release|hotfix|feature|bugfix)\b'
            ]
        }
        
        # Sentiment keywords
        self.sentiment_keywords = {
            'positive': ['excellent', 'great', 'good', 'amazing', 'wonderful', 'fantastic', 'smooth', 'easy', 'helpful', 'supportive', 'professional', 'organized', 'clear', 'fair', 'reasonable', 'challenging', 'interesting', 'engaging', 'positive', 'successful', 'selected', 'offered', 'accepted'],
            'negative': ['difficult', 'hard', 'challenging', 'stressful', 'unclear', 'confusing', 'disorganized', 'unprofessional', 'rude', 'unhelpful', 'negative', 'rejected', 'failed', 'disappointing', 'frustrating', 'annoying', 'terrible', 'awful', 'horrible', 'bad', 'poor', 'weak'],
            'neutral': ['okay', 'fine', 'average', 'standard', 'normal', 'typical', 'expected', 'reasonable', 'fair', 'balanced', 'mixed', 'varied', 'different', 'unique', 'interesting']
        }

    def extract_questions(self, text):
        """Extract questions from text using NLP"""
        questions = []
        
        # Split into sentences
        sentences = sent_tokenize(text)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence.endswith('?') or any(word in sentence.lower() for word in ['asked', 'question', 'what', 'how', 'why', 'when', 'where', 'which', 'who']):
                questions.append(sentence)
        
        return questions

    def categorize_questions(self, questions):
        """Categorize questions by type"""
        categorized = {
            'technical': [],
            'behavioral': [],
            'system_design': [],
            'coding': [],
            'other': []
        }
        
        for question in questions:
            question_lower = question.lower()
            max_score = 0
            best_category = 'other'
            
            for category, patterns in self.question_patterns.items():
                score = 0
                for pattern in patterns:
                    matches = re.findall(pattern, question_lower, re.IGNORECASE)
                    score += len(matches)
                
                if score > max_score:
                    max_score = score
                    best_category = category
            
            categorized[best_category].append(question)
        
        return categorized

    def analyze_sentiment(self, text):
        """Perform sentiment analysis"""
        # VADER sentiment analysis
        vader_scores = self.sia.polarity_scores(text)
        
        # Keyword-based sentiment
        text_lower = text.lower()
        keyword_scores = {'positive': 0, 'negative': 0, 'neutral': 0}
        
        for sentiment, keywords in self.sentiment_keywords.items():
            for keyword in keywords:
                keyword_scores[sentiment] += text_lower.count(keyword)
        
        # Determine overall sentiment
        if vader_scores['compound'] >= 0.05:
            sentiment = 'positive'
        elif vader_scores['compound'] <= -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'sentiment': sentiment,
            'vader_scores': vader_scores,
            'keyword_scores': keyword_scores,
            'confidence': abs(vader_scores['compound'])
        }

    def extract_key_insights(self, text):
        """Extract key insights from the experience"""
        insights = {
            'topics': [],
            'skills': [],
            'technologies': [],
            'companies_mentioned': [],
            'difficulty_indicators': [],
            'preparation_tips': [],
            'red_flags': [],
            'positive_aspects': []
        }
        
        # Extract topics and skills
        doc = nlp(text) if nlp else None
        if doc:
            # Extract noun phrases and named entities
            for chunk in doc.noun_chunks:
                if len(chunk.text.split()) <= 3:  # Avoid very long phrases
                    insights['topics'].append(chunk.text.lower())
            
            # Extract named entities
            for ent in doc.ents:
                if ent.label_ in ['ORG', 'PRODUCT', 'GPE']:
                    insights['technologies'].append(ent.text)
        
        # Extract difficulty indicators
        difficulty_patterns = [
            r'\b(easy|simple|straightforward|basic|fundamental)\b',
            r'\b(medium|moderate|reasonable|standard|typical)\b',
            r'\b(hard|difficult|challenging|complex|advanced|expert)\b',
            r'\b(very hard|extremely difficult|intense|rigorous|demanding)\b'
        ]
        
        for pattern in difficulty_patterns:
            matches = re.findall(pattern, text.lower(), re.IGNORECASE)
            insights['difficulty_indicators'].extend(matches)
        
        # Extract preparation tips
        tip_patterns = [
            r'\b(study|practice|prepare|review|learn|read|watch|practice|mock|interview|prep)\b',
            r'\b(leetcode|hackerrank|codility|topcoder|competitive programming)\b',
            r'\b(book|course|tutorial|video|documentation|guide)\b'
        ]
        
        for pattern in tip_patterns:
            matches = re.findall(pattern, text.lower(), re.IGNORECASE)
            insights['preparation_tips'].extend(matches)
        
        # Extract red flags and positive aspects
        red_flag_patterns = [
            r'\b(rude|unprofessional|disorganized|unclear|confusing|stressful|negative|bad|terrible|awful|horrible|poor|weak|disappointing|frustrating|annoying)\b'
        ]
        
        positive_patterns = [
            r'\b(professional|organized|clear|helpful|supportive|positive|good|great|excellent|amazing|wonderful|fantastic|smooth|easy|fair|reasonable)\b'
        ]
        
        for pattern in red_flag_patterns:
            matches = re.findall(pattern, text.lower(), re.IGNORECASE)
            insights['red_flags'].extend(matches)
        
        for pattern in positive_patterns:
            matches = re.findall(pattern, text.lower(), re.IGNORECASE)
            insights['positive_aspects'].extend(matches)
        
        return insights

    def extract_rounds(self, text):
        """Extract interview rounds information"""
        rounds = []
        
        # Common round patterns
        round_patterns = [
            r'\b(phone screen|phone interview|screening|initial)\b',
            r'\b(technical|coding|programming|algorithm|data structure)\b',
            r'\b(behavioral|culture|fit|personality|soft skills)\b',
            r'\b(system design|architecture|design|high level)\b',
            r'\b(onsite|on-site|in-person|final|last)\b',
            r'\b(hr|human resources|recruiter|hiring manager)\b'
        ]
        
        sentences = sent_tokenize(text)
        current_round = None
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            
            # Check for round indicators
            for pattern in round_patterns:
                if re.search(pattern, sentence_lower):
                    round_type = re.search(pattern, sentence_lower).group()
                    current_round = {
                        'type': round_type,
                        'description': sentence,
                        'questions': []
                    }
                    rounds.append(current_round)
                    break
            
            # Add questions to current round
            if current_round and '?' in sentence:
                current_round['questions'].append(sentence)
        
        return rounds

    def process_experience(self, experience_data):
        """Main processing function"""
        try:
            # Extract text content
            text_content = experience_data.get('experience', '')
            if not text_content:
                return None
            
            # Extract questions
            questions = self.extract_questions(text_content)
            categorized_questions = self.categorize_questions(questions)
            
            # Analyze sentiment
            sentiment_analysis = self.analyze_sentiment(text_content)
            
            # Extract insights
            insights = self.extract_key_insights(text_content)
            
            # Extract rounds
            rounds = self.extract_rounds(text_content)
            
            # Process structured questions if available
            structured_questions = {}
            for question_type in ['technicalQuestions', 'behavioralQuestions', 'systemDesignQuestions', 'codingQuestions']:
                if question_type in experience_data and experience_data[question_type]:
                    structured_questions[question_type] = experience_data[question_type]
            
            # Create processed experience
            processed_experience = {
                'id': experience_data.get('id', f"exp_{datetime.now().strftime('%Y%m%d_%H%M%S')}"),
                'title': experience_data.get('title', f"Interview at {experience_data.get('company', 'Unknown Company')}"),
                'company': experience_data.get('company', ''),
                'role': experience_data.get('role', ''),
                'verdict': experience_data.get('verdict', ''),
                'difficulty': experience_data.get('difficulty', ''),
                'source': 'User Submission',
                'timestamp': datetime.now().isoformat(),
                
                # NLP processed data
                'nlp_processed': True,
                'sentiment_analysis': sentiment_analysis,
                'categorized_questions': categorized_questions,
                'extracted_insights': insights,
                'interview_rounds': rounds,
                'structured_questions': structured_questions,
                
                # Original data
                'original_experience': text_content,
                'user_data': {
                    'name': experience_data.get('name', ''),
                    'email': experience_data.get('email', ''),
                    'tags': experience_data.get('tags', ''),
                    'interviewType': experience_data.get('interviewType', ''),
                    'experienceLevel': experience_data.get('experienceLevel', ''),
                    'preparationTime': experience_data.get('preparationTime', ''),
                    'location': experience_data.get('location', ''),
                    'salary': experience_data.get('salary', ''),
                    'overallExperience': experience_data.get('overallExperience', ''),
                    'tips': experience_data.get('tips', ''),
                    'feedback': experience_data.get('feedback', '')
                },
                
                # Generated highlights
                'highlights': self.generate_highlights(insights, sentiment_analysis),
                'feedback_sentiment': sentiment_analysis['sentiment'],
                'raw_questions': questions,
                'roundwise_questions': self.organize_questions_by_rounds(rounds, categorized_questions)
            }
            
            return processed_experience
            
        except Exception as e:
            logging.error(f"Error processing experience: {str(e)}")
            return None

    def generate_highlights(self, insights, sentiment_analysis):
        """Generate highlights from insights"""
        highlights = []
        
        # Add sentiment-based highlights
        if sentiment_analysis['sentiment'] == 'positive':
            highlights.append("Overall positive interview experience")
        elif sentiment_analysis['sentiment'] == 'negative':
            highlights.append("Challenging interview experience")
        
        # Add difficulty highlights
        if insights['difficulty_indicators']:
            difficulty = insights['difficulty_indicators'][0] if insights['difficulty_indicators'] else 'moderate'
            highlights.append(f"Interview difficulty: {difficulty}")
        
        # Add preparation tips
        if insights['preparation_tips']:
            highlights.append("Includes preparation advice")
        
        # Add red flags or positive aspects
        if insights['red_flags']:
            highlights.append("Contains potential red flags")
        elif insights['positive_aspects']:
            highlights.append("Highlights positive aspects")
        
        # Add technology mentions
        if insights['technologies']:
            highlights.append(f"Mentions technologies: {', '.join(insights['technologies'][:3])}")
        
        return highlights

    def organize_questions_by_rounds(self, rounds, categorized_questions):
        """Organize questions by interview rounds"""
        round_questions = {}
        
        for i, round_info in enumerate(rounds):
            round_name = f"Round {i+1}: {round_info['type']}"
            round_questions[round_name] = round_info['questions']
        
        # Add uncategorized questions
        all_questions = []
        for category, questions in categorized_questions.items():
            all_questions.extend(questions)
        
        if all_questions:
            round_questions["General Questions"] = all_questions
        
        return round_questions

def process_experience_file(input_file, output_file):
    """Process experiences from a JSON file"""
    processor = InterviewExperienceProcessor()
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            experiences = json.load(f)
        
        processed_experiences = []
        
        for experience in experiences:
            processed = processor.process_experience(experience)
            if processed:
                processed_experiences.append(processed)
        
        # Save processed experiences
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_experiences, f, indent=2, ensure_ascii=False)
        
        print(f"Processed {len(processed_experiences)} experiences. Output saved to {output_file}")
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 3:
        print("Usage: python process_experience_nlp.py input_file.json output_file.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    process_experience_file(input_file, output_file) 