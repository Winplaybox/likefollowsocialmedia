import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Loader2, Shuffle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RemixResponse {
  instagram: string;
  tiktok: string;
  youtube: string;
}

export default function RemixTool() {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RemixResponse | null>(null);

  const handleGenerate = async () => {
    if (!postContent.trim()) {
      toast.error('Please enter your post content');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-remix`, {
        post_content: postContent,
      });

      setResult(response.data);
      toast.success('Content remixed successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to remix content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async (content: string, type: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: `${type} Remix`,
      content,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Content Remix</h2>
        <p className="text-[#A1A1AA] text-sm">Adapt your content for Instagram, TikTok, and YouTube in one click</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <label className="text-white mb-2 block">Post Content</label>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Enter your original post content..."
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-xl hover:bg-[#B3E600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Remixing...</span>
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5" />
              <span>Remix Content</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-lg mb-4">Instagram Version</h3>
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <p className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">{result.instagram}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleCopy(result.instagram)}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleSave(result.instagram, 'Instagram')}
                className="flex-1 bg-[#CCFF00] text-black font-bold py-3 rounded-xl hover:bg-[#B3E600] transition-all flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-lg mb-4">TikTok Version</h3>
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <p className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">{result.tiktok}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleCopy(result.tiktok)}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleSave(result.tiktok, 'TikTok')}
                className="flex-1 bg-[#CCFF00] text-black font-bold py-3 rounded-xl hover:bg-[#B3E600] transition-all flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-lg mb-4">YouTube Version</h3>
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <p className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">{result.youtube}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleCopy(result.youtube)}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleSave(result.youtube, 'YouTube')}
                className="flex-1 bg-[#CCFF00] text-black font-bold py-3 rounded-xl hover:bg-[#B3E600] transition-all flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}