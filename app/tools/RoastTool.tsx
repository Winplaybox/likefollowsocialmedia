import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Loader2, Target } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface GeneratedResponse {
  result: string;
}

export default function RoastTool() {
  const [profileDetails, setProfileDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!profileDetails.trim()) {
      toast.error('Please provide your profile details');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/roast-profile`, {
        profile_details: profileDetails,
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
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Roast</h2>
        <p className="text-[#A1A1AA] text-sm">Get brutally honest feedback to level up your social media game</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <label className="text-white mb-2 block">Your Profile Details</label>
          <textarea
            value={profileDetails}
            onChange={(e) => setProfileDetails(e.target.value)}
            placeholder="Share details about your profile: bio, content type, posting frequency, engagement, follower count, etc."
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl resize-none"
            rows={6}
          />
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
          <p className="text-orange-400 text-sm">Warning: This tool provides honest, constructive criticism. Expect direct feedback!</p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-xl hover:bg-[#B3E600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Roasting...</span>
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              <span>Roast My Profile</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white text-lg mb-4">Profile Roast</h3>
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <p className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">{result.result}</p>
          </div>
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