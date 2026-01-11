/**
 * Tone Configuration
 * Centralized management of content tones/styles
 */

export interface Tone {
  value: string;
  label: string;
  description?: string;
}

export const TONES: Tone[] = [
  {
    value: 'engaging',
    label: 'Engaging',
    description: 'Captivating and interactive content',
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and business-appropriate',
  },
  {
    value: 'fun',
    label: 'Fun',
    description: 'Light-hearted and entertaining',
  },
  {
    value: 'inspirational',
    label: 'Inspirational',
    description: 'Motivational and uplifting',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed and conversational',
  },
  {
    value: 'humorous',
    label: 'Humorous',
    description: 'Funny and witty',
  },
  {
    value: 'educational',
    label: 'Educational',
    description: 'Informative and instructional',
  },
  {
    value: 'persuasive',
    label: 'Persuasive',
    description: 'Convincing and compelling',
  },
];

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
 * Default tone
 */
export const DEFAULT_TONE = 'engaging';
