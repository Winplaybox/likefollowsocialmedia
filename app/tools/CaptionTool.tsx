
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
import { DEFAULT_PLATFORM, DEFAULT_TONE, PLATFORMS, TONES } from '@/app/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import ResultDisplay from '../components/common/ResultDisplay';
import ToolForm from '../components/common/ToolForm';
import { BACKEND_URL_API } from '../lib/utils';

interface GeneratedResponse {
  result: string;
  character_count: number;
  platform_limit: number;
}

export default function CaptionTool() {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
  const [tone, setTone] = useState(DEFAULT_TONE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse>({
    result: '',
    character_count: 0,
    platform_limit: PLATFORMS.find(p => p.value === DEFAULT_PLATFORM)?.characterLimit || 0,
  });

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error(t('captionTool.describeFirst'));
      return;
    }
    setLoading(true);
    try {
      const userModel = await AsyncStorage.getItem('user_model');
      const userApiKey = await AsyncStorage.getItem('user_api_key');
      const model = userModel || 'gemini';
      const api_key = userApiKey || undefined;
      const response = await axios.post(`${BACKEND_URL_API}/generate-content`, {
        content_type: 'caption',
        description,
        platform,
        tone,
        model,
        api_key,
      });
      if (response.status === 402) {
        toast.error(t('captionTool.apiKeyExceeded'));
      } else if (response.data.result) {
        setResult(response.data);
        toast.success(t('captionTool.generated'));
      } else if (response.data.error) {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('captionTool.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t('captionTool.title')}</h2>
          <p className="text-[#A1A1AA] text-sm">{t('captionTool.description')}</p>
        </div>
        <ToolForm
          fields={[{
            label: t('captionTool.platform'),
            value: platform,
            onChange: setPlatform,
            type: 'select',
            options: PLATFORMS.map(p => ({ value: p.value, label: p.label })),
            testId: 'caption-platform-select',
          }, {
            label: t('captionTool.tone'),
            value: tone,
            onChange: setTone,
            type: 'select',
            options: TONES.map(t => ({ value: t.value, label: t.label })),
            testId: 'caption-tone-select',
          }, {
            label: t('captionTool.describeLabel'),
            value: description,
            onChange: setDescription,
            type: 'textarea',
            placeholder: t('captionTool.describePlaceholder'),
            testId: 'caption-description-input',
          }]}
          onSubmit={handleGenerate}
          loading={loading}
          submitLabel={t('captionTool.generateButton')}
        />
      </div>
      {/* Result Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t('captionTool.generatedCaption')}</h2>
          <p className="text-[#A1A1AA] text-sm">{t('captionTool.readyToPost')}</p>
        </div>
        <ResultDisplay
          result={result.result}
          characterCount={result.character_count}
          platformLimit={result.platform_limit}
          saveType={t('captionTool.saveType')}
          copyLabel={t('app.copy')}
          saveLabel={t('app.save')}
          placeholder={t('captionTool.resultPlaceholder')}
          icon={{type:'svg',path:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'}}
        />
      </div>
    </div>
  );
}