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
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Text, View} from 'react-native';

export default function AppFooter() {
    const {t} = useTranslation(NameSpace.Common);
    return (
        <View className='relative z-10 bg-white pt-12 pb-6 px-6 sm:px-12'>
            <View className='max-w-7xl mx-auto w-full'>
                {/* Massive Styled Text */}
                <View className='mb-12'>
                    <Text
                        style={{fontFamily: 'Google Sans Flex'}}
                        className='text-[15vw] sm:text-[180px] font-[450] text-[#121317] tracking-[-0.04em] leading-[0.8] text-center'
                    >
                        {t('app.title1')} {t('app.title2')}
                    </Text>
                </View>

                {/* Bottom Bar */}
                <View className='pt-4 border-t border-black/[0.03] flex flex-col sm:flex-row items-center justify-between gap-8'>
                    <View className='flex flex-row items-center gap-6'>
                        <Text className='text-[22px] font-[500] text-[#45474D] tracking-tight'>Winplaybox</Text>
                        <View className='hidden sm:flex flex-row items-center gap-6 ml-4'>
                            {[
                                {
                                    label: t('app.aboutWinplaybox'),
                                    onPress: () => {},
                                },
                                {
                                    label: t('app.privacy'),
                                    onPress: () => {},
                                },
                                {
                                    label: t('app.terms'),
                                    onPress: () => {},
                                },
                            ].map((item) => (
                                <Pressable key={item.label} onPress={item.onPress}>
                                    <Text className='text-[12px] text-[#45474D] font-normal'>{item.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Mobile legal links */}
                    <View className='flex sm:hidden flex-row flex-wrap justify-center gap-4'>
                        {[
                            {
                                label: t('app.aboutWinplaybox'),
                                onPress: () => {},
                            },
                            {
                                label: t('app.privacy'),
                                onPress: () => {},
                            },
                            {
                                label: t('app.terms'),
                                onPress: () => {},
                            },
                        ].map((item) => (
                            <Pressable key={item.label} onPress={item.onPress}>
                                <Text className='text-[12px] text-[#45474D] font-normal'>{item.label}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className='w-8 h-8 rounded-full bg-[#121317] items-center justify-center'>
                        <View className='w-1.5 h-1.5 bg-white rounded-full' />
                    </View>
                </View>
            </View>
        </View>
    );
}
