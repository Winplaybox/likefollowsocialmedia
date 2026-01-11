/**
 * Platform Configuration
 * Loads strictly from Environment Variables.
 */

export interface Platform {
  value: string;
  label: string;
  characterLimit?: number;
  iconName: string;
  description: string;
}

// 1. Strict Loader (No hardcoded defaults)
const loadPlatforms = (): Platform[] => {
  try {
    const envString = process.env.EXPO_PUBLIC_PLATFORMS?.trim();
    
    // If env is missing, return empty array (App runs, but shows no tools)
    if (!envString) {
      console.warn('⚠️ No platforms found in EXPO_PUBLIC_PLATFORMS');
      return []; 
    }

    const parsed = JSON.parse(envString);
    
    if (Array.isArray(parsed)) {
      return parsed;
    }
    
    return [];

  } catch (error) {
    console.error('🔴 Error parsing EXPO_PUBLIC_PLATFORMS. Check your .env syntax.',process.env.EXPO_PUBLIC_PLATFORMS?.trim());
    return [];
  }
};

export const PLATFORMS: Platform[] = loadPlatforms();

// Helpers
export const getPlatform = (value: string): Platform | undefined => {
  return PLATFORMS.find((platform) => platform.value === value);
};

export const getPlatformLimit = (platformValue: string): number | undefined => {
  return getPlatform(platformValue)?.characterLimit;
};

export const getPlatformLabel = (platformValue: string): string => {
  return getPlatform(platformValue)?.label || platformValue;
};

// Default is now dynamic based on the first platform in the list, or safe fallback
export const DEFAULT_PLATFORM = process.env.EXPO_PUBLIC_DEFAULT_PLATFORM || PLATFORMS[0]?.value || 'instagram';