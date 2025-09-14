// Free Hindi TTS without credit card
class FreeHindiTTS {
  
  // Method 1: Web Speech API (Browser-based)
  static synthesizeWithBrowser(text, lang = 'hi-IN') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Find Hindi voice
    const voices = speechSynthesis.getVoices();
    const hindiVoice = voices.find(voice => 
      voice.lang.includes('hi') || 
      voice.name.toLowerCase().includes('hindi')
    );
    
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    
    speechSynthesis.speak(utterance);
  }

  // Method 2: ResponsiveVoice (Free API)
  static synthesizeWithResponsiveVoice(text) {
    // Add this script to HTML: https://code.responsivevoice.org/responsivevoice.js
    if (window.responsiveVoice) {
      responsiveVoice.speak(text, "Hindi Female", {rate: 0.9});
    }
  }
}

module.exports = FreeHindiTTS;