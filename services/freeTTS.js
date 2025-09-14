class FreeTTSService {
  // Web Speech API - completely free, works in browser
  synthesizeWithWebAPI(text, voice = 'Google US English', rate = 1, pitch = 1) {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes(voice));
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      utterance.onend = () => resolve('Speech completed');
      utterance.onerror = (e) => reject(e);
      
      speechSynthesis.speak(utterance);
    });
  }

  // Get available voices
  getAvailableVoices() {
    return speechSynthesis.getVoices().map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male'
    }));
  }
}

module.exports = FreeTTSService;