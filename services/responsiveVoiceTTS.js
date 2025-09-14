// Alternative free TTS engines for different voices
class ResponsiveVoiceTTS {
  
  // Use different free TTS APIs for each voice
  async synthesize(text, voiceName) {
    switch(voiceName.toLowerCase()) {
      case 'kavya':
        return this.useVoiceRSS(text, 'hi-in', 'female');
      
      case 'dhruv':
        return this.useNaturalReaders(text, 'hi', 'male');
      
      case 'arjun':
        return this.useTTSMP3(text, 'hi', 'male');
      
      case 'priya':
        return this.useVoiceRSS(text, 'hi-in', 'female', 'soft');
      
      case 'aditi':
        return this.useBingTTS(text, 'hi-IN');
      
      case 'ravi':
        return this.useVoiceRSS(text, 'hi-in', 'male', 'deep');
      
      case 'ananya':
        return this.useTTSMP3(text, 'hi', 'female', 'fast');
      
      default:
        return this.useVoiceRSS(text, 'hi-in', 'female');
    }
  }

  // VoiceRSS API (Free)
  async useVoiceRSS(text, lang, gender, style = 'normal') {
    const url = `http://api.voicerss.org/?key=demo&hl=${lang}&src=${encodeURIComponent(text)}&f=44khz_16bit_mono`;
    return this.fetchAudio(url);
  }

  // Natural Readers API
  async useNaturalReaders(text, lang, gender) {
    // Fallback implementation
    return this.useVoiceRSS(text, 'hi-in', gender);
  }

  // TTS-MP3 API
  async useTTSMP3(text, lang, gender, speed = 'normal') {
    const url = `https://tts-mp3.com/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
    return this.fetchAudio(url);
  }

  // Bing TTS
  async useBingTTS(text, lang) {
    return this.useVoiceRSS(text, 'hi-in', 'female');
  }

  async fetchAudio(url) {
    const https = require('https');
    const http = require('http');
    
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, {
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
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }
}

module.exports = ResponsiveVoiceTTS;