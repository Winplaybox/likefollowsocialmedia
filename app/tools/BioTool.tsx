import { DEFAULT_PLATFORM, PLATFORMS } from '@/app/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { BACKEND_URL_API } from '../lib/utils';

interface GeneratedResponse {
  result: string;
  character_count: number;
  platform_limit: number;
}

export default function BioTool() {
   const [details, setDetails] = useState('');
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse>({
    result: '',
    character_count: 0,
    platform_limit: PLATFORMS.find(p => p.value === DEFAULT_PLATFORM)?.characterLimit || 0,
  });

  const handleGenerate = async () => {
   if (!details.trim()) {
      toast.error('Please provide details about yourself');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL_API}/generate-bio`, {
        details,
        platform
      });

      setResult(response.data);
      toast.success('Bio generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate bio. Please try again.');
    } finally {
      setLoading(false);
    }

    
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async (bio: string) => {
     const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: `${platform} Bio`,
      content: result.result,
      characterCount: result.character_count,
      platformLimit: result.platform_limit,
      timestamp: new Date().toISOString()
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Profile Bio Optimizer</h2>
          <p className="text-[#A1A1AA] text-sm">Create a bio that converts visitors into followers</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              data-testid="bio-platform-select"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all"
            >
              {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label} ({p.characterLimit} chars)
              </option>
            ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">About You</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              data-testid="bio-details-input"
              placeholder="E.g., Travel blogger, foodie, photographer. Based in NYC. Love exploring hidden gems."
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all h-40 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            data-testid="bio-generate-button"
            className="w-full px-8 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B3E600] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Bio'
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Your Optimized Bio</h2>
          <p className="text-[#A1A1AA] text-sm">Ready to update your profile</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          {result.result ? (
            <>
              <div className="bg-black/50 rounded-xl p-6 mb-4 min-h-[200px]">
                <p className="text-white leading-relaxed">
                  {result.result}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-[#A1A1AA]">
                  {result.character_count} characters
                </span>
                <span className={result.character_count > result?.platform_limit ? 'text-red-400' : 'text-[#CCFF00]'}>
                  {result.character_count} / {result.platform_limit}
                </span>
              </div>

              {result.character_count > result?.platform_limit && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  Bio exceeds platform limit. Consider shortening it.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy(result.result)}
                  data-testid="bio-copy-button"
                  disabled={result.result === ''}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => handleSave(result.result)}
                  data-testid="bio-save-button"
                  disabled={result.result === ''}
                  className="flex-1 px-6 py-3 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] rounded-xl hover:bg-[#CCFF00]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex p-6 bg-white/5 rounded-full mb-4">
                <svg className="w-12 h-12 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-[#A1A1AA]">Provide details to generate your bio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}