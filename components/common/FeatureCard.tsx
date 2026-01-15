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
import {Text, View} from 'react-native';
import Animated, {FadeInDown, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    index: number;
}

export default function FeatureCard({icon, title, subtitle, description, color, index}: FeatureCardProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
    }));

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(600)} style={animatedStyle} className='flex-1'>
            <View className='bg-white rounded-[36px] p-10 flex flex-col items-start gap-10 relative overflow-hidden h-full shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-[#E6EAF0] active:border-[#4285F4]/30'>
                {/* Background Accent Glow */}
                <View className='absolute -top-40 -right-40 w-80 h-80 blur-[100px] opacity-[0.03]' style={{backgroundColor: color}} />

                <View className='w-14 h-14 bg-[#121317] items-center justify-center rounded-[16px] relative z-10'>{icon}</View>

                <View className='gap-4 flex-1'>
                    <View>
                        <Text className='font-[450] text-[32px] text-[#121317] tracking-tight leading-[1.1] mb-2 relative z-10'>
                            {title}
                        </Text>
                        <Text className='text-[#4285F4] text-[12px] font-[450] tracking-[0.1em] uppercase relative z-10'>{subtitle}</Text>
                    </View>
                    <Text className='text-[#45474D] text-[17.5px] font-normal leading-relaxed relative z-10'>{description}</Text>
                </View>

                <View className='w-12 h-1 bg-[#E6EAF0] rounded-full' />
            </View>
        </Animated.View>
    );
}
