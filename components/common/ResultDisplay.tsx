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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Text, View} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {toast} from 'sonner';

interface ResultDisplayProps {
    result?: string;
    characterCount?: number;
    platformLimit?: number;
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
    saveType = 'Result',
    error,
    placeholder,
    icon,
}: ResultDisplayProps) {
    const {t} = useTranslation(NameSpace.Common);

    const handleCopy = async () => {
        if (!result) return;
        await Clipboard.setStringAsync(result);
        toast.success(t('app.copiedToClipboard'));
    };

    const handleSave = async () => {
        if (!result) return;
        const savedString = await AsyncStorage.getItem('hashtagHeroWishlist');
        const saved = JSON.parse(savedString || '[]');
        saved.push({
            id: Date.now(),
            type: saveType,
            content: result,
            characterCount,
            platformLimit,
            timestamp: new Date().toISOString(),
        });
        await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
        toast.success(t('app.savedToWishlist'));
    };

    return (
        <View className='bg-white rounded-[var(--shape-corner-sm)] p-8 border border-[#E1E6EC] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 justify-center w-full'>
            {error && (
                <View className='mb-4 p-3 bg-red-50 border border-red-100 rounded-[var(--shape-corner-sm)]'>
                    <Text className='text-red-600 text-[14.5px] font-[450]'>{error}</Text>
                </View>
            )}
            {result ? (
                <View className='flex-1'>
                    <View className='bg-[#F8F9FC] rounded-[var(--shape-corner-sm)] p-8 mb-6 border border-[#E1E6EC] flex-1'>
                        <Text className='text-[#121317] text-lg leading-relaxed font-normal'>{result}</Text>
                    </View>
                    {typeof characterCount === 'number' && typeof platformLimit === 'number' && (
                        <View className='flex flex-row items-center justify-between mb-6 px-2'>
                            <Text className='text-[#45474D] text-xs font-[450] uppercase tracking-wider'>{characterCount} characters</Text>
                            <Text className={`text-sm font-[450] ${characterCount > platformLimit ? 'text-red-500' : 'text-[#4285F4]'}`}>
                                {characterCount} / {platformLimit}
                            </Text>
                        </View>
                    )}
                    <View className='flex flex-row gap-4'>
                        <Pressable
                            onPress={handleCopy}
                            className='pill flex-1 bg-[#F8F9FC] border border-[#E1E6EC] active:bg-[#EFF2F7] shadow-sm'
                        >
                            <Text className='text-[#121317] font-[450]'>{t('app.copy')}</Text>
                        </Pressable>
                        <Pressable onPress={handleSave} className='pill flex-1 bg-[#121317] active:opacity-90 shadow-sm'>
                            <Text className='text-white font-[450]'>{t('app.save')}</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View className='flex flex-col justify-center items-center py-10'>
                    {icon && (
                        <View className='inline-flex p-6 bg-[#F8F9FC] rounded-full mb-6 border border-[#E1E6EC]'>
                            {icon.type === 'icon' ? (
                                icon.path
                            ) : (
                                <Svg width={48} height={48} viewBox='0 0 24 24' fill='none'>
                                    <Path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={1}
                                        d={icon.path as string}
                                        stroke='#B2BBC5'
                                    />
                                </Svg>
                            )}
                        </View>
                    )}
                    <Text className='text-[#45474D] font-normal text-[17.5px]'>{placeholder || 'No result yet.'}</Text>
                </View>
            )}
        </View>
    );
}
