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

// removed useI18n, use useTranslation below
import AppLayout from '@/components/common/AppLayout';
import FeatureCard from '@/components/common/FeatureCard';
import Typewriter from '@/components/ui/Typewriter';
import {NameSpace} from '@/types/Enums';
import {useRouter} from 'expo-router';
import {Camera, FileText, MessageSquare, Repeat2, Sparkles, Zap} from 'lucide-react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withDelay, withTiming} from 'react-native-reanimated';

export default function Landing() {
    const {t} = useTranslation(NameSpace.Common);
    const router = useRouter();

    const heroOpacity = useSharedValue(0);
    const heroTranslateY = useSharedValue(40);
    const badgeOpacity = useSharedValue(0);
    const badgeScale = useSharedValue(0.9);
    const gridOpacity = useSharedValue(0);
    const ctaOpacity = useSharedValue(0);
    const ctaTranslateY = useSharedValue(20);
    const contentOpacity = useSharedValue(0);
    const contentTranslateY = useSharedValue(20);

    useEffect(() => {
        ctaOpacity.value = withDelay(800, withTiming(1, {duration: 500}));
        ctaTranslateY.value = withDelay(800, withTiming(0, {duration: 500}));
    }, []);

    const ctaStyle = useAnimatedStyle(() => ({
        opacity: ctaOpacity.value,
        transform: [{translateY: ctaTranslateY.value}],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{translateY: contentTranslateY.value}],
    }));

    const handleTypewriterComplete = () => {
        badgeOpacity.value = withDelay(2500, withTiming(1, {duration: 800}));
        badgeScale.value = withDelay(2500, withTiming(1, {duration: 800}));
        gridOpacity.value = withDelay(2500, withTiming(1, {duration: 800}));
        ctaOpacity.value = withDelay(2500, withTiming(1, {duration: 800}));
        ctaTranslateY.value = withDelay(2500, withTiming(0, {duration: 800}));
        contentOpacity.value = withDelay(2500, withTiming(1, {duration: 800}));
        contentTranslateY.value = withDelay(2500, withTiming(0, {duration: 800}));
    };

    const features = [
        {
            icon: <Camera size={32} color='#CCFF00' />,
            title: t('features.vision.title'),
            subtitle: t('features.vision.subtitle'),
            description: t('features.vision.description'),
            color: '#CCFF00',
        },
        {
            icon: <Sparkles size={32} color='#00F0FF' />,
            title: t('features.content.title'),
            subtitle: t('features.content.subtitle'),
            description: t('features.content.description'),
            color: '#00F0FF',
        },
        {
            icon: <FileText size={32} color='#FF0099' />,
            title: t('features.bio.title'),
            subtitle: t('features.bio.subtitle'),
            description: t('features.bio.description'),
            color: '#FF0099',
        },
        {
            icon: <MessageSquare size={32} color='#7000FF' />,
            title: t('features.engagement.title'),
            subtitle: t('features.engagement.subtitle'),
            description: t('features.engagement.description'),
            color: '#7000FF',
        },
        {
            icon: <Repeat2 size={32} color='#CCFF00' />,
            title: t('features.remix.title'),
            subtitle: t('features.remix.subtitle'),
            description: t('features.remix.description'),
            color: '#CCFF00',
        },
        {
            icon: <Zap size={32} color='#00F0FF' />,
            title: t('features.roast.title'),
            subtitle: t('features.roast.subtitle'),
            description: t('features.roast.description'),
            color: '#00F0FF',
        },
    ];

    return (
        <AppLayout showWishlist showSettings>
            <View className=' h-full'>
                {/* Hero Section */}
                <View className='items-center mb-40 relative z-10 py-32'>
                    {/* Floating Badge */}
                    <Animated.View style={contentStyle}>
                        <View className='pill bg-black/5 border border-black/5 mb-16 backdrop-blur-md'>
                            <Sparkles size={16} color='#00F0FF' />
                            <Text className='text-xs font-black text-black tracking-[0.2em] uppercase ml-2'>{t('home.trusted')}</Text>
                        </View>
                    </Animated.View>

                    <View className='mb-6 px-4 items-center'>
                        <Typewriter
                            text={t('home.welcome') + ' ' + t('home.subtitle')}
                            speed={80}
                            className='text-landing text-center text-[#121317] mb-4'
                            onComplete={handleTypewriterComplete}
                        />
                    </View>

                    <Animated.View style={contentStyle} className='items-center'>
                        <Text className='text-[#45474D] text-center max-w-3xl mb-11 px-6 font-normal text-xl leading-relaxed tracking-tight'>
                            {t('home.description')}
                        </Text>

                        <View className='mb-6 flex flex-row items-center justify-center gap-8'>
                            <Pressable onPress={() => router.push('/dashboard')} className='pill bg-[#121317] shadow-md active:scale-95'>
                                <Text className='text-white tracking-tight'>{t('home.goToDashboard')}</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                    {/* Features Section Header */}
                    <Animated.View style={contentStyle}>
                        <View className='px-4 items-center'>
                            <Text className='text-xs font-black text-[#00F0FF] tracking-[0.4em] uppercase mb-6'>
                                {t('dashboard.toolsHeading')}
                            </Text>
                            <View className='h-1 w-12 bg-black rounded-full' />
                        </View>
                    </Animated.View>
                </View>

                {/* Features Grid */}
                <View className='flex flex-row flex-wrap justify-center gap-16'>
                    {features.map((feature, index) => (
                        <View key={index} className='w-full md:w-[40%] lg:w-[40%]'>
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                subtitle={feature.subtitle}
                                description={feature.description}
                                color={feature.color}
                                index={index}
                            />
                        </View>
                    ))}
                </View>

                {/* CTA Section */}
                <Animated.View
                    style={ctaStyle}
                    className='mt-48 items-center py-40 glass rounded-[4rem] relative overflow-hidden bg-white/40'
                >
                    <View className='absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#00F0FF]/5 blur-[120px] rounded-full' />

                    <Text className='text-5xl sm:text-7xl font-black text-black text-center mb-12 px-8 tracking-tighter'>
                        {t('home.tryAllTools')}
                    </Text>
                    <Pressable
                        onPress={() => router.push('/dashboard')}
                        className='pill bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:scale-95'
                    >
                        <Text className='text-white text-2xl font-black text-center px-8'>{t('home.getStarted') || 'Get Started'}</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </AppLayout>
    );
}
