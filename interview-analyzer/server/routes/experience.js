const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

// Path to the NLP processing script
const NLP_SCRIPT_PATH = path.join(__dirname, '../scripts/process_experience_nlp.py');
const EXPERIENCES_FILE = path.join(__dirname, '../data/processed_experiences.json');

// Ensure the experiences file exists
async function ensureExperiencesFile() {
  try {
    await fs.access(EXPERIENCES_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(EXPERIENCES_FILE, JSON.stringify([], null, 2));
  }
}

// Load existing experiences
async function loadExperiences() {
  await ensureExperiencesFile();
  const data = await fs.readFile(EXPERIENCES_FILE, 'utf8');
  return JSON.parse(data);
}

// Save experiences to file
async function saveExperiences(experiences) {
  await fs.writeFile(EXPERIENCES_FILE, JSON.stringify(experiences, null, 2));
}

// Process experience using NLP pipeline
async function processExperienceWithNLP(experienceData) {
  return new Promise((resolve, reject) => {
    // Create temporary file for the experience
    const tempInputFile = path.join(__dirname, '../data/temp_experience.json');
    const tempOutputFile = path.join(__dirname, '../data/temp_processed.json');
    
    // Write experience to temporary file
    fs.writeFile(tempInputFile, JSON.stringify([experienceData], null, 2))
      .then(() => {
        // Run NLP processing script
        const pythonProcess = spawn('python', [NLP_SCRIPT_PATH, tempInputFile, tempOutputFile]);
        
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        pythonProcess.on('close', async (code) => {
          try {
            // Clean up temporary input file
            await fs.unlink(tempInputFile);
            
            if (code !== 0) {
              console.error('NLP processing failed:', stderr);
              reject(new Error('NLP processing failed'));
              return;
            }
            
            // Read processed result
            const processedData = await fs.readFile(tempOutputFile, 'utf8');
            const processedExperiences = JSON.parse(processedData);
            
            // Clean up temporary output file
            await fs.unlink(tempOutputFile);
            
            if (processedExperiences.length > 0) {
              resolve(processedExperiences[0]);
            } else {
              reject(new Error('No processed experience returned'));
            }
          } catch (error) {
            reject(error);
          }
        });
      })
      .catch(reject);
  });
}

// Submit new experience
router.post('/submit-experience', async (req, res) => {
  try {
    const experienceData = req.body;
    
    // Validate required fields
    if (!experienceData.company || !experienceData.role) {
      return res.status(400).json({ 
        message: 'Company and role are required fields' 
      });
    }
    
    // Add submission timestamp
    experienceData.submitted_at = new Date().toISOString();
    experienceData.id = `exp_${Date.now()}`;
    
    // Process with NLP pipeline
    let processedExperience;
    try {
      processedExperience = await processExperienceWithNLP(experienceData);
    } catch (nlpError) {
      console.error('NLP processing failed:', nlpError);
      // Fallback: create basic processed experience without NLP
      processedExperience = {
        ...experienceData,
        nlp_processed: false,
        sentiment_analysis: { sentiment: 'neutral', confidence: 0.5 },
        categorized_questions: { technical: [], behavioral: [], system_design: [], coding: [], other: [] },
        extracted_insights: { topics: [], skills: [], technologies: [], difficulty_indicators: [], preparation_tips: [], red_flags: [], positive_aspects: [] },
        interview_rounds: [],
        highlights: ['Experience submitted successfully'],
        feedback_sentiment: 'neutral',
        raw_questions: [],
        roundwise_questions: {},
        source: 'User Submission'
      };
    }
    
    // Load existing experiences
    const experiences = await loadExperiences();
    
    // Add new experience
    experiences.push(processedExperience);
    
    // Save updated experiences
    await saveExperiences(experiences);
    
    res.status(200).json({
      message: 'Experience submitted successfully',
      experience_id: processedExperience.id,
      nlp_processed: processedExperience.nlp_processed
    });
    
  } catch (error) {
    console.error('Error submitting experience:', error);
    res.status(500).json({ 
      message: 'Failed to submit experience',
      error: error.message 
    });
  }
});

// Get all experiences
router.get('/experiences', async (req, res) => {
  try {
    const experiences = await loadExperiences();
    res.json(experiences);
  } catch (error) {
    console.error('Error loading experiences:', error);
    res.status(500).json({ 
      message: 'Failed to load experiences',
      error: error.message 
    });
  }
});

// Get experience by ID
router.get('/experiences/:id', async (req, res) => {
  try {
    const experiences = await loadExperiences();
    const experience = experiences.find(exp => exp.id === req.params.id);
    
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.json(experience);
  } catch (error) {
    console.error('Error loading experience:', error);
    res.status(500).json({ 
      message: 'Failed to load experience',
      error: error.message 
    });
  }
});

// Get experiences with filters
router.get('/experiences/filter', async (req, res) => {
  try {
    const { company, role, difficulty, sentiment } = req.query;
    let experiences = await loadExperiences();
    
    // Apply filters
    if (company && company !== 'all') {
      experiences = experiences.filter(exp => 
        exp.company && exp.company.toLowerCase().includes(company.toLowerCase())
      );
    }
    
    if (role && role !== 'all') {
      experiences = experiences.filter(exp => 
        exp.role && exp.role.toLowerCase().includes(role.toLowerCase())
      );
    }
    
    if (difficulty && difficulty !== 'all') {
      experiences = experiences.filter(exp => 
        exp.difficulty && exp.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    if (sentiment && sentiment !== 'all') {
      experiences = experiences.filter(exp => 
        exp.feedback_sentiment && exp.feedback_sentiment.toLowerCase() === sentiment.toLowerCase()
      );
    }
    
    res.json(experiences);
  } catch (error) {
    console.error('Error filtering experiences:', error);
    res.status(500).json({ 
      message: 'Failed to filter experiences',
      error: error.message 
    });
  }
});

// Get experience statistics
router.get('/experiences/stats', async (req, res) => {
  try {
    const experiences = await loadExperiences();
    
    const stats = {
      total: experiences.length,
      companies: [...new Set(experiences.map(exp => exp.company).filter(Boolean))],
      roles: [...new Set(experiences.map(exp => exp.role).filter(Boolean))],
      difficulties: [...new Set(experiences.map(exp => exp.difficulty).filter(Boolean))],
      sentiments: [...new Set(experiences.map(exp => exp.feedback_sentiment).filter(Boolean))],
      verdicts: [...new Set(experiences.map(exp => exp.verdict).filter(Boolean))],
      average_sentiment: experiences.reduce((acc, exp) => {
        const sentiment = exp.feedback_sentiment || 'neutral';
        if (sentiment === 'positive') acc.positive++;
        else if (sentiment === 'negative') acc.negative++;
        else acc.neutral++;
        return acc;
      }, { positive: 0, negative: 0, neutral: 0 })
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting experience stats:', error);
    res.status(500).json({ 
      message: 'Failed to get experience statistics',
      error: error.message 
    });
  }
});

module.exports = router;
