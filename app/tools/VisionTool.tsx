import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { Bookmark, Copy, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

interface GeneratedResponse {
  result: string;
}

export default function VisionTool() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-hashtags-from-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      toast.success('Hashtags generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate hashtags. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard!');
  };

  const handleSave = async (hashtags: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Hashtag Suggestion',
      content: hashtags,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    toast.success('Saved to wishlist!');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">AI Vision Hashtags</h2>
        <p className="text-[#A1A1AA] text-sm">Upload any photo and get 30 viral, SEO-optimized hashtags instantly</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-6 mb-4 flex flex-col items-center justify-center hover:bg-white/10 transition-all"
        >
          {image ? (
            <img src={image} alt="Selected" className="max-w-full max-h-64 rounded-lg mb-2" />
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-[#A1A1AA] mb-2" />
              <p className="text-[#A1A1AA]">Click to select image</p>
            </>
          )}
        </button>

        <button
          onClick={handleGenerate}
          disabled={loading || !image}
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
              <span>Generate Hashtags</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white text-lg mb-4">Generated Hashtags</h3>
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