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
import {NameSpace} from '@/types/Enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import {useRouter} from 'expo-router';
import {Copy, Trash2} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withDelay, withTiming} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {toast} from 'sonner';

interface WishlistItem {
    id: number;
    type: string;
    content: string;
    timestamp: string;
    characterCount?: number;
    platformLimit?: number;
}

const WishlistItemCard = ({
    item,
    index,
    onCopy,
    onDelete,
}: {
    item: WishlistItem;
    index: number;
    onCopy: (i: WishlistItem) => void;
    onDelete: (id: number) => void;
}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(index * 50, withTiming(1, {duration: 500}));
        translateY.value = withDelay(index * 50, withTiming(0, {duration: 500}));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{translateY: translateY.value}],
    }));

    return (
        <Animated.View
            style={animatedStyle}
            className='bg-white border border-[#E1E6EC] rounded-[36px] p-8 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        >
            <View className='flex flex-row items-start justify-between gap-4 mb-6'>
                <View>
                    <View className='px-4 py-1.5 bg-[#E8F0FE] rounded-full mb-3 inline-flex self-start'>
                        <Text className='text-[#4285F4] text-[11px] font-[500] uppercase tracking-wider'>{item.type}</Text>
                    </View>
                    <Text className='text-[13px] text-[#45474D] font-[450] tracking-tight'>
                        {new Date(item.timestamp).toLocaleString()}
                    </Text>
                </View>
                <View className='flex flex-row gap-4'>
                    <Pressable
                        onPress={() => onCopy(item)}
                        className='w-12 h-12 bg-[#F8F9FC] border border-[#E1E6EC] rounded-full flex items-center justify-center active:bg-[#EFF2F7]'
                    >
                        <Copy size={20} color='#121317' strokeWidth={1.5} />
                    </Pressable>
                    <Pressable
                        onPress={() => onDelete(item.id)}
                        className='w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center active:bg-red-100'
                    >
                        <Trash2 size={20} color='#EA4335' strokeWidth={1.5} />
                    </Pressable>
                </View>
            </View>
            <View className='bg-[#F8F9FC] rounded-[24px] p-8 border border-[#E1E6EC]'>
                <Text className='text-[#121317] font-normal text-lg leading-relaxed'>{item.content}</Text>
            </View>
            {item.characterCount && (
                <View className='mt-6 px-2 flex flex-row items-center justify-between'>
                    <Text className='text-[12px] text-[#45474D] font-[450] uppercase tracking-wider'>{item.characterCount} characters</Text>
                    {item.platformLimit && <Text className='text-[12px] text-[#4285F4] font-[450]'>MAX {item.platformLimit}</Text>}
                </View>
            )}
        </Animated.View>
    );
};

export default function Wishlist() {
    const {t} = useTranslation(NameSpace.Common);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const router = useRouter();

    const emptyOpacity = useSharedValue(0);
    const emptyScale = useSharedValue(0.95);

    useEffect(() => {
        loadWishlist();
        emptyOpacity.value = withTiming(1, {duration: 500});
        emptyScale.value = withTiming(1, {duration: 500});
    }, []);

    const emptyStyle = useAnimatedStyle(() => ({
        opacity: emptyOpacity.value,
        transform: [{scale: emptyScale.value}],
    }));

    const loadWishlist = async () => {
        const saved = await AsyncStorage.getItem('hashtagHeroWishlist');
        if (saved) {
            setItems(JSON.parse(saved));
        }
    };

    const handleDelete = async (id: number) => {
        const updated = items.filter((item) => item.id !== id);
        setItems(updated);
        await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(updated));
        toast.success('Removed from wishlist');
    };

    const handleCopy = async (item: WishlistItem) => {
        await Clipboard.setStringAsync(item.content);
        toast.success('Copied to clipboard!');
    };

    const clearAll = async () => {
        setItems([]);
        await AsyncStorage.removeItem('hashtagHeroWishlist');
        toast.success('Wishlist cleared');
    };

    return (
        <AppLayout
            showBack
            showSettings
            extraButton={
                items.length > 0 && (
                    <Pressable
                        onPress={clearAll}
                        data-testid='clear-all-button'
                        className='pill-sm px-6 bg-red-50 border border-red-100 shadow-sm active:bg-red-100'
                    >
                        <Text className='text-[#EA4335] text-[11px] font-[450] uppercase tracking-wider'>{t('app.clearAll')}</Text>
                    </Pressable>
                )
            }
        >
            <View className='mb-16'>
                <Typewriter
                    text={t('app.yourWishlist')}
                    speed={70}
                    className='text-[54px] font-[450] mb-4 text-[#121317] tracking-tight leading-[1.1]'
                />
                <Text className='text-[#45474D] text-xl font-normal tracking-tight'>{t('app.savedItemsDesc')}</Text>
            </View>

            {items.length === 0 ? (
                <View style={emptyStyle} className='glass rounded-[2rem] py-24 items-center justify-center'>
                    <View className='p-8 bg-white/5 rounded-full mb-8 relative'>
                        <View className='absolute inset-0 bg-[#CCFF00]/20 blur-2xl rounded-full' />
                        <Svg width={64} height={64} viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                            <Path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                stroke='#A1A1AA'
                                d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                            />
                        </Svg>
                    </View>
                    <Text className='text-black text-4xl font-black mb-4 tracking-tight'>{t('app.noSavedItems')}</Text>
                    <Text className='text-black/40 text-lg mb-12 max-w-md text-center font-medium'>{t('app.startGenerating')}</Text>
                    <Pressable
                        onPress={() => router.push('/dashboard')}
                        data-testid='go-to-dashboard-button'
                        className='px-12 py-5 bg-[#00F0FF] rounded-full shadow-[0_10px_30px_rgba(0,240,255,0.3)]'
                    >
                        <Text className='text-white font-black text-center text-lg'>{t('app.goToDashboard')}</Text>
                    </Pressable>
                </View>
            ) : (
                <View className='flex flex-col gap-6'>
                    {items.map((item, index) => (
                        <WishlistItemCard key={item.id} item={item} index={index} onCopy={handleCopy} onDelete={handleDelete} />
                    ))}
                </View>
            )}
        </AppLayout>
    );
}
