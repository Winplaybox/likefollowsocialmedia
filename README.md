Based on the information you provided, here's an updated version of your README file:

# Like Follow Social Media

Social media content generation platform with AI-powered features using Expo React Native frontend and Python FastAPI backend.

## Project Structure

```
likefollowsocialmedia/
├── app/                 # Expo React Native App
│   ├── pages/                 # Route definitions
│   ├── components/          # UI components
│   │   ├── tools/          # Content generation tools
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # React hooks
│   ├── constants/          # App constants
│   ├── package.json
│   ├── app.json
│   └── babel.config.js
│
├── backend/                 # Python FastAPI Backend
│   ├── server.py           # Main application
│   ├── requirements.txt     # Python dependencies
│   └── .env               # Environment variables
│
└── README.md               # Project documentation
```

## Frontend (Expo React Native)

The mobile app for iOS, Android, and web platforms.

### Setup

```bash
cd frontend
npm install
```

### Running

```bash
# Web
npm run web

# iOS
npm run ios

# Android
npm run android
```

## Backend (Python FastAPI)

The backend API for social media content generation.

### Setup

```bash
cd backend
pip install -r requirements.txt
```

### Running

```bash
uvicorn server:app --reload
```

## Environment Variables

The following environment variables are used in the backend:

```
DEBUG=True
PORT=5000
CORS_ORIGINS=<comma-separated list of allowed CORS origins>
```

## Development

### Frontend Changes

- Modify files in `frontend/pages/`, `frontend/components/`, etc.
- Hot reload is enabled by default

### Backend Changes

- Modify `backend/server.py`
- Server will restart automatically with `reload=True`

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

I hope this helps! Let me know if you need any further assistance.