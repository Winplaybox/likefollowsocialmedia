import { PLATFORMS } from '@/app/constants/platforms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import {
  Bookmark, Copy, Loader2
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { BACKEND_URL_API } from '../lib/utils';

export default function RemixTool() {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const handleGenerate = async () => {
    if (!postContent.trim()) {
      toast.error('Please enter your post content');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL_API}/generate-remix`, {
        post_content: postContent,
        platforms: PLATFORMS.map(p => p.value) 
      });

      setResult(response.data);
      toast.success('Content remixed successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to remix content.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async (platformLabel: string, content: string) => {
    try {
      const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
      saved.push({
        id: Date.now(),
        type: `Remix - ${platformLabel}`,
        content,
        timestamp: new Date().toISOString()
      });
      await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
      toast.success('Saved to wishlist!');
    } catch (e) {
      toast.error('Failed to save');
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Remix Content</h2>
          <p className="text-[#A1A1AA] text-sm">
            Adapt content for {PLATFORMS.map(p => p.label).join(', ')}.
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Paste your post content here..."
            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all h-40 resize-none mb-6"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full px-8 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B3E600] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Remix for All Platforms'}
          </button>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PLATFORMS.map((platform) => {
            const content = result[platform.value];
            if (!content) return null;

            return (
              <div key={platform.value} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col">
                
                {/* HEADER: Uses First Letter instead of Icon */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
                    {/* THE MAGIC: Just show the first letter */}
                    <span className="text-xl font-bold text-white">
                      {platform.label.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold">{platform.label}</h3>
                    <p className="text-xs text-[#A1A1AA]">{platform.description}</p>
                  </div>
                </div>

                <div className="bg-black/50 rounded-xl p-4 min-h-[200px] flex-grow">
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleCopy(content)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                  <button
                    onClick={() => handleSave(platform.label, content)}
                    className="flex-1 px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] rounded-lg hover:bg-[#CCFF00]/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Bookmark className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}