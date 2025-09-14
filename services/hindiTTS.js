// Best Hindi TTS providers and voices
const hindiVoices = {
  google: {
    'hi-IN': [
      { name: 'hi-IN-Standard-A', gender: 'FEMALE', quality: 'standard' },
      { name: 'hi-IN-Standard-B', gender: 'MALE', quality: 'standard' },
      { name: 'hi-IN-Standard-C', gender: 'MALE', quality: 'standard' },
      { name: 'hi-IN-Standard-D', gender: 'FEMALE', quality: 'standard' },
      { name: 'hi-IN-Wavenet-A', gender: 'FEMALE', quality: 'premium' },
      { name: 'hi-IN-Wavenet-B', gender: 'MALE', quality: 'premium' },
      { name: 'hi-IN-Wavenet-C', gender: 'MALE', quality: 'premium' },
      { name: 'hi-IN-Wavenet-D', gender: 'FEMALE', quality: 'premium' }
    ]
  },
  azure: {
    'hi-IN': [
      { name: 'hi-IN-MadhurNeural', gender: 'MALE', quality: 'neural' },
      { name: 'hi-IN-SwaraNeural', gender: 'FEMALE', quality: 'neural' }
    ]
  },
  polly: {
    'hi-IN': [
      { name: 'Aditi', gender: 'FEMALE', quality: 'standard', note: 'Bilingual Hindi/English' }
    ]
  }
};

// Enhanced Hindi synthesis with proper pronunciation
async function synthesizeHindi(text, provider = 'google', voice = 'hi-IN-Standard-A') {
  // Add SSML for better Hindi pronunciation
  const ssmlText = `<speak>
    <prosody rate="medium" pitch="medium">
      ${text}
    </prosody>
  </speak>`;

  const options = {
    text: ssmlText,
    provider,
    language: 'hi-IN',
    voice,
    textType: 'ssml'
  };

  return options;
}

module.exports = { hindiVoices, synthesizeHindi };