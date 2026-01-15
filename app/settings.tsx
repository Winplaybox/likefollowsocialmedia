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

import AppLayout from '@/components/common/AppLayout';
import Typewriter from '@/components/ui/Typewriter';
import {cn} from '@/lib/utils';
import {NameSpace} from '@/types/Enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Text, TextInput, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

interface ModelOption {
    key: string;
    label: string;
    length: number;
}
const MODELS = JSON.parse(process.env.EXPO_PUBLIC_AI_MODELS || '[{"key":"gemini","label":"Gemini","length":39}]');

export default function Settings() {
    const {t} = useTranslation(NameSpace.Common);
    const [model, setModel] = useState(MODELS[0]?.key || '');
    const [apiKey, setApiKey] = useState('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);

    useEffect(() => {
        opacity.value = withTiming(1, {duration: 500});
        translateY.value = withTiming(0, {duration: 500});
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{translateY: translateY.value}],
    }));

    // Model-specific API key length requirements from MODELS
    const apiKeyLengths: Record<string, number> = Object.fromEntries(MODELS.map((m: {key: any; length: any}) => [m.key, m.length]));

    useEffect(() => {
        (async () => {
            const userModel = await AsyncStorage.getItem('user_model');
            const userApiKey = await AsyncStorage.getItem('user_api_key');
            if (userModel) setModel(userModel);
            if (userApiKey) setApiKey(userApiKey);
        })();
    }, []);

    const handleSave = async () => {
        setError(null);
        if (!apiKey.trim()) {
            setError(t('app.apiKeyRequired'));
            return;
        }
        const expectedLength = apiKeyLengths[model];
        if (expectedLength && apiKey.length !== expectedLength) {
            setError(
                t('app.apiKeyInvalid', {
                    model: model.charAt(0).toUpperCase() + model.slice(1),
                    length: expectedLength,
                })
            );
            return;
        }
        await AsyncStorage.setItem('user_model', model);
        await AsyncStorage.setItem('user_api_key', apiKey);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Button disabled logic
    const expectedLength = apiKeyLengths[model];
    const isApiKeyValid = !!apiKey.trim() && (!expectedLength || apiKey.length === expectedLength);

    return (
        <AppLayout showBack showWishlist>
            <Animated.View style={animatedStyle} className='py-20 relative z-10'>
                <View className='mb-16'>
                    <Typewriter
                        text={t('app.modelSettings')}
                        speed={70}
                        className='text-[54px] font-[450] mb-4 text-[#121317] tracking-tight leading-[1.1]'
                    />
                    <Text className='text-[#45474D] text-xl font-normal tracking-tight'>{t('app.saveSettings')}</Text>
                </View>

                <View className='gap-10 bg-white border border-[#E1E6EC] rounded-[48px] p-10 sm:p-14 relative overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)]'>
                    <View>
                        <Text className='text-[11px] font-[450] mb-4 text-[#45474D] uppercase tracking-[0.15em]'>{t('app.model')}</Text>
                        <View className='w-full px-6 py-5 bg-[#F8F9FC] border border-[#E1E6EC] rounded-[24px]'>
                            <Text className='text-[#121317] font-normal text-lg'>
                                {MODELS.find((m: ModelOption) => m.key === model)?.label || 'Select Model'}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text className='text-[11px] font-[450] mb-4 text-[#45474D] uppercase tracking-[0.15em]'>{t('app.apiKey')}</Text>
                        <TextInput
                            value={apiKey}
                            onChangeText={setApiKey}
                            placeholder={t('app.apiKey')}
                            placeholderTextColor='#B2BBC5'
                            className='w-full px-6 py-5 bg-[#F8F9FC] border border-[#E1E6EC] rounded-[24px] text-[#121317] font-normal text-lg'
                        />
                    </View>
                    <Pressable
                        onPress={handleSave}
                        disabled={!isApiKeyValid}
                        className={cn(
                            'pill w-full transition-all',
                            !isApiKeyValid ? 'bg-[#E1E6EC] opacity-50' : 'bg-[#121317] active:scale-95 shadow-lg'
                        )}
                    >
                        <Text className='text-white tracking-tight'>{t('app.saveSettings')}</Text>
                    </Pressable>
                    {error && (
                        <View className='mt-2 p-4 bg-red-50 border border-red-100 rounded-[16px]'>
                            <Text className='text-[#EA4335] text-sm text-center font-[450]'>{error}</Text>
                        </View>
                    )}
                    {saved && (
                        <View className='mt-2 p-4 bg-[#E6F4EA] border border-[#CEEAD6] rounded-[16px]'>
                            <Text className='text-[#1E8E3E] text-sm text-center font-[450]'>{t('app.saved')}</Text>
                        </View>
                    )}
                </View>
            </Animated.View>
        </AppLayout>
    );
}
