# Constants Configuration

This directory contains centralized configuration for platforms, tones, and other constants.

## Environment Variables

Platforms and tones are now managed through Expo environment variables for easy configuration without code changes.

### Setup

1. **Create a `.env` file** in the project root (copy from `.env.example` if it exists)

2. **Configure Platforms** using `EXPO_PUBLIC_PLATFORMS`:
   ```env
   EXPO_PUBLIC_PLATFORMS=[{"value":"instagram","label":"Instagram","characterLimit":2200},{"value":"tiktok","label":"TikTok","characterLimit":2200}]
   ```

3. **Configure Tones** using `EXPO_PUBLIC_TONES`:
   ```env
   EXPO_PUBLIC_TONES=[{"value":"engaging","label":"Engaging","description":"Captivating content"},{"value":"professional","label":"Professional","description":"Formal content"}]
   ```

4. **Set Defaults**:
   ```env
   EXPO_PUBLIC_DEFAULT_PLATFORM=instagram
   EXPO_PUBLIC_DEFAULT_TONE=engaging
   ```

### Adding New Platforms

To add a new platform, update your `.env` file:

```env
EXPO_PUBLIC_PLATFORMS=[{"value":"instagram","label":"Instagram","characterLimit":2200},{"value":"pinterest","label":"Pinterest","characterLimit":500}]
```

### Adding New Tones

To add a new tone, update your `.env` file:

```env
EXPO_PUBLIC_TONES=[{"value":"engaging","label":"Engaging","description":"..."},{"value":"sarcastic","label":"Sarcastic","description":"Witty and ironic"}]
```

### Fallback Behavior

If environment variables are not set or invalid, the system will fall back to default values defined in the TypeScript files. This ensures the app always works even if `.env` is missing.

### Important Notes

- **Restart Required**: After changing `.env` file, restart your Expo development server
- **Public Variables**: All variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app
- **JSON Format**: Platform and tone arrays must be valid JSON strings
- **Git**: The `.env` file is gitignored - never commit sensitive data

### Example `.env` File

```env
# Platforms Configuration
EXPO_PUBLIC_PLATFORMS=[{"value":"instagram","label":"Instagram","characterLimit":2200},{"value":"tiktok","label":"TikTok","characterLimit":2200},{"value":"youtube","label":"YouTube","characterLimit":5000}]

# Default Platform
EXPO_PUBLIC_DEFAULT_PLATFORM=instagram

# Tones Configuration
EXPO_PUBLIC_TONES=[{"value":"engaging","label":"Engaging","description":"Captivating and interactive content"},{"value":"professional","label":"Professional","description":"Formal and business-appropriate"}]

# Default Tone
EXPO_PUBLIC_DEFAULT_TONE=engaging
```
