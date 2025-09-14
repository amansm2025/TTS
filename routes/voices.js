const express = require('express');
const router = express.Router();

// Get all supported languages and voices
router.get('/all', (req, res) => {
  const supportedLanguages = {
    'en-US': {
      name: 'English (US)',
      accent: 'American',
      providers: ['google', 'polly', 'azure']
    },
    'en-IN': {
      name: 'English (India)',
      accent: 'Indian',
      providers: ['google', 'polly', 'azure']
    },
    'hi-IN': {
      name: 'Hindi (India)',
      accent: 'Indian',
      providers: ['google', 'polly', 'azure']
    },
    'en-GB': {
      name: 'English (UK)',
      accent: 'British',
      providers: ['google', 'polly', 'azure']
    },
    'es-ES': {
      name: 'Spanish (Spain)',
      accent: 'European Spanish',
      providers: ['google', 'polly', 'azure']
    },
    'fr-FR': {
      name: 'French (France)',
      accent: 'French',
      providers: ['google', 'polly', 'azure']
    }
  };

  res.json(supportedLanguages);
});

module.exports = router;