# process_gfg_nlp.py
import json
import re

def extract_metadata(entry):
    title = entry.get("title", "")
    content = entry.get("content", "")

    # Smarter company extraction
    company = title.split("Interview Experience")[0].strip()

    # Extract role from title (e.g., "for SDE", "for Intern")
    role_match = re.search(r"for ([A-Za-z0-9()+\- ]+)", title, re.IGNORECASE)
    role = role_match.group(1).strip() if role_match else ""
    if role.lower().endswith("role"):
        role = role[:-4].strip()

    # Extract rounds
    round_keywords = ["Online Assessment", "Technical", "HR", "Managerial", "Coding", "Aptitude", "Telephonic"]
    found_rounds = []
    for r in round_keywords:
        if re.search(rf"(?i)\b{re.escape(r)}\b", content):
            found_rounds.append(r)

    # Extract difficulty
    diff_match = re.search(r"(easy|medium|moderate|hard|difficult|tough)", content.lower())
    difficulty_map = {
        "easy": "Easy",
        "medium": "Medium",
        "moderate": "Medium",
        "hard": "Hard",
        "difficult": "Hard",
        "tough": "Hard"
    }
    difficulty = difficulty_map.get(diff_match.group(1)) if diff_match else ""

    # Count questions
    question_patterns = [
        r"\bQ\d\b",
        r"question[:\-]",
        r"\?",
        r"solve",
        r"implement"
    ]
    question_count = len(re.findall("|".join(question_patterns), content))

    # Raw question extraction (with filtering)
    excluded_starts = {
        "questions",
        "questions included:",
        "questions asked included:",
        "round 1:",
        "interview process"
    }

    raw_questions = [
        line.strip() for line in content.split("\n")
        if (
            ("?" in line or "Q" in line[:5])
            and line.strip().lower() not in excluded_starts
        )
    ]

    return {
        "company": company,
        "role": role,
        "rounds": found_rounds,
        "difficulty": difficulty,
        "question_count": question_count,
        "raw_questions": raw_questions
    }

def process_nlp_pipeline(input_file="gfg_interview_data.json", output_file="processed_gfg_data.json"):
    with open(input_file, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    enriched_data = []
    for entry in raw_data:
        metadata = extract_metadata(entry)
        enriched_entry = {**entry, **metadata}
        enriched_data.append(enriched_entry)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(enriched_data, f, indent=2, ensure_ascii=False)

    print(f"NLP processing complete. {len(enriched_data)} entries saved to {output_file}")

if __name__ == "__main__":
    process_nlp_pipeline()
