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
export default function CommentTool() {
    const {t} = useTranslation(NameSpace.Common);
    const [context, setContext] = useState('');
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Input Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('commentTool.title')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('commentTool.description')}</p>
                </div>
                <ToolForm
                    fields={[
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
            </div>
            {/* Result Section */}
            <div className='space-y-6'>
                <div>
                    <h2 className='text-2xl font-bold mb-2'>{t('commentTool.suggestedComments')}</h2>
                    <p className='text-[#A1A1AA] text-sm'>{t('commentTool.copyOrSave')}</p>
                </div>
                {/* <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8"> */}
                {comments.length > 0 ? (
                    comments.map((c, idx) => <ResultDisplay key={idx} result={c} saveType={t('commentTool.saveType')} />)
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
                {/* </div> */}
            </div>
        </div>
    );
}
