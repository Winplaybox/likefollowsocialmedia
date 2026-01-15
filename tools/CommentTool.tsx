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
}

export default function CommentTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [context, setContext] = useState('');
    const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
    const [tone, setTone] = useState(DEFAULT_TONE);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeneratedResponse>({
        result: '',
    });

    const handleGenerate = async () => {
        if (!context.trim()) {
            toast.error(t('commonTool.describeFirst', {tool: t('dashboard.comment'), context: 'the context for the comments'}));
            return;
        }
        setLoading(true);
        try {
            const userModel = await AsyncStorage.getItem('user_model');
            const userApiKey = await AsyncStorage.getItem('user_api_key');
            const model = userModel || 'gemini';
            const api_key = userApiKey || undefined;
            const response = await axios.post(`${BACKEND_URL_API}/generate-content`, {
                content_type: 'comment',
                description: context,
                platform,
                tone,
                model,
                api_key,
            });
            if (response.status === 402) {
                toast.error(t('commonTool.apiKeyExceeded'));
            } else if (response.data.result) {
                setResult(response.data);
                toast.success(t('commonTool.success', {tool: t('dashboard.comment')}));
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

    const comments = result.result
        ? result.result
              .split('---')
              .map((c) => c.trim())
              .filter((c) => c)
        : [];

    return (
        <>
            {/* Input Section */}
            <View className='flex-1 gap-6  h-auto w-full'>
                <View>
                    <Text className='text-[28px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('commentTool.title')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('commentTool.description')}</Text>
                </View>
                <ToolForm
                    fields={[
                        {
                            label: t('captionTool.platform'),
                            value: platform,
                            onChange: setPlatform,
                            type: 'select',
                            options: PLATFORMS.map((p) => ({value: p.value, label: p.label})),
                            testId: 'comment-platform-select',
                        },
                        {
                            label: t('captionTool.tone'),
                            value: tone,
                            onChange: setTone,
                            type: 'select',
                            options: TONES.map((t) => ({value: t.value, label: t.label})),
                            testId: 'comment-tone-select',
                        },
                        {
                            label: t('commentTool.contextLabel'),
                            value: context,
                            onChange: setContext,
                            type: 'textarea',
                            placeholder: t('commentTool.contextPlaceholder'),
                            testId: 'comment-context-input',
                        },
                    ]}
                    onSubmit={handleGenerate}
                    loading={loading}
                    submitLabel={t('commentTool.generateButton')}
                />
            </View>
            {/* Result Section */}
            <View className='flex-1 gap-6  h-auto w-full'>
                <View>
                    <Text className='text-[28px] font-[450] mb-2 text-[#121317] tracking-tight'>{t('commentTool.suggestedComments')}</Text>
                    <Text className='text-[#45474D] text-[17.5px] leading-relaxed'>{t('commentTool.copyOrSave')}</Text>
                </View>
                {comments.length > 0 ? (
                    <View className='gap-4'>
                        {comments.map((c, idx) => (
                            <ResultDisplay key={idx} result={c} saveType={t('commentTool.saveType')} />
                        ))}
                    </View>
                ) : (
                    <ResultDisplay
                        result=''
                        placeholder={t('commentTool.resultPlaceholder')}
                        icon={{
                            type: 'svg',
                            path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
                        }}
                    />
                )}
            </View>
        </>
    );
}
