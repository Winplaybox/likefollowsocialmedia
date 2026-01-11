import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Flame, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { BACKEND_URL_API } from '../lib/utils';

interface GeneratedResponse {
  result: string;
}

export default function RoastTool() {
  const [profileDetails, setProfileDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse>({
    result: '',
  });

  const handleGenerate = async () => {
    if (!profileDetails.trim()) {
      toast.error('Please provide your profile details');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL_API}/roast-profile`, {
        profile_details: profileDetails
      });

      setResult(response.data);
      toast.success('Profile roasted successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to roast profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async (roast: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Profile Roast',
      content: roast,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Profile Roast <Flame className="w-6 h-6 text-orange-500" />
          </h2>
          <p className="text-[#A1A1AA] text-sm">Get brutally honest feedback to level up your game</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Your Profile Details</label>
            <textarea
              value={profileDetails}
              onChange={(e) => setProfileDetails(e.target.value)}
              data-testid="roast-profile-input"
              placeholder="Share details about your profile: bio, content type, posting frequency, engagement, follower count, etc. The more details, the better the roast!"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all h-64 resize-none"
            />
          </div>

          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-400 text-sm flex items-start gap-2">
              <Flame className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Warning: This tool provides honest, constructive criticism. Expect direct feedback!</span>
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            data-testid="roast-generate-button"
            className="w-full px-8 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B3E600] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Roasting...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5" />
                Roast My Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">The Verdict</h2>
          <p className="text-[#A1A1AA] text-sm">Honest feedback & actionable advice</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          {result.result ? (
            <>
              <div className="bg-black/50 rounded-xl p-6 mb-4 min-h-[400px]">
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {result.result}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy(result.result)}
                  data-testid="roast-copy-button"
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => handleSave(result.result)}
                  data-testid="roast-save-button"
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
                <Flame className="w-12 h-12 text-[#A1A1AA]" />
              </div>
              <p className="text-[#A1A1AA]">Share your profile details to get roasted</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}