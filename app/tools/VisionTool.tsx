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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Upload} from 'lucide-react';
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
    hashtag_count: number;
}
export default function VisionTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeneratedResponse>({
        result: '',
        character_count: 0,
        platform_limit: 0,
        hashtag_count: 0,
    });

    const handleGenerate = async () => {
        if (!description.trim()) {
            toast.error(t('commonTool.describeFirst', {tool: t('dashboard.vision'), context: 'a description of the image'}));
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
                description,
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Input Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('visionTool.title')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('visionTool.description')}</p>
                </div>
                <ToolForm
                    fields={[
                        {
                            label: t('visionTool.descriptionLabel'),
                            value: description,
                            onChange: setDescription,
                            type: 'textarea',
                            placeholder: t('visionTool.descriptionPlaceholder'),
                            testId: 'vision-description-input',
                        },
                    ]}
                    onSubmit={handleGenerate}
                    loading={loading}
                    submitLabel={t('visionTool.generateButton')}
                />
            </div>
            {/* Result Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('visionTool.resultTitle')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('visionTool.copyOrSave')}</p>
                </div>
                {result.result ? (
                    <ResultDisplay result={result.result} saveType={t('visionTool.saveType')} />
                ) : (
                    <ResultDisplay
                        result=''
                        placeholder={t('visionTool.resultPlaceholder')}
                        icon={{type: 'icon', path: <Upload className='w-12 h-12 text-[#A1A1AA]' />}}
                    />
                )}
            </div>
        </div>
    );
}
