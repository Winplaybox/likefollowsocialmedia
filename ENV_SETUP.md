# Environment Variables Setup Guide

## Quick Start

1. **Copy `.env.example` to `.env`**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** and fill in your values (especially `GEMINI_API_KEY` and `EXPO_PUBLIC_BACKEND_URL`)

3. **Restart your Expo development server** after creating/updating `.env`

## Required Environment Variables

### Backend Configuration

```env
# Your FastAPI backend URL
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
# For production, use: https://your-backend-domain.com
```

### Gemini API Key

```env
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** The Gemini API key is typically used by your backend server. Make sure your backend also has access to this key in its environment variables.

### Platform Configuration

```env
# JSON array of platforms
EXPO_PUBLIC_PLATFORMS=[{"value":"instagram","label":"Instagram","characterLimit":2200},...]

# Default platform
EXPO_PUBLIC_DEFAULT_PLATFORM=instagram
```

### Tone Configuration

```env
# JSON array of tones
EXPO_PUBLIC_TONES=[{"value":"engaging","label":"Engaging","description":"..."},...]

# Default tone
EXPO_PUBLIC_DEFAULT_TONE=engaging
```

## Complete Example `.env` File

```env
# Backend Configuration
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000

# Gemini API Key
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Platforms
EXPO_PUBLIC_PLATFORMS=[{"value":"instagram","label":"Instagram","characterLimit":2200},{"value":"tiktok","label":"TikTok","characterLimit":2200},{"value":"youtube","label":"YouTube","characterLimit":5000}]

EXPO_PUBLIC_DEFAULT_PLATFORM=instagram

# Tones
EXPO_PUBLIC_TONES=[{"value":"engaging","label":"Engaging","description":"Captivating and interactive content"},{"value":"professional","label":"Professional","description":"Formal and business-appropriate"}]

EXPO_PUBLIC_DEFAULT_TONE=engaging
```

## Setting Up Gemini API Key

1. **Get API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Create a new API key
   - Copy the key

2. **Add to `.env`:**
   ```env
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Backend Setup:**
   - Your backend (`app/backend/server.py`) should also read this from environment variables
   - Make sure your backend has access to `GEMINI_API_KEY` in its environment

## Adding New Platforms

Edit your `.env` file and add to the `EXPO_PUBLIC_PLATFORMS` array:

```env
EXPO_PUBLIC_PLATFORMS=[{"value":"instagram","label":"Instagram","characterLimit":2200},{"value":"pinterest","label":"Pinterest","characterLimit":500}]
```

## Adding New Tones

Edit your `.env` file and add to the `EXPO_PUBLIC_TONES` array:

```env
EXPO_PUBLIC_TONES=[{"value":"engaging","label":"Engaging","description":"..."},{"value":"sarcastic","label":"Sarcastic","description":"Witty and ironic"}]
```

## Important Notes

- ✅ **Restart Required**: Always restart Expo dev server after changing `.env`
- ✅ **JSON Format**: Arrays must be valid JSON (no trailing commas, proper quotes)
- ✅ **Public Prefix**: Frontend variables must start with `EXPO_PUBLIC_`
- ✅ **Git Ignored**: `.env` is in `.gitignore` - your secrets stay local
- ✅ **Fallback**: If `.env` is missing, defaults from code will be used
- ⚠️ **Never Commit**: Never commit `.env` file with real API keys

## Production Deployment

### Expo/EAS Build
Set environment variables in EAS Secrets:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_BACKEND_URL --value https://your-backend.com
eas secret:create --scope project --name GEMINI_API_KEY --value your_key_here
```

### Vercel/Netlify
Add environment variables in their dashboard settings.

### Backend Deployment
Make sure your backend also has access to `GEMINI_API_KEY` in its environment variables.
