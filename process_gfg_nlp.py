import json
import re
import spacy

# Load English NLP model
nlp = spacy.load("en_core_web_sm")

def extract_verdict(text):
    verdict_keywords = {
        "selected": "Selected",
        "rejected": "Rejected",
        "not selected": "Rejected",
        "shortlisted": "Shortlisted",
    }
    for line in text.split("\n"):
        for key in verdict_keywords:
            if key in line.lower():
                return verdict_keywords[key]
    return ""

def extract_questions_by_round(content):
    rounds = {}
    current_round = "General"
    for line in content.split("\n"):
        line = line.strip()

        # Detect round headers
        if re.match(r"(?i)^round\s*\d*[:\-]?\s*", line):
            current_round = re.sub(r"(?i)^round\s*\d*[:\-]?\s*", "", line).strip().title() or f"Round {len(rounds)+1}"
            continue
        elif any(keyword.lower() in line.lower() for keyword in ["technical round", "hr round", "coding round", "managerial round", "aptitude round", "gd round"]):
            current_round = line.strip().title()
            continue

        # Clean up false matches
        if (
            len(line) < 10 or  # too short to be useful
            line.lower().startswith("the") or  # likely descriptive
            line.lower().startswith("this round") or
            line.lower().startswith("it was") or
            line.lower().startswith("duration") or
            line.endswith(":") or
            not re.search(r"\?$|^(what|why|how|could|do|explain|when|which|are|did|describe|have|name)\b", line.lower())  # doesn't look like a question
        ):
            continue

        rounds.setdefault(current_round, []).append(line)

    return rounds


def extract_metadata(entry):
    title = entry.get("title", "")
    content = entry.get("content", "")

    # Company & role
    company = title.split("Interview Experience")[0].strip()
    role_match = re.search(r"for ([A-Za-z0-9()+\- ]+)", title, re.IGNORECASE)
    role = role_match.group(1).strip() if role_match else ""

    # Rounds detection
    round_keywords = ["Online Assessment", "Technical", "HR", "Managerial", "Coding", "Aptitude", "Telephonic", "Group Discussion"]
    found_rounds = list({r for r in round_keywords if re.search(rf"(?i)\b{re.escape(r)}\b", content)})

    # Difficulty
    diff_match = re.search(r"(easy|medium|moderate|hard|difficult|tough)", content.lower())
    difficulty = {"easy": "Easy", "medium": "Medium", "moderate": "Medium", "hard": "Hard", "difficult": "Hard", "tough": "Hard"}.get(diff_match.group(1)) if diff_match else ""

    # Verdict
    verdict = extract_verdict(content)

    # Questions grouped by round
    questions_by_round = extract_questions_by_round(content)
    total_questions = sum(len(v) for v in questions_by_round.values())

    return {
        "company": company,
        "role": role,
        "rounds": found_rounds,
        "difficulty": difficulty,
        "verdict": verdict,
        "question_count": total_questions,
        "questions_by_round": questions_by_round
    }

def process_enhanced_pipeline(input_file="processed_gfg_data.json", output_file="enhanced_gfg_data.json"):
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    enriched = []
    for entry in data:
        enriched.append({**entry, **extract_metadata(entry)})

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)

    print(f"[✓] Processed {len(enriched)} entries into '{output_file}'")

if __name__ == "__main__":
    process_enhanced_pipeline()
