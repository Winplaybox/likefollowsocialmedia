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
import ToolForm from '@/components/common/ToolForm';
import {PLATFORMS} from '@/constants/platforms';
import {BACKEND_URL_API} from '@/lib/utils';
import {NameSpace} from '@/types/Enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import {toast} from 'sonner';

export default function RemixTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [postContent, setPostContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Record<string, string> | null>(null);

    const handleGenerate = async () => {
        if (!postContent.trim()) {
            toast.error(t('commonTool.describeFirst', {tool: t('dashboard.remix'), context: 'the content to remix'}));
            return;
        }

        setLoading(true);
        try {
            // Get user model and API key from settings (AsyncStorage)
            const userModel = await AsyncStorage.getItem('user_model');
            const userApiKey = await AsyncStorage.getItem('user_api_key');
            const model = userModel || 'gemini';
            const api_key = userApiKey || undefined;

            const response = await axios.post(`${BACKEND_URL_API}/generate-content`, {
                content_type: 'remix',
                description: postContent,
                platforms: PLATFORMS.map((p) => p.value),
                model,
                api_key,
            });

            if (response.status === 402) {
                toast.error(t('commonTool.apiKeyExceeded'));
            } else if (response.data.result) {
                setResult(response.data.result);
                toast.success(t('commonTool.success', {tool: t('dashboard.remix')}));
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
            {/* Header */}
            <View className='flex-1 gap-6  h-auto w-full'>
                <View>
                    <Text className='text-[36px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('remixTool.title')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed max-w-3xl'>
                        {t('remixTool.description', {platforms: PLATFORMS.map((p) => p.label).join(', ')})}
                    </Text>
                </View>
                <ToolForm
                    fields={[
                        {
                            label: t('remixTool.contentLabel'),
                            value: postContent,
                            onChange: setPostContent,
                            type: 'textarea',
                            placeholder: t('remixTool.contentPlaceholder'),
                            testId: 'remix-post-content-input',
                        },
                    ]}
                    onSubmit={handleGenerate}
                    loading={loading}
                    submitLabel={t('remixTool.generateButton')}
                />
            </View>
            {/* Dynamic Results Grid */}
            <View className='flex-1 gap-6  h-auto w-full'>
                {result ? (
                    <View className='flex flex-row flex-wrap flex-1 gap-6  h-full w-full'>
                        {PLATFORMS.map((platform) => {
                            const content = result[platform.value];
                            if (!content) return null;
                            return (
                                <View
                                    key={platform.value}
                                    className='bg-[#F8F9FC] border border-[#E1E6EC] rounded-[36px] p-8 gap-6 flex-1 min-w-[340px] shadow-sm'
                                >
                                    <View className='flex flex-row items-center gap-4 mb-2'>
                                        <View
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-[#E1E6EC] shadow-sm`}
                                        >
                                            <Text className='text-[22px] font-[600] text-[#121317]'>{platform.label.charAt(0)}</Text>
                                        </View>
                                        <View>
                                            <Text className='font-[450] text-[#121317] text-lg'>{platform.label}</Text>
                                            <Text className='text-[13px] text-[#45474D] tracking-tight'>{platform.description}</Text>
                                        </View>
                                    </View>
                                    <ResultDisplay result={content} saveType={t('remixTool.saveType', {platform: platform.label})} />
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <ResultDisplay
                        result=''
                        placeholder={t('remixTool.resultPlaceholder')}
                        icon={{type: 'svg', path: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'}}
                    />
                )}
            </View>
        </>
    );
}
