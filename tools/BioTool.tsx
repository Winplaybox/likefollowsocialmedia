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
import {DEFAULT_PLATFORM, DEFAULT_TONE, PLATFORMS, TONES} from '@/constants';
import {BACKEND_URL_API} from '@/lib/utils';
import {NameSpace} from '@/types/Enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import {toast} from 'sonner';

interface GeneratedResponse {
    result: string;
    character_count: number;
    platform_limit: number;
}

export default function BioTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [details, setDetails] = useState('');
    const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
    const [tone, setTone] = useState(DEFAULT_TONE);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeneratedResponse>({
        result: '',
        character_count: 0,
        platform_limit: PLATFORMS.find((p) => p.value === DEFAULT_PLATFORM)?.characterLimit || 0,
    });

    const handleGenerate = async () => {
        if (!details.trim()) {
            toast.error(t('commonTool.describeFirst', {tool: t('dashboard.bio'), context: 'the details for the bio'}));
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
                content_type: 'bio',
                description: details,
                platform,
                tone,
                model,
                api_key,
            });

            if (response.status === 402) {
                toast.error(t('commonTool.apiKeyExceeded'));
            } else if (response.data.result) {
                setResult(response.data);
                toast.success(t('commonTool.success', {tool: t('dashboard.bio')}));
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
                    <Text className='text-[28px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('bioTool.title')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('bioTool.description')}</Text>
                </View>
                <ToolForm
                    fields={[
                        {
                            label: t('bioTool.platform'),
                            value: platform,
                            onChange: setPlatform,
                            type: 'select',
                            options: PLATFORMS.map((p) => ({value: p.value, label: `${p.label} (${p.characterLimit} chars)`})),
                            testId: 'bio-platform-select',
                        },
                        {
                            label: t('captionTool.tone'),
                            value: tone,
                            onChange: setTone,
                            type: 'select',
                            options: TONES.map((t) => ({value: t.value, label: t.label})),
                            testId: 'bio-tone-select',
                        },
                        {
                            label: t('bioTool.detailsLabel'),
                            value: details,
                            onChange: setDetails,
                            type: 'textarea',
                            placeholder: t('bioTool.detailsPlaceholder'),
                            testId: 'bio-details-input',
                        },
                    ]}
                    onSubmit={handleGenerate}
                    loading={loading}
                    submitLabel={t('bioTool.generateButton')}
                />
            </View>
            {/* Result Section */}
            <View className='flex-1 gap-6  h-auto w-full'>
                <View>
                    <Text className='text-[28px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('bioTool.optimizedBio')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('bioTool.readyToUpdate')}</Text>
                </View>
                <ResultDisplay
                    result={result.result}
                    characterCount={result.character_count}
                    platformLimit={result.platform_limit}
                    saveType={t('bioTool.saveType', {platform: platform})}
                    placeholder={t('bioTool.resultPlaceholder')}
                    icon={{
                        type: 'svg',
                        path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                    }}
                />
            </View>
        </>
    );
}
