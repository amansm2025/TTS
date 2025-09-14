# AI Text-to-Speech Tool

A comprehensive TTS tool supporting multiple languages, accents, and voice providers.

## Features

- **Multi-Provider Support**: Google Cloud TTS, Amazon Polly, Azure Speech
- **Multiple Languages**: English (US/UK/India), Hindi, Spanish, French, etc.
- **Accent Support**: American, British, Indian accents
- **Voice Variety**: Male/Female voices with different characteristics
- **High Quality**: Neural and WaveNet voices for premium quality
- **Web Interface**: Modern React-based UI
- **API Support**: RESTful API for integration

## Supported Languages & Accents

### English
- **en-US**: American English (Multiple male/female voices)
- **en-IN**: Indian English (Indian accent, Hindi-influenced)
- **en-GB**: British English (UK accent)

### Hindi
- **hi-IN**: Hindi with Indian accent (Native speakers)

### Other Languages
- Spanish (es-ES), French (fr-FR), German (de-DE), etc.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
cd client && npm install
```

### 2. Configure API Keys

Create `.env` file:
```env
# Copy from .env.example and fill in your API keys
GOOGLE_CREDENTIALS_PATH=./config/google-credentials.json
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AZURE_SPEECH_KEY=your_key
AZURE_SPEECH_REGION=your_region
```

### 3. Get API Keys

#### Google Cloud TTS
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Text-to-Speech API
3. Create service account and download JSON key
4. Place in `config/google-credentials.json`

#### Amazon Polly
1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Create IAM user with Polly permissions
3. Get Access Key ID and Secret Access Key

#### Azure Speech Services
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create Speech Services resource
3. Get subscription key and region

### 4. Run the Application

Development mode:
```bash
# Backend
npm run dev

# Frontend (new terminal)
npm run client
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### Convert Text to Speech
```
POST /api/tts/convert
{
  "text": "Hello world",
  "provider": "google",
  "language": "en-US",
  "voice": "en-US-Wavenet-A",
  "gender": "FEMALE"
}
```

### Get Available Voices
```
GET /api/tts/voices/{provider}/{language}
```

### Get All Languages
```
GET /api/voices/all
```

## Voice Quality Comparison

### Google Cloud TTS
- **Best Quality**: WaveNet voices (premium)
- **Good Coverage**: 220+ voices, 40+ languages
- **Indian Accent**: Excellent en-IN and hi-IN support

### Amazon Polly
- **Neural Voices**: High quality, natural sounding
- **Good Indian Support**: Aditi voice for Hindi/English
- **Cost Effective**: Pay per character

### Azure Speech Services
- **Neural Voices**: Very natural sounding
- **Good Variety**: Multiple voice styles
- **Real-time**: Low latency synthesis

## Advanced Features

### Voice Customization
- Speed control (0.25x to 4x)
- Pitch adjustment (-20 to +20 semitones)
- Volume control
- SSML support for advanced control

### Batch Processing
- Convert multiple texts
- Different voices per text
- Export as ZIP

### Voice Cloning (Premium)
- ElevenLabs integration
- Custom voice training
- Personal voice models

## Deployment

### Docker
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Heroku**: Easy deployment with buildpacks
- **AWS**: EC2 + S3 for audio storage
- **Google Cloud**: App Engine + Cloud Storage
- **Azure**: App Service + Blob Storage

## Cost Optimization

1. **Caching**: Store frequently used audio
2. **Compression**: Use efficient audio formats
3. **Provider Selection**: Choose based on cost/quality
4. **Batch Processing**: Reduce API calls

## Security

- API key encryption
- Rate limiting
- Input validation
- CORS configuration
- HTTPS enforcement