const TTSService = require('./ttsService');

class EnhancedTTSService extends TTSService {
  constructor() {
    super();
    this.cache = new Map(); // Simple in-memory cache
  }

  // Enhanced synthesis with caching and optimization
  async synthesizeEnhanced(options) {
    const { text, provider, language, voice, speed = 1.0, pitch = 0, volume = 0 } = options;
    
    // Create cache key
    const cacheKey = `${provider}-${language}-${voice}-${speed}-${pitch}-${volume}-${this.hashText(text)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let audioBuffer;

    switch (provider) {
      case 'google':
        audioBuffer = await this.synthesizeWithGoogleEnhanced(text, language, voice, { speed, pitch, volume });
        break;
      case 'polly':
        audioBuffer = await this.synthesizeWithPollyEnhanced(text, language, voice, { speed, pitch });
        break;
      case 'azure':
        audioBuffer = await this.synthesizeWithAzureEnhanced(text, language, voice, { speed, pitch });
        break;
      default:
        throw new Error('Invalid provider');
    }

    // Cache the result (limit cache size)
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, audioBuffer);

    return audioBuffer;
  }

  async synthesizeWithGoogleEnhanced(text, languageCode, voiceName, options) {
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: options.speed,
        pitch: options.pitch,
        volumeGainDb: options.volume
      }
    };

    const [response] = await this.googleClient.synthesizeSpeech(request);
    return response.audioContent;
  }

  async synthesizeWithPollyEnhanced(text, languageCode, voiceId, options) {
    // Use SSML for enhanced control
    const ssmlText = `<speak><prosody rate="${options.speed * 100}%" pitch="${options.pitch > 0 ? '+' : ''}${options.pitch}%">${text}</prosody></speak>`;
    
    const params = {
      Text: ssmlText,
      TextType: 'ssml',
      OutputFormat: 'mp3',
      VoiceId: voiceId,
      LanguageCode: languageCode,
      Engine: 'neural' // Use neural engine for better quality
    };

    const result = await this.polly.synthesizeSpeech(params).promise();
    return result.AudioStream;
  }

  async synthesizeWithAzureEnhanced(text, languageCode, voiceName, options) {
    // Create SSML with prosody controls
    const ssmlText = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${languageCode}">
      <voice name="${voiceName}">
        <prosody rate="${options.speed}" pitch="${options.pitch > 0 ? '+' : ''}${options.pitch}%">
          ${text}
        </prosody>
      </voice>
    </speak>`;

    const speechConfig = sdk.SpeechConfig.fromSubscription(this.azureKey, this.azureRegion);
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    
    return new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(ssmlText, result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(result.audioData);
        } else {
          reject(new Error(result.errorDetails));
        }
        synthesizer.close();
      });
    });
  }

  // Batch processing for multiple texts
  async batchSynthesize(requests) {
    const results = [];
    
    for (const request of requests) {
      try {
        const audio = await this.synthesizeEnhanced(request);
        results.push({ success: true, audio, request });
      } catch (error) {
        results.push({ success: false, error: error.message, request });
      }
    }

    return results;
  }

  // Voice analysis and recommendation
  getVoiceRecommendations(language, gender, useCase = 'general') {
    const recommendations = {
      'en-US': {
        'professional': ['en-US-Wavenet-A', 'en-US-Wavenet-D'],
        'casual': ['en-US-Wavenet-B', 'en-US-Wavenet-C'],
        'storytelling': ['en-US-Wavenet-F', 'en-US-Wavenet-G']
      },
      'en-IN': {
        'professional': ['en-IN-Wavenet-A', 'en-IN-Wavenet-D'],
        'casual': ['en-IN-Wavenet-B', 'en-IN-Wavenet-C']
      },
      'hi-IN': {
        'professional': ['hi-IN-Wavenet-A', 'hi-IN-Wavenet-D'],
        'casual': ['hi-IN-Wavenet-B', 'hi-IN-Wavenet-C']
      }
    };

    return recommendations[language]?.[useCase] || recommendations[language]?.['professional'] || [];
  }

  hashText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
}

module.exports = EnhancedTTSService;