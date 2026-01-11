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
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Settings } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AppHeaderProps {
  showBack?: boolean;
  showWishlist?: boolean;
  showSettings?: boolean;
  extraButton?: React.ReactNode;
}

export default function AppHeader({
  showBack = false,
  showWishlist = false,
  showSettings = false,
  extraButton
}: AppHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <nav className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center border-b border-white/10 bg-transparent w-full">
      {/* Left: Back button */}
      <div className="flex-1 flex items-center min-w-0">
        {showBack && (
          <button
            onClick={() => router.back()}
            data-testid="back-button"
            className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t('app.back')}</span>
          </button>
        )}
      </div>
      {/* Center: Logo */}
      <div className="flex-1 flex justify-center min-w-0">
        <div className="text-2xl font-bold select-none truncate">
          <span className="text-[#CCFF00]">{t('app.title').replace('Hero', '')}</span>
          <span className="text-white">Hero</span>
        </div>
      </div>
      {/* Right: Wishlist, Settings, Extra */}
      <div className="flex-1 flex justify-end items-center gap-2 min-w-0">
        {showWishlist && (
          <button
            title="wishlist"
            onClick={() => router.push({ pathname: '/wishlist' })}
            data-testid="wishlist-button"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all text-sm sm:text-base"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">{t('app.wishlist')}</span>
          </button>
        )}
        {showSettings && (
          <button
            onClick={() => router.push('/settings')}
            data-testid="settings-button"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all text-sm sm:text-base"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{t('app.settings')}</span>
          </button>
        )}
        {extraButton}
      </div>
    </nav>
  );
}
