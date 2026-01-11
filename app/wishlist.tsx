import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WishlistItem {
  id: number;
  type: string;
  content: string;
  timestamp: string;
  characterCount?: number;
  platformLimit?: number;
}

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const saved = await AsyncStorage.getItem('hashtagHeroWishlist');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  };

  const handleDelete = async(id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(updated));
    toast.success('Removed from wishlist');
  };

  const handleCopy = async (item:WishlistItem) => {
    await Clipboard.setStringAsync(item.content);
    toast.success('Copied to clipboard!');
  };

  const clearAll = async() => {
    setItems([]);
    await AsyncStorage.removeItem('hashtagHeroWishlist');
    toast.success('Wishlist cleared');
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Navigation */}
      <nav className="px-6 py-6 flex justify-between items-center border-b border-white/10">
        <button 
          onClick={() => router.push('/dashboard')}
          data-testid="back-to-dashboard-button"
          className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="text-2xl font-bold">
          <span className="text-[#CCFF00]">Hashtag</span>
          <span className="text-white">Hero</span>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            data-testid="clear-all-button"
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full hover:bg-red-500/20 transition-all text-sm"
          >
            Clear All
          </button>
        )}
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Wishlist</h1>
          <p className="text-[#A1A1AA]">Saved hashtags, captions, and more</p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-6 bg-white/5 rounded-full mb-6">
              <svg className="w-16 h-16 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No saved items yet</h2>
            <p className="text-[#A1A1AA] mb-6">Start generating content and save your favorites here</p>
            <button
              onClick={() => router.push('/dashboard')}
              data-testid="go-to-dashboard-button"
              className="px-8 py-4 bg-[#CCFF00] text-black font-bold rounded-full hover:bg-[#B3E600] transition-all"
            >
              Go to Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                data-testid={`wishlist-item-${index}`}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#CCFF00]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-mono rounded-full mb-2">
                      {item.type}
                    </span>
                    <p className="text-sm text-[#A1A1AA]">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item)}
                      data-testid={`copy-item-${index}`}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      data-testid={`delete-item-${index}`}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
                {item.characterCount && (
                  <div className="mt-4 text-xs text-[#A1A1AA]">
                    {item.characterCount} characters
                    {item.platformLimit && ` / ${item.platformLimit} limit`}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}