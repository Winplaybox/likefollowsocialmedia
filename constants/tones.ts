/**
 * Copyright (c) 2026 Winplaybox
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 *
 * Proprietary and confidential.
 */
/**
 * Tone Configuration
 * Centralized management of content tones/styles
 *
 * Tones are loaded from environment variables (EXPO_PUBLIC_TONES) with fallback to defaults
 * To update tones, modify the .env file or set EXPO_PUBLIC_TONES environment variable
 */

export interface Tone {
    value: string;
    label: string;
    description?: string;
}

// // Default tones (fallback if env var is not set)
// const DEFAULT_TONES: Tone[] = [
//   {
//     value: 'engaging',
//     label: 'Engaging',
//     description: 'Captivating and interactive content',
//   },
//   {
//     value: 'professional',
//     label: 'Professional',
//     description: 'Formal and business-appropriate',
//   },
//   {
//     value: 'fun',
//     label: 'Fun',
//     description: 'Light-hearted and entertaining',
//   },
//   {
//     value: 'inspirational',
//     label: 'Inspirational',
//     description: 'Motivational and uplifting',
//   },
//   {
//     value: 'casual',
//     label: 'Casual',
//     description: 'Relaxed and conversational',
//   },
//   {
//     value: 'humorous',
//     label: 'Humorous',
//     description: 'Funny and witty',
//   },
//   {
//     value: 'educational',
//     label: 'Educational',
//     description: 'Informative and instructional',
//   },
//   {
//     value: 'persuasive',
//     label: 'Persuasive',
//     description: 'Convincing and compelling',
//   },
// ];

// /**
//  * Load tones from environment variable or use defaults
//  */
// const loadTones = (): Tone[] => {
//   let tones:Tone[] = [];
//   const envTones = process.env.EXPO_PUBLIC_TONES;
//     if (envTones) {
//       const parsed = JSON.parse(envTones);
//       if (Array.isArray(parsed) && parsed.length > 0) {
//         tones = parsed as Tone[];
//       }
//     }
//     return tones;
// };

export const TONES: Tone[] = JSON.parse(process.env.EXPO_PUBLIC_TONES?.trim() || '[]');

/**
 * Get tone by value
 */
export const getTone = (value: string): Tone | undefined => {
    return TONES.find((tone) => tone.value === value);
};

/**
 * Get tone label
 */
export const getToneLabel = (toneValue: string): string => {
    return getTone(toneValue)?.label || toneValue;
};

/**
 * Default tone (from env or fallback)
 */
export const DEFAULT_TONE = process.env.EXPO_PUBLIC_DEFAULT_TONE || 'engaging';
