import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface WishlistItem {
  id: number;
  type: string;
  content: string;
  timestamp: string;
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

  const handleCopy = async (content: string) => {
    await Clipboard.setStringAsync(content);
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard!',
    });
  };

  const handleDelete = async (id: number) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(updated));
    Toast.show({
      type: 'success',
      text1: 'Deleted from wishlist!',
    });
  };

  return (
    <ScrollView className="flex-1 bg-black p-6">
      <View className="mb-6">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 text-gray-400 mb-4">
          <Text className="text-gray-400">← Back</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white mb-2">Your Wishlist</Text>
        <Text className="text-gray-400">Saved content for later</Text>
      </View>

      {items.length === 0 ? (
        <View className="text-center py-20">
          <Text className="text-6xl mb-4">📝</Text>
          <Text className="text-2xl font-bold text-white mb-2">No saved items yet</Text>
          <Text className="text-gray-400 mb-6">Start generating content and save your favorites here</Text>
          <TouchableOpacity
            onPress={() => router.push('/dashboard')}
            className="px-8 py-4 bg-green-400 text-black font-bold rounded-full"
          >
            <Text className="text-black font-bold">Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-4">
              <View className="flex-row justify-between items-start mb-4">
                <Text className="text-green-400 text-sm font-mono">{item.type}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="text-red-400">
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-white mb-4">{item.content}</Text>
              <TouchableOpacity
                onPress={() => handleCopy(item.content)}
                className="px-4 py-2 bg-gray-700 rounded-xl"
              >
                <Text className="text-white">Copy</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}