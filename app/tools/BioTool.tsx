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
import {DEFAULT_PLATFORM, PLATFORMS} from '@/app/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'sonner';
import ResultDisplay from '../components/common/ResultDisplay';
import ToolForm from '../components/common/ToolForm';
import {BACKEND_URL_API} from '../lib/utils';
import {NameSpace} from '../types/Enums';

interface GeneratedResponse {
    result: string;
    character_count: number;
    platform_limit: number;
}

export default function BioTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [details, setDetails] = useState('');
    const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Input Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('bioTool.title')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('bioTool.description')}</p>
                </div>
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
            </div>
            {/* Result Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('bioTool.optimizedBio')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('bioTool.readyToUpdate')}</p>
                </div>
                <ResultDisplay
                    result={result.result}
                    characterCount={result.character_count}
                    platformLimit={result.platform_limit}
                    saveType={t('bioTool.saveType', {platform: platform})}
                    placeholder={t('bioTool.resultPlaceholder')}
                    icon={{
                        type: 'svg',
                        path:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    }}
                />
            </div>
        </div>
    );
}
