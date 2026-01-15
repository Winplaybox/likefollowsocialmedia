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
import {Flame} from 'lucide-react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import {toast} from 'sonner';

interface GeneratedResponse {
    result: string;
}

export default function RoastTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [profileDetails, setProfileDetails] = useState('');
    const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
    const [tone, setTone] = useState(DEFAULT_TONE);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeneratedResponse>({
        result: '',
    });

    const handleGenerate = async () => {
        if (!profileDetails.trim()) {
            toast.error(t('commonTool.describeFirst', {tool: t('dashboard.roast'), context: 'the profile details to roast'}));
            return;
        }
        setLoading(true);
        try {
            const userModel = await AsyncStorage.getItem('user_model');
            const userApiKey = await AsyncStorage.getItem('user_api_key');
            const model = userModel || 'gemini';
            const api_key = userApiKey || undefined;
            const response = await axios.post(`${BACKEND_URL_API}/generate-content`, {
                content_type: 'roast',
                description: profileDetails,
                platform,
                tone,
                model,
                api_key,
            });
            if (response.status === 402) {
                toast.error(t('commonTool.apiKeyExceeded'));
            } else if (response.data.result) {
                setResult(response.data);
                toast.success(t('commonTool.success', {tool: t('dashboard.roast')}));
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
                    <View className='flex flex-row items-center gap-3 mb-2'>
                        <Text className='text-[28px] font-[450] text-[#121317] tracking-tight'>{t('roastTool.title')}</Text>
                        <Flame className='w-6 h-6 text-[#EA4335]' />
                    </View>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('roastTool.description')}</Text>
                </View>
                <ToolForm
                    fields={[
                        {
                            label: t('captionTool.platform'),
                            value: platform,
                            onChange: setPlatform,
                            type: 'select',
                            options: PLATFORMS.map((p) => ({value: p.value, label: p.label})),
                            testId: 'roast-platform-select',
                        },
                        {
                            label: t('captionTool.tone'),
                            value: tone,
                            onChange: setTone,
                            type: 'select',
                            options: TONES.map((t) => ({value: t.value, label: t.label})),
                            testId: 'roast-tone-select',
                        },
                        {
                            label: t('roastTool.detailsLabel'),
                            value: profileDetails,
                            onChange: setProfileDetails,
                            type: 'textarea',
                            placeholder: t('roastTool.detailsPlaceholder'),
                            testId: 'roast-profile-input',
                        },
                    ]}
                    onSubmit={handleGenerate}
                    loading={loading}
                    submitLabel={t('roastTool.generateButton')}
                />
            </View>
            {/* Result Section */}
            <View className='flex-1 gap-6  h-auto w-full'>
                <View>
                    <Text className='text-[28px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('roastTool.resultTitle')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('roastTool.copyOrSave')}</Text>
                </View>
                {result.result ? (
                    <ResultDisplay result={result.result} saveType={t('roastTool.saveType')} />
                ) : (
                    <ResultDisplay
                        result=''
                        placeholder={t('roastTool.resultPlaceholder')}
                        icon={{type: 'icon', path: <Flame className='w-12 h-12 text-[#B2BBC5]' strokeWidth={1.5} />}}
                    />
                )}
            </View>
        </>
    );
}
