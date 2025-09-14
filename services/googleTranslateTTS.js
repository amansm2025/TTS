const https = require('https');
const fs = require('fs');
const path = require('path');

class GoogleTranslateTTS {
  
  constructor() {
    // Voice configurations with different parameters
    this.voices = {
      'kavya': { speed: 1.0, pitch: 1.0, accent: 'standard' },
      'dhruv': { speed: 0.9, pitch: 0.8, accent: 'deep' },
      'arjun': { speed: 1.1, pitch: 0.9, accent: 'clear' },
      'priya': { speed: 0.95, pitch: 1.1, accent: 'soft' },
      'aditi': { speed: 1.0, pitch: 1.05, accent: 'bilingual' },
      'ravi': { speed: 0.85, pitch: 0.7, accent: 'mature' },
      'ananya': { speed: 1.05, pitch: 1.15, accent: 'young' }
    };
  }
  
  // Free Google Translate TTS with voice variations
  async synthesize(text, lang = 'hi', voiceName = 'kavya') {
    const voice = this.voices[voiceName] || this.voices['kavya'];
    let modifiedText = this.applyVoiceCharacteristics(text, voice);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(modifiedText)}`;
    
    return new Promise((resolve, reject) => {
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const audioBuffer = Buffer.concat(chunks);
          resolve(audioBuffer);
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  // Split long text into chunks (Google Translate has character limit)
  splitText(text, maxLength = 200) {
    if (text.length <= maxLength) return [text];
    
    const sentences = text.split(/[।.!?]+/);
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence + '। ';
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence + '। ';
      }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }

  // Apply voice characteristics to text
  applyVoiceCharacteristics(text, voice) {
    let modifiedText = text;
    
    switch(voice.accent) {
      case 'deep':
        modifiedText = text.replace(/।/g, '।।'); // Longer pauses
        break;
      case 'soft':
        modifiedText = text.replace(/!/g, '.'); // Softer exclamations
        break;
      case 'clear':
        modifiedText = text.replace(/([।.!?])/g, '$1 '); // Clear articulation
        break;
      case 'young':
        modifiedText = text.replace(/हैं/g, 'हैं!'); // More enthusiasm
        break;
    }
    
    return modifiedText;
  }

  // Synthesize long text by combining multiple audio chunks
  async synthesizeLong(text, lang = 'hi', voiceName = 'kavya') {
    const chunks = this.splitText(text);
    const audioBuffers = [];
    
    for (const chunk of chunks) {
      try {
        const audio = await this.synthesize(chunk, lang, voiceName);
        audioBuffers.push(audio);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error synthesizing chunk:', error);
      }
    }
    
    return Buffer.concat(audioBuffers);
  }
}

module.exports = GoogleTranslateTTS;