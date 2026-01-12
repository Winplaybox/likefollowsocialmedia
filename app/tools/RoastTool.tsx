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
import {Flame} from 'lucide-react';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'sonner';
import ResultDisplay from '../components/common/ResultDisplay';
import ToolForm from '../components/common/ToolForm';
import {BACKEND_URL_API} from '../lib/utils';
import {NameSpace} from '../types/Enums';

interface GeneratedResponse {
    result: string;
}
export default function RoastTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [profileDetails, setProfileDetails] = useState('');
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Input Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2 flex items-center gap-2'>
                        {t('roastTool.title')} <Flame className='w-6 h-6 text-orange-500' />
                    </h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('roastTool.description')}</p>
                </div>
                <ToolForm
                    fields={[
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
            </div>
            {/* Result Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('roastTool.resultTitle')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('roastTool.copyOrSave')}</p>
                </div>
                {result.result ? (
                    <ResultDisplay result={result.result} saveType={t('roastTool.saveType')} />
                ) : (
                    <ResultDisplay
                        result=''
                        placeholder={t('roastTool.resultPlaceholder')}
                        icon={{type: 'icon', path: <Flame className='w-12 h-12 text-[#A1A1AA]' />}}
                    />
                )}
            </div>
        </div>
    );
}
