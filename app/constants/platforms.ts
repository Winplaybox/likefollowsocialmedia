/**
 * Platform Configuration
 * Centralized management of social media platforms, their display names, and character limits
 */

export interface Platform {
  value: string;
  label: string;
  characterLimit?: number;
  icon?: string; // For future icon support
}

export const PLATFORMS: Platform[] = [
  {
    value: 'instagram',
    label: 'Instagram',
    characterLimit: 2200, // Instagram caption limit
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    characterLimit: 2200, // TikTok caption limit
  },
  {
    value: 'youtube',
    label: 'YouTube',
    characterLimit: 5000, // YouTube description limit
  },
  {
    value: 'twitter',
    label: 'Twitter',
    characterLimit: 280, // Twitter/X character limit
  },
  {
    value: 'facebook',
    label: 'Facebook',
    characterLimit: 63206, // Facebook post limit
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    characterLimit: 3000, // LinkedIn post limit
  },
];

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
 * Default platform
 */
export const DEFAULT_PLATFORM = 'instagram';
