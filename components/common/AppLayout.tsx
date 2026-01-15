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
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import InteractiveBackground from './InteractiveBackground';

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

import {View} from 'react-native';

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
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none'}}>
                <InteractiveBackground />
            </View>
            <AppHeader showBack={showBack} showWishlist={showWishlist} showSettings={showSettings} extraButton={extraButton} />
            <View className='flex-1 overflow-auto h-full'>
                {showContent ? <View className='mx-auto p-6 w-full'>{children}</View> : children}
                {showFooter && <AppFooter />}
            </View>
        </AppContainer>
    );
}
