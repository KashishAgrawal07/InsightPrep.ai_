const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw Object.assign(new Error('OPENAI_API_KEY is not set in server/.env'), {
      code: 'MISSING_API_KEY',
    });
  }

  if (!apiKey.startsWith('sk-')) {
    throw Object.assign(new Error('OPENAI_API_KEY appears invalid — must start with "sk-"'), {
      code: 'INVALID_API_KEY_FORMAT',
    });
  }

  return new OpenAI({ apiKey });
}

function buildPrompt(experiences) {
  const data = experiences.map((exp, i) => ({
    id: i + 1,
    company: exp.company,
    role: exp.role,
    difficulty: exp.difficulty,
    verdict: exp.verdict,
    sentiment: exp.feedback_sentiment,
    highlights: Array.isArray(exp.highlights) ? exp.highlights : [],
    questions: Array.isArray(exp.raw_questions)
      ? exp.raw_questions
      : exp.roundwise_questions
        ? Object.values(exp.roundwise_questions).flat()
        : [],
    rounds: exp.roundwise_questions ? Object.keys(exp.roundwise_questions) : [],
    tips: exp.tips || '',
  }));

  return `Analyze these ${data.length} interview experiences and return a JSON object with these exact keys:
- frequently_asked_topics (array of strings): common technical/conceptual topics across experiences
- interview_difficulty (string): overall difficulty assessment (Easy/Medium/Hard) with brief reasoning
- common_interview_rounds (array of objects, each with "name" and "description"): typical rounds encountered
- preparation_tips (array of strings): actionable preparation advice based on the data

Experiences:
${JSON.stringify(data, null, 2)}`;
}

function classifyOpenAIError(error) {
  const status = error.status;

  if (error.code === 'MISSING_API_KEY') return { status: 500, code: 'MISSING_API_KEY' };
  if (error.code === 'INVALID_API_KEY_FORMAT') return { status: 500, code: 'INVALID_API_KEY_FORMAT' };

  if (status === 401) return { status: 502, code: 'INVALID_API_KEY' };
  if (status === 429) return { status: 429, code: 'RATE_LIMITED' };
  if (status === 500 || status === 503) return { status: 502, code: 'OPENAI_DOWN' };

  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
    return { status: 502, code: 'NETWORK_ERROR' };
  }

  return { status: 500, code: 'UNKNOWN' };
}

const ERROR_MESSAGES = {
  MISSING_API_KEY: 'AI summarization is not configured. Contact the administrator.',
  INVALID_API_KEY_FORMAT: 'AI service is misconfigured. Contact the administrator.',
  INVALID_API_KEY: 'AI service authentication failed. Contact the administrator.',
  RATE_LIMITED: 'AI service is temporarily rate-limited. Please wait a moment and try again.',
  OPENAI_DOWN: 'AI service is temporarily unavailable. Please try again later.',
  NETWORK_ERROR: 'Could not reach the AI service. Check your internet connection.',
  UNKNOWN: 'An unexpected error occurred while generating the summary. Please try again.',
};

router.post('/ai-summary', async (req, res) => {
  try {
    const { experiences } = req.body;

    if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
      return res.status(400).json({
        message: 'At least one experience is required',
        code: 'NO_EXPERIENCES',
      });
    }

    for (let i = 0; i < experiences.length; i++) {
      if (!experiences[i].company || !experiences[i].role) {
        return res.status(400).json({
          message: `Experience #${i + 1} is missing company or role`,
          code: 'INVALID_EXPERIENCE',
        });
      }
    }

    let openai;
    try {
      openai = createOpenAIClient();
    } catch (err) {
      const classified = classifyOpenAIError(err);
      console.error('AI summary config error:', err.message);
      return res.status(classified.status).json({
        message: ERROR_MESSAGES[classified.code],
        code: classified.code,
      });
    }

    const prompt = buildPrompt(experiences);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert interview analyst. Analyze the provided interview experiences and return a structured JSON summary. Respond ONLY with valid JSON, no markdown, no code fences.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1500,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        message: 'AI returned an empty response. Please try again.',
        code: 'EMPTY_RESPONSE',
      });
    }

    let summary;
    try {
      summary = JSON.parse(text);
    } catch {
      return res.status(500).json({
        message: 'AI returned an unparseable response. Please try again.',
        code: 'UNPARSEABLE_RESPONSE',
      });
    }

    res.json({ summary });
  } catch (error) {
    const classified = classifyOpenAIError(error);
    console.error('AI summary error:', error.message);

    if (classified.code === 'UNKNOWN') {
      console.error('Full error details:', error);
    }

    res.status(classified.status).json({
      message: ERROR_MESSAGES[classified.code],
      code: classified.code,
    });
  }
});

module.exports = router;
