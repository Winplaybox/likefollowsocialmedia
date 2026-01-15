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
import {NameSpace} from '@/types/Enums';
import {useRouter} from 'expo-router';
import {Bookmark, Menu, Settings, X} from 'lucide-react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Text, View} from 'react-native';

interface AppHeaderProps {
    showBack?: boolean;
    showWishlist?: boolean;
    showSettings?: boolean;
    extraButton?: React.ReactNode;
}

export default function AppHeader({showBack = false, showWishlist = false, showSettings = false, extraButton}: AppHeaderProps) {
    const router = useRouter();
    const {t} = useTranslation(NameSpace.Common);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <>
            <View className='z-50 bg-white/85 backdrop-blur-[5px] border-b border-black/[0.03] h-[52px] flex flex-row items-center justify-between px-6'>
                {/* Left: Logo */}
                <Pressable onPress={() => router.replace('/')} className='flex flex-row items-center gap-2 active:opacity-70'>
                    <Text className='text-[18px] font-[450] text-[#121317] tracking-tight'>
                        {t('app.title1')} <Text className='font-normal text-[#45474D]'>{t('app.title2')}</Text>
                    </Text>
                </Pressable>

                {/* Right: Actions */}
                <View className='flex flex-row items-center gap-2'>
                    <View className='hidden md:flex flex-row items-center gap-2'>
                        {[
                            {
                                label: 'app.viewWishlist',
                                onPress: () => router.push('/wishlist'),
                                show: showWishlist,
                            },
                            {
                                label: 'app.settings',
                                onPress: () => router.push('/settings'),
                                show: showSettings,
                            },
                        ].map(
                            (item) =>
                                item.show && (
                                    <Pressable
                                        key={item.label}
                                        onPress={item.onPress}
                                        className='w-8 h-8 items-center justify-center rounded-full active:bg-black/[0.04]'
                                    >
                                        {item.label === 'app.viewWishlist' ? (
                                            <Bookmark size={16} color='#45474D' strokeWidth={1.5} />
                                        ) : (
                                            <Settings size={16} color='#45474D' strokeWidth={1.5} />
                                        )}
                                    </Pressable>
                                )
                        )}
                    </View>

                    {/* Stylized Menu Button for Mobile */}
                    <Pressable onPress={() => setIsMenuOpen(!isMenuOpen)} className='p-1 rounded-full active:bg-black/[0.04] md:hidden'>
                        {isMenuOpen ? (
                            <X size={16} color='#45474D' strokeWidth={1.5} />
                        ) : (
                            <Menu size={16} color='#45474D' strokeWidth={1.5} />
                        )}
                    </Pressable>
                </View>
            </View>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <View className='absolute top-[52px] left-0 right-0 z-[49] bg-white border-b border-black/[0.03] md:hidden'>
                    {[
                        {
                            label: 'app.viewWishlist',
                            onPress: () => router.push('/wishlist'),
                            show: showWishlist,
                        },
                        {
                            label: 'app.settings',
                            onPress: () => router.push('/settings'),
                            show: showSettings,
                        },
                    ].map(
                        (item) =>
                            item.show && (
                                <Pressable
                                    key={item.label}
                                    className='px-6 py-4 border-b border-black/[0.02] active:bg-black/[0.02]'
                                    onPress={() => {
                                        setIsMenuOpen(false);
                                        item.onPress();
                                    }}
                                >
                                    <Text className='text-[18px] font-[450] text-[#121317]'>{t(item.label)}</Text>
                                </Pressable>
                            )
                    )}
                </View>
            )}
        </>
    );
}
