import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface GeneratedResponse {
  result: string;
  character_count: number;
  platform_limit?: number;
}

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://your-backend-url.com';
const API = `${BACKEND_URL}/api`;

export default function CaptionTool() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('engaging');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please describe your content first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/generate-caption`, {
        content_description: description,
        platform,
        tone,
      });

      setResult(response.data);
      toast.success('Caption generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate caption. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async (caption: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Caption Suggestion',
      content: caption,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">AI Caption Generator</h2>
        <p className="text-[#A1A1AA] text-sm">Generate engaging captions that drive likes, comments, and shares</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <label className="text-white mb-2 block">Content Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your post content..."
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl resize-none"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="text-white mb-2 block">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl"
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-white mb-2 block">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl"
          >
            <option value="engaging">Engaging</option>
            <option value="professional">Professional</option>
            <option value="fun">Fun</option>
            <option value="inspirational">Inspirational</option>
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
              <Sparkles className="w-5 h-5" />
              <span>Generate Caption</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white text-lg mb-4">Generated Caption</h3>
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <p className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">{result.result}</p>
          </div>
          {result.character_count && (
            <div className="mb-4 text-sm text-[#A1A1AA]">
              {result.character_count} characters
              {result.platform_limit && ` / ${result.platform_limit} limit`}
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