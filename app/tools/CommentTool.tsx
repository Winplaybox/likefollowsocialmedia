import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { BACKEND_URL_API } from '../lib/utils';

interface GeneratedResponse {
  result: string;
}

export default function CommentTool() {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse>({
    result: '',
  });

  const handleGenerate = async () => {
     if (!context.trim()) {
      toast.error('Please describe the post context');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL_API}/generate-comment`, {
        context
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
      timestamp: new Date().toISOString()
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  const comments = result ? result.result.split('---').map(c => c.trim()).filter(c => c) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">AI Comment Wingman</h2>
          <p className="text-[#A1A1AA] text-sm">Get smart replies to boost engagement</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Post Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              data-testid="comment-context-input"
              placeholder="Describe the post you want to comment on. E.g., A fitness influencer sharing their morning routine"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all h-48 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            data-testid="comment-generate-button"
            className="w-full px-8 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B3E600] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Comments'
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Comment Suggestions</h2>
          <p className="text-[#A1A1AA] text-sm">Choose the best one</p>
        </div>

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={index}
                data-testid={`comment-suggestion-${index}`}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#CCFF00]/30 transition-all"
              >
                <p className="text-white leading-relaxed mb-4">{comment}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCopy(comment)}
                    data-testid={`comment-copy-${index}`}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => handleSave(comment)}
                    data-testid={`comment-save-${index}`}
                    className="flex-1 px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] rounded-lg hover:bg-[#CCFF00]/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Bookmark className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <div className="text-center py-20">
                <div className="inline-flex p-6 bg-white/5 rounded-full mb-4">
                  <svg className="w-12 h-12 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-[#A1A1AA]">Describe a post to get comment suggestions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}