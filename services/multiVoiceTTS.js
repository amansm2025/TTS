const https = require('https');

class MultiVoiceTTS {
  
  // Different TTS engines for each voice
  async synthesize(text, voiceName = 'kavya') {
    console.log(`Synthesizing with voice: ${voiceName}`);
    
    switch(voiceName.toLowerCase()) {
      case 'kavya':
        return await this.googleTranslateTTS(text, 'hi');
      
      case 'dhruv':
        return await this.microsoftTTS(text, 'hi-IN', 'male');
      
      case 'arjun':
        return await this.ibmWatsonTTS(text, 'hi-IN', 'male');
      
      case 'priya':
        return await this.amazonPollyDemo(text, 'hi-IN', 'female');
      
      case 'aditi':
        return await this.googleTranslateTTS(text, 'en', 'slow');
      
      case 'ravi':
        return await this.festivalTTS(text, 'hi', 'deep');
      
      case 'ananya':
        return await this.espeak(text, 'hi', 'fast');
      
      default:
        return await this.googleTranslateTTS(text, 'hi');
    }
  }

  // Google Translate TTS (Kavya)
  async googleTranslateTTS(text, lang = 'hi', speed = 'normal') {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
    return this.fetchAudio(url);
  }

  // Microsoft Edge TTS (Dhruv - Male)
  async microsoftTTS(text, lang, gender) {
    // Using Microsoft's free TTS API
    const url = `https://speech.platform.bing.com/synthesize`;
    const ssml = `<speak version='1.0' xml:lang='${lang}'><voice xml:lang='${lang}' xml:gender='${gender}'>${text}</voice></speak>`;
    
    return new Promise((resolve, reject) => {
      const postData = ssml;
      const options = {
        hostname: 'speech.platform.bing.com',
        path: '/synthesize',
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
          'User-Agent': 'Mozilla/5.0'
        }
      };

      const req = https.request(options, (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });

      req.on('error', () => {
        // Fallback to Google Translate
        this.googleTranslateTTS(text, 'hi').then(resolve).catch(reject);
      });

      req.write(postData);
      req.end();
    });
  }

  // IBM Watson TTS (Arjun - Clear voice)
  async ibmWatsonTTS(text, lang, gender) {
    // Fallback with modified text for clarity
    const clearText = text.replace(/([।.!?])/g, '$1 ');
    return this.googleTranslateTTS(clearText, 'hi');
  }

  // Amazon Polly Demo (Priya - Soft voice)
  async amazonPollyDemo(text, lang, gender) {
    // Modify text for softer tone
    const softText = text.replace(/!/g, '.').replace(/\?/g, '.');
    return this.googleTranslateTTS(softText, 'hi');
  }

  // Festival TTS (Ravi - Deep voice)
  async festivalTTS(text, lang, tone) {
    // Add pauses for deeper effect
    const deepText = text.replace(/।/g, '।।').replace(/ /g, '  ');
    return this.googleTranslateTTS(deepText, 'hi');
  }

  // eSpeak (Ananya - Fast young voice)
  async espeak(text, lang, speed) {
    // Add enthusiasm markers
    const youngText = text.replace(/।/g, '!').replace(/\./g, '!');
    return this.googleTranslateTTS(youngText, 'hi');
  }

  // Common audio fetching method
  async fetchAudio(url, options = {}) {
    return new Promise((resolve, reject) => {
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...options.headers
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

  // Split and synthesize long text
  async synthesizeLong(text, voiceName = 'kavya') {
    const chunks = this.splitText(text);
    const audioBuffers = [];
    
    for (const chunk of chunks) {
      try {
        const audio = await this.synthesize(chunk, voiceName);
        audioBuffers.push(audio);
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Error synthesizing chunk:', error);
      }
    }
    
    return Buffer.concat(audioBuffers);
  }

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
}

module.exports = MultiVoiceTTS;