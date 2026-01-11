
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

import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { toast } from 'sonner';


interface ResultDisplayProps {
  result?: string;
  characterCount?: number;
  platformLimit?: number;
  copyLabel?: string;
  saveLabel?: string;
  saveType?: string; // e.g. 'Caption', 'Comment', etc.
  typeLabel?: string;
  error?: string;
  placeholder?: string;
  icon?: {
    type: 'svg' | 'icon';
    path: string | React.ReactNode;
  };
}

export default function ResultDisplay({
  result,
  characterCount,
  platformLimit,
  copyLabel = 'Copy',
  saveLabel = 'Save',
  saveType = 'Result',
  typeLabel,
  error,
  placeholder,
  icon
}: ResultDisplayProps) {
  // If you want to use translations, import useTranslation and use t('...') here
  const handleCopy = async () => {
    if (!result) return;
    await Clipboard.setStringAsync(result);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async () => {
    if (!result) return;
    // You may want to add logic to save the result to AsyncStorage or elsewhere
    toast.success('Saved to wishlist!');
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
      )}
      {result ? (
        <>
          <div className="bg-black/50 rounded-xl p-6 mb-4 min-h-[120px]">
            <p className="text-white leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
          {typeof characterCount === 'number' && typeof platformLimit === 'number' && (
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-[#A1A1AA]">{characterCount} characters</span>
              <span className={characterCount > platformLimit ? 'text-red-400' : 'text-[#CCFF00]'}>
                {characterCount} / {platformLimit}
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              {copyLabel}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] rounded-xl hover:bg-[#CCFF00]/20 transition-all flex items-center justify-center gap-2"
            >
              {saveLabel}
            </button>
          </div>
        </>
      ) : (
        <>
          {icon && (
            <div className="inline-flex p-6 bg-white/5 rounded-full mb-4">
              {icon.type === 'icon' ? icon.path : (
                <svg className="w-12 h-12 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon.path as string} />
                </svg>
              )}
            </div>
          )}
          <p className="text-[#A1A1AA]">{placeholder || 'No result yet.'}</p>
        </>
      )}
    </div>
  );
}
