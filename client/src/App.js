import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [languages, setLanguages] = useState({});
  const [selectedProvider, setSelectedProvider] = useState('google');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (selectedLanguage && selectedProvider) {
      fetchVoices();
    }
  }, [selectedLanguage, selectedProvider]);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/voices/all');
      const data = await response.json();
      setLanguages(data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchVoices = async () => {
    try {
      const response = await fetch(`/api/tts/voices/${selectedProvider}/${selectedLanguage}`);
      const data = await response.json();
      setVoices(data.voices || []);
      setSelectedVoice(data.voices?.[0]?.name || data.voices?.[0] || '');
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  const handleConvert = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tts/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          provider: selectedProvider,
          language: selectedLanguage,
          voice: selectedVoice,
          gender: 'NEUTRAL'
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } else {
        alert('Error converting text to speech');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error converting text to speech');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Text-to-Speech Tool</h1>
        <p>Convert text to speech in multiple languages and accents</p>
      </header>

      <main className="main-content">
        <div className="controls">
          <div className="control-group">
            <label>TTS Provider:</label>
            <select 
              value={selectedProvider} 
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              <option value="google">Google Cloud TTS</option>
              <option value="polly">Amazon Polly</option>
              <option value="azure">Azure Speech</option>
            </select>
          </div>

          <div className="control-group">
            <label>Language & Accent:</label>
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {Object.entries(languages).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.name} ({info.accent})
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Voice:</label>
            <select 
              value={selectedVoice} 
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.name || voice}>
                  {voice.name || voice} {voice.gender && `(${voice.gender})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-input">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            rows={6}
          />
        </div>

        <button 
          onClick={handleConvert} 
          disabled={isLoading || !text.trim()}
          className="convert-btn"
        >
          {isLoading ? 'Converting...' : 'Convert to Speech'}
        </button>

        {audioUrl && (
          <div className="audio-player">
            <h3>Generated Audio:</h3>
            <audio controls src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
            <a href={audioUrl} download="speech.mp3" className="download-btn">
              Download Audio
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;