const express = require('express');
const router = express.Router();
const TTSService = require('../services/ttsService');
const GoogleTranslateTTS = require('../services/googleTranslateTTS');
const MultiVoiceTTS = require('../services/multiVoiceTTS');

const ttsService = new TTSService();
const freeTTS = new GoogleTranslateTTS();
const multiVoice = new MultiVoiceTTS();

// Convert text to speech
router.post('/convert', async (req, res) => {
  try {
    const { text, provider, language, voice, gender, options = {} } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let audioBuffer;

    // Free Multi-Voice TTS for Hindi
    if (provider === 'free' && language === 'hi-IN') {
      console.log('Using multi-voice TTS for Hindi with voice:', voice);
      const voiceName = voice ? voice.toLowerCase().replace(/[^a-z]/g, '') : 'kavya';
      audioBuffer = await multiVoice.synthesizeLong(text, voiceName);
    }
    // Free Google Translate TTS for English
    else if (provider === 'free' && language === 'en-US') {
      console.log('Using free Google Translate TTS for English');
      audioBuffer = await freeTTS.synthesizeLong(text, 'en');
    }
    // Cloud APIs (require keys)
    else {
      if (!provider || !language || !voice) {
        return res.status(400).json({ 
          error: 'Missing required fields for cloud APIs: provider, language, voice' 
        });
      }

      switch (provider) {
        case 'google':
          audioBuffer = await ttsService.synthesizeWithGoogle(
            text, language, voice, gender
          );
          break;
        
        case 'polly':
          audioBuffer = await ttsService.synthesizeWithPolly(
            text, language, voice, options.engine
          );
          break;
        
        case 'azure':
          audioBuffer = await ttsService.synthesizeWithAzure(
            text, language, voice
          );
          break;
        
        default:
          return res.status(400).json({ error: 'Invalid provider' });
      }
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(500).json({ error: 'No audio generated' });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': 'attachment; filename="speech.mp3"'
    });

    res.send(audioBuffer);

  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to generate speech: ' + error.message });
  }
});

// Get available voices for a language
router.get('/voices/:provider/:language', (req, res) => {
  try {
    const { provider, language } = req.params;
    const voiceConfig = ttsService.getVoiceConfig();
    
    if (!voiceConfig[provider] || !voiceConfig[provider][language]) {
      return res.status(404).json({ error: 'Language not supported' });
    }

    res.json({
      provider,
      language,
      voices: voiceConfig[provider][language]
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
});

module.exports = router;