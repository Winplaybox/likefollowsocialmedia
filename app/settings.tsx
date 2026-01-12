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
import {motion} from 'framer-motion';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import AppLayout from './components/common/AppLayout';
import {NameSpace} from './types/Enums';

interface ModelOption {
    key: string;
    label: string;
    length: number;
}
const MODELS = JSON.parse(process.env.EXPO_PUBLIC_AI_MODELS || '[{"key":"gemini","label":"Gemini","length":39}]');

export default function Settings() {
    const {t} = useTranslation(NameSpace.Common);
    const [model, setModel] = useState(MODELS[0]?.key || '');
    const [apiKey, setApiKey] = useState('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Model-specific API key length requirements from MODELS
    const apiKeyLengths: Record<string, number> = Object.fromEntries(MODELS.map((m: {key: any; length: any}) => [m.key, m.length]));

    useEffect(() => {
        (async () => {
            const userModel = await AsyncStorage.getItem('user_model');
            const userApiKey = await AsyncStorage.getItem('user_api_key');
            if (userModel) setModel(userModel);
            if (userApiKey) setApiKey(userApiKey);
        })();
    }, []);

    const handleSave = async () => {
        setError(null);
        if (!apiKey.trim()) {
            setError(t('app.apiKeyRequired'));
            return;
        }
        const expectedLength = apiKeyLengths[model];
        if (expectedLength && apiKey.length !== expectedLength) {
            setError(
                t('app.apiKeyInvalid', {
                    model: model.charAt(0).toUpperCase() + model.slice(1),
                    length: expectedLength,
                })
            );
            return;
        }
        await AsyncStorage.setItem('user_model', model);
        await AsyncStorage.setItem('user_api_key', apiKey);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Button disabled logic
    const expectedLength = apiKeyLengths[model];
    const isApiKeyValid = !!apiKey.trim() && (!expectedLength || apiKey.length === expectedLength);

    return (
        <AppLayout showBack showWishlist>
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className='py-20'>
                <div className='mb-8'>
                    <h1 className='text-3xl sm:text-4xl font-bold mb-2'>{t('app.modelSettings')}</h1>
                    <p className='text-[#A1A1AA]'>{t('app.saveSettings')}</p>
                </div>
                <div className='space-y-6 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>{t('app.model')}</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className='w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all'
                        >
                            {MODELS.map((m: ModelOption) => (
                                <option key={m.key} value={m.key}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>{t('app.apiKey')}</label>
                        <input
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={t('app.apiKey')}
                            className='w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all'
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className='w-full px-8 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B3E600] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!isApiKeyValid}
                    >
                        {t('app.saveSettings')}
                    </button>
                    {error && (
                        <div className='mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center'>
                            {error}
                        </div>
                    )}
                    {saved && (
                        <div className='mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center'>
                            {t('app.saved')}
                        </div>
                    )}
                </div>
            </motion.div>
        </AppLayout>
    );
}
