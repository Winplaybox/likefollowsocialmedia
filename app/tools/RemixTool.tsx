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
import {PLATFORMS} from '@/app/constants/platforms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'sonner';
import ResultDisplay from '../components/common/ResultDisplay';
import ToolForm from '../components/common/ToolForm';
import {BACKEND_URL_API} from '../lib/utils';
import {NameSpace} from '../types/Enums';

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
        <div className='space-y-8'>
            {/* Header */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('remixTool.title')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>
                        {t('remixTool.description', {platforms: PLATFORMS.map((p) => p.label).join(', ')})}
                    </p>
                </div>
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
            </div>
            {/* Dynamic Results Grid */}
            {result ? (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {PLATFORMS.map((platform) => {
                        const content = result[platform.value];
                        if (!content) return null;
                        return (
                            <div
                                key={platform.value}
                                className='bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col'
                            >
                                <div className='flex items-center gap-3 mb-2'>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
                                        <span className='text-xl font-bold text-white'>{platform.label.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h3 className='font-bold'>{platform.label}</h3>
                                        <p className='text-xs text-[#A1A1AA]'>{platform.description}</p>
                                    </div>
                                </div>
                                <ResultDisplay result={content} saveType={t('remixTool.saveType', {platform: platform.label})} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <ResultDisplay
                    result=''
                    placeholder={t('remixTool.resultPlaceholder')}
                    icon={{type: 'svg', path: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'}}
                />
            )}
        </div>
    );
}
