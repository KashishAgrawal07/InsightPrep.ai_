const express = require('express');
const router = express.Router();

const DEFAULT_LIBRETRANSLATE_URL = 'http://localhost:5002';

function getLibreTranslateUrl() {
  return process.env.LIBRETRANSLATE_URL || DEFAULT_LIBRETRANSLATE_URL;
}

router.post('/translate', async (req, res) => {
  try {
    const { text, source, target } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: 'Text is required',
        code: 'NO_TEXT',
      });
    }

    const libreUrl = getLibreTranslateUrl();

    const response = await fetch(`${libreUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: source || 'auto',
        target: target || 'en',
        format: 'text',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(`LibreTranslate error (${response.status}):`, errorBody);
      return res.status(502).json({
        message: 'Translation service error. Ensure LibreTranslate is running.',
        code: 'TRANSLATE_SERVICE_ERROR',
      });
    }

    const data = await response.json();
    res.json({ translatedText: data.translatedText });
  } catch (error) {
    const causeCode = error.cause?.code;
    if (causeCode === 'ECONNREFUSED' || error.code === 'ECONNREFUSED') {
      return res.status(502).json({
        message: 'Cannot connect to LibreTranslate. Is it running on port 5002?',
        code: 'TRANSLATE_CONNECTION_REFUSED',
      });
    }

    console.error('Translation error:', error.message);
    res.status(502).json({
      message: 'Translation service unavailable.',
      code: 'TRANSLATE_SERVICE_UNAVAILABLE',
    });
  }
});

module.exports = router;
