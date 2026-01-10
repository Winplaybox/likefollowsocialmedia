# Like Follow Social Media

Social media content generation platform with AI-powered features using Expo React Native frontend and Python FastAPI backend.

## Project Structure

```
likefollowsocialmedia/
├── frontend/                 # Expo React Native App
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
└── package.json            # Root package.json
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

# General development
npm start
```

## Backend (Python FastAPI)

REST API for content generation and data processing.

### Setup

```bash
cd backend
pip install -r requirements.txt
```

### Configuration

Create/update `.env` file:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:8081
DEBUG=True
PORT=5000
```

### Running

```bash
python server.py
```

API will be available at `http://localhost:5000`

- Docs: `http://localhost:5000/docs`
- Health check: `http://localhost:5000/health`

## Quick Start (All-in-One)

From the root directory:

```bash
# Install all dependencies
npm install

# Start backend
npm run backend

# In another terminal, start frontend
npm run frontend
```

## Features

- 📸 **Vision Tool** - Image-to-Hashtag generation
- ✍️ **Caption Tool** - AI-powered caption generation
- 👤 **Bio Tool** - Profile bio optimization
- 💬 **Comment Tool** - Smart comment suggestions
- 🔄 **Remix Tool** - Cross-platform content adaptation
- 🔥 **Roast Tool** - Profile roasting/feedback

## Tech Stack

### Frontend
- **Framework**: Expo (React Native)
- **Styling**: Tailwind CSS + NativeWind
- **Routing**: Expo Router
- **UI Components**: Lucide icons, Custom components

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Validation**: Pydantic
- **CORS**: Enabled for frontend communication

## API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /` - Root endpoint
- `GET /status` - Backend health status
- `POST /generate-content` - Generate content

## Environment Variables

### Frontend
Set `REACT_APP_BACKEND_URL` in frontend `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Backend
Set in `backend/.env`:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:8081,http://localhost:5000,http://localhost:19000
DEBUG=True
PORT=5000
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

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
