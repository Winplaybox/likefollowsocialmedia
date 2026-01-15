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
import ResultDisplay from '@/components/common/ResultDisplay';
import {BACKEND_URL_API, cn} from '@/lib/utils';
import {NameSpace} from '@/types/Enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import {Image as LucideImage, Upload, X} from 'lucide-react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Image as RNImage, Text, View} from 'react-native';
import {toast} from 'sonner';

interface GeneratedResponse {
    result: string;
    character_count: number;
    platform_limit: number;
    hashtag_count: number;
}

export default function VisionTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeneratedResponse>({
        result: '',
        character_count: 0,
        platform_limit: 0,
        hashtag_count: 0,
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleGenerate = async () => {
        if (!image) {
            toast.error(t('visionTool.imageRequired'));
            return;
        }

        setLoading(true);
        try {
            const userModel = await AsyncStorage.getItem('user_model');
            const userApiKey = await AsyncStorage.getItem('user_api_key');
            const model = userModel || 'gemini';
            const api_key = userApiKey || undefined;

            const response = await axios.post(`${BACKEND_URL_API}/generate-content`, {
                content_type: 'vision',
                image: image,
                model,
                api_key,
            });

            if (response.status === 402) {
                toast.error(t('commonTool.apiKeyExceeded'));
            } else if (response.data.result) {
                setResult(response.data);
                toast.success(t('commonTool.success', {tool: t('dashboard.vision')}));
            } else if (response.data.error) {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(t('commonTool.failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Input Section */}
            <View className='flex-1 gap-6  h-auto w-full'>
                <View>
                    <Text className='text-[28px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('visionTool.title')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('visionTool.description')}</Text>
                </View>

                <View className='flex-1 bg-[#F8F9FC] border border-[#E1E6EC] rounded-[var(--shape-corner-sm)] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]'>
                    {image ? (
                        <View
                            className='relative bg-[#E8F0FE] rounded-[var(--shape-corner-sm)] inline-flex border border-[#E1E6EC]'
                            style={{width: '100%', height: '100%', aspectRatio: 1}}
                        >
                            <RNImage
                                source={{uri: image}}
                                resizeMode='contain'
                                style={{width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%'}}
                            />
                            <Pressable
                                onPress={() => setImage(null)}
                                className='absolute p-2 bg-white/80 backdrop-blur-md shadow-sm active:bg-white'
                                style={{
                                    top: 0,
                                    right: 0,
                                    borderTopLeftRadius: 100,
                                    borderBottomRightRadius: 100,
                                    borderBottomLeftRadius: 100,
                                }}
                            >
                                <X className='w-4 h-4 text-[#121317]' />
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable onPress={pickImage} className='flex flex-col justify-center items-center py-10'>
                            <View className='p-6 bg-[#E8F0FE] rounded-full inline-flex border border-[#E1E6EC]'>
                                <LucideImage className='w-12 h-12  text-[#4285F4]' style={{width: 48, height: 48}} />
                            </View>
                            <View className='text-center'>
                                <Text className='font-[450] text-[#121317] text-center'>{t('visionTool.uploadImage')}</Text>
                                <Text className='text-[12.5px] text-[#45474D] mt-1 text-center'>PNG, JPG up to 10MB</Text>
                            </View>
                        </Pressable>
                    )}

                    <Pressable
                        onPress={handleGenerate}
                        disabled={loading || !image}
                        className={cn(
                            'pill w-full mt-8 transition-all',
                            loading || !image ? 'bg-[#E1E6EC] opacity-50' : 'bg-[#121317] active:scale-95 shadow-md'
                        )}
                    >
                        <Text className='text-white tracking-tight'>
                            {loading ? t('commonTool.analyzing') : t('visionTool.generateButton')}
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Result Section */}
            <View className='flex-1 gap-6  h-auto w-full'>
                <View>
                    <Text className='text-[28px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('visionTool.resultTitle')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('visionTool.copyOrSave')}</Text>
                </View>
                {result.result ? (
                    <ResultDisplay result={result.result} saveType={t('visionTool.saveType')} />
                ) : (
                    <ResultDisplay
                        result=''
                        placeholder={t('visionTool.resultPlaceholder')}
                        icon={{type: 'icon', path: <Upload className='w-12 h-12 text-[#B2BBC5]' strokeWidth={1.5} />}}
                    />
                )}
            </View>
        </>
    );
}
