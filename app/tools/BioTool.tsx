import { DEFAULT_PLATFORM, PLATFORMS } from '@/app/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Loader2, UserCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface GeneratedResponse {
  result: string;
  character_count: number;
  platform_limit?: number;
}

export default function BioTool() {
  const [details, setDetails] = useState('');
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!details.trim()) {
      toast.error('Please provide details about yourself');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-bio`, {
        details,
        platform,
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
      type: 'Bio Suggestion',
      content: bio,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">AI Bio Generator</h2>
        <p className="text-[#A1A1AA] text-sm">Craft the perfect bio that converts visitors into followers</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <label className="text-white mb-2 block">Profile Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe yourself: interests, profession, personality..."
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl resize-none"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="text-white mb-2 block">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-xl hover:bg-[#B3E600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <UserCircle className="w-5 h-5" />
              <span>Generate Bio</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white text-lg mb-4">Generated Bio</h3>
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <p className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">{result.result}</p>
          </div>
          {result.character_count && (
            <div className="mb-4 flex justify-between items-center text-sm">
              <span className="text-[#A1A1AA]">{result.character_count} characters</span>
              {result.platform_limit && (
                <span className={result.character_count > result.platform_limit ? 'text-red-400' : 'text-green-400'}>
                  {result.character_count} / {result.platform_limit}
                </span>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => handleCopy(result.result)}
              className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={() => handleSave(result.result)}
              className="flex-1 bg-[#CCFF00] text-black font-bold py-3 rounded-xl hover:bg-[#B3E600] transition-all flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}