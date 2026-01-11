# Using Expo Environment Variables

## ✅ Your Setup is Complete!

You've already configured all environment variables on Expo.dev. The code is **already set up** to automatically use them!

## How It Works

### 1. **Constants Files** (Already Configured)
- `app/constants/platforms.ts` - Reads from `EXPO_PUBLIC_PLATFORMS`
- `app/constants/tones.ts` - Reads from `EXPO_PUBLIC_TONES`
- Both have fallback defaults if env vars aren't available

### 2. **Tools** (Already Using Env Vars)
- All tools use `process.env.EXPO_PUBLIC_BACKEND_URL` for API calls
- Platform and tone dropdowns automatically use values from environment variables

## Variables You've Set on Expo.dev

Based on your Expo dashboard, you have:

✅ **EXPO_PUBLIC_BACKEND_URL** - Backend API URL  
✅ **EXPO_PUBLIC_PLATFORMS** - Platform configuration (JSON)  
✅ **EXPO_PUBLIC_DEFAULT_PLATFORM** - Default platform  
✅ **EXPO_PUBLIC_TONES** - Tone configuration (JSON)  
✅ **EXPO_PUBLIC_DEFAULT_TONE** - Default tone  
✅ **GEMINI_API_KEY** - API key (for backend use)

## How to Verify It's Working

### Option 1: Check Console Logs
When you start the app, check the console. The constants files will log warnings if environment variables fail to parse (they'll fall back to defaults).

### Option 2: Test in App
1. Open any tool (Caption, Bio, etc.)
2. Check the Platform dropdown - it should show platforms from your `EXPO_PUBLIC_PLATFORMS`
3. Check the Tone dropdown (in Caption tool) - it should show tones from your `EXPO_PUBLIC_TONES`

### Option 3: Use Debug Utility
You can temporarily add this to any component to check:

```typescript
import { PLATFORMS, TONES, DEFAULT_PLATFORM, DEFAULT_TONE } from '@/app/constants';

console.log('Platforms:', PLATFORMS);
console.log('Tones:', TONES);
console.log('Default Platform:', DEFAULT_PLATFORM);
console.log('Default Tone:', DEFAULT_TONE);
```

## Important Notes

### For Development
- Environment variables from Expo.dev are automatically available when you run `expo start`
- No need to create a local `.env` file (unless you want different values locally)

### For Production Builds
- EAS Build automatically uses environment variables from Expo.dev
- Make sure variables are set for the correct environment (development/preview/production)

### For Local Development
If you want to override Expo.dev variables locally:
1. Create a `.env` file in project root
2. Add your variables (they'll take precedence)
3. Restart Expo dev server

## Updating Variables

### On Expo.dev
1. Go to your project → Environment variables
2. Edit the variable value
3. Variables are automatically available (may need to restart dev server)

### Adding New Platforms/Tones
1. Edit `EXPO_PUBLIC_PLATFORMS` or `EXPO_PUBLIC_TONES` on Expo.dev
2. Update the JSON array with your new platform/tone
3. Restart your app

**Example - Adding Pinterest:**
```json
[
  {"value":"instagram","label":"Instagram","characterLimit":2200},
  {"value":"pinterest","label":"Pinterest","characterLimit":500}
]
```

## Troubleshooting

**Variables not updating?**
- Restart Expo dev server: `expo start --clear`
- For production builds, create a new build after updating variables

**Using defaults instead of env vars?**
- Check that variable names start with `EXPO_PUBLIC_`
- Verify JSON is valid (use a JSON validator)
- Check console for parsing errors

**Backend URL not working?**
- Verify `EXPO_PUBLIC_BACKEND_URL` is set correctly
- Check CORS settings on your backend
- For local development, use `http://localhost:8000`
- For production, use your deployed backend URL

## Current Status

✅ Code is configured to use environment variables  
✅ Constants load from `EXPO_PUBLIC_PLATFORMS` and `EXPO_PUBLIC_TONES`  
✅ Tools use `EXPO_PUBLIC_BACKEND_URL` for API calls  
✅ Fallback defaults ensure app always works  
✅ Variables are set on Expo.dev  

**You're all set!** The app will automatically use the environment variables you've configured on Expo.dev.
