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
import React from 'react';
import AppContainer from './AppContainer';
import AppContent from './AppContent';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

interface AppLayoutProps {
    children: React.ReactNode;
    showBack?: boolean;
    showWishlist?: boolean;
    showSettings?: boolean;
    extraButton?: React.ReactNode;
    className?: string;
    showFooter?: boolean;
    showContent?: boolean;
}

export default function AppLayout({
    children,
    showBack = false,
    showWishlist = false,
    showSettings = false,
    extraButton,
    className = '',
    showFooter = true,
    showContent = true,
}: AppLayoutProps) {
    return (
        <AppContainer className={className}>
            {/* Background Effect */}
            <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-[#CCFF00] opacity-5 blur-[100px] pointer-events-none' />
            <AppHeader showBack={showBack} showWishlist={showWishlist} showSettings={showSettings} extraButton={extraButton} />
            {showContent ? <AppContent>{children}</AppContent> : children}
            {showFooter && <AppFooter />}
        </AppContainer>
    );
}
