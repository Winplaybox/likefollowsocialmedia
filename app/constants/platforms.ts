/**
 * Platform Configuration
 * Centralized management of social media platforms, their display names, and character limits
 * 
 * Platforms are loaded from environment variables (EXPO_PUBLIC_PLATFORMS) with fallback to defaults
 * To update platforms, modify the .env file or set EXPO_PUBLIC_PLATFORMS environment variable
 */

export interface Platform {
  value: string;
  label: string;
  characterLimit?: number;
  icon?: string; // For future icon support
}

// Default platforms (fallback if env var is not set)
const DEFAULT_PLATFORMS: Platform[] = [
  {
    value: 'instagram',
    label: 'Instagram',
    characterLimit: 2200,
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    characterLimit: 2200,
  },
  {
    value: 'youtube',
    label: 'YouTube',
    characterLimit: 5000,
  },
  {
    value: 'twitter',
    label: 'Twitter',
    characterLimit: 280,
  },
  {
    value: 'facebook',
    label: 'Facebook',
    characterLimit: 63206,
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    characterLimit: 3000,
  },
];

/**
 * Load platforms from environment variable or use defaults
 */
const loadPlatforms = (): Platform[] => {
  try {
    const envPlatforms = process.env.EXPO_PUBLIC_PLATFORMS;
    if (envPlatforms) {
      const parsed = JSON.parse(envPlatforms);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Platform[];
      }
    }
  } catch (error) {
    console.warn('Failed to parse EXPO_PUBLIC_PLATFORMS, using defaults:', error);
  }
  return DEFAULT_PLATFORMS;
};

export const PLATFORMS: Platform[] = loadPlatforms();

/**
 * Get platform by value
 */
export const getPlatform = (value: string): Platform | undefined => {
  return PLATFORMS.find((platform) => platform.value === value);
};

/**
 * Get platform character limit
 */
export const getPlatformLimit = (platformValue: string): number | undefined => {
  return getPlatform(platformValue)?.characterLimit;
};

/**
 * Get platform label
 */
export const getPlatformLabel = (platformValue: string): string => {
  return getPlatform(platformValue)?.label || platformValue;
};

/**
 * Default platform (from env or fallback)
 */
export const DEFAULT_PLATFORM = process.env.EXPO_PUBLIC_DEFAULT_PLATFORM || 'instagram';
