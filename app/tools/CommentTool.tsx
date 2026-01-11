import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Loader2, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface GeneratedResponse {
  result: string;
}

export default function CommentTool() {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!context.trim()) {
      toast.error('Please describe the post context');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-comment`, {
        context,
      });

      setResult(response.data);
      toast.success('Comment suggestions generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async (comment: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Comment Suggestion',
      content: comment,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  const comments = result ? result.result.split('---').map(c => c.trim()).filter(c => c) : [];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">AI Comment Wingman</h2>
        <p className="text-[#A1A1AA] text-sm">Get smart replies to boost engagement</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <label className="text-white mb-2 block">Post Context</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe the post you want to comment on..."
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
              <span>Generating...</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              <span>Generate Comments</span>
            </>
          )}
        </button>
      </div>

      {comments.length > 0 ? (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white text-lg mb-4">Suggested Comments</h3>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-black/30 border border-white/10 rounded-xl p-4">
                <p className="text-white mb-4 whitespace-pre-wrap">{comment}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleCopy(comment)}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-2 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleSave(comment)}
                    className="flex-1 bg-[#CCFF00] text-black font-bold py-2 rounded-xl hover:bg-[#B3E600] transition-all flex items-center justify-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : result ? (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-[#A1A1AA]">Describe a post to get comment suggestions</p>
        </div>
      ) : null}
    </div>
  );
}