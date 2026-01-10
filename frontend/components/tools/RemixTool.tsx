import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your post content',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-remix`, {
        post_content: postContent,
      });

      setResult(response.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Content remixed successfully!',
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remix content. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard!',
    });
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
    Toast.show({
      type: 'success',
      text1: 'Saved to wishlist!',
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-white mb-2">Content Remix</Text>
        <Text className="text-gray-400 text-sm">Adapt your content for Instagram, TikTok, and YouTube in one click</Text>
      </View>

      <View className="bg-gray-800 rounded-2xl p-6 mb-6">
        <View className="mb-4">
          <Text className="text-white mb-2">Post Content</Text>
          <TextInput
            value={postContent}
            onChangeText={setPostContent}
            placeholder="Enter your original post content..."
            className="bg-gray-700 text-white p-4 rounded-xl"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={loading}
          className="bg-green-500 p-4 rounded-xl flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black font-bold text-lg">Remix Content</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View className="space-y-6">
          <View className="bg-gray-800 rounded-2xl p-6">
            <Text className="text-white text-lg mb-4">Instagram Version</Text>
            <Text className="text-white bg-gray-700 p-4 rounded-xl mb-4">{result.instagram}</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => handleCopy(result.instagram)} className="bg-gray-600 p-3 rounded-xl">
                <Text className="text-white">Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSave(result.instagram, 'Instagram')} className="bg-green-500 p-3 rounded-xl">
                <Text className="text-black">Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-gray-800 rounded-2xl p-6">
            <Text className="text-white text-lg mb-4">TikTok Version</Text>
            <Text className="text-white bg-gray-700 p-4 rounded-xl mb-4">{result.tiktok}</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => handleCopy(result.tiktok)} className="bg-gray-600 p-3 rounded-xl">
                <Text className="text-white">Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSave(result.tiktok, 'TikTok')} className="bg-green-500 p-3 rounded-xl">
                <Text className="text-black">Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-gray-800 rounded-2xl p-6">
            <Text className="text-white text-lg mb-4">YouTube Version</Text>
            <Text className="text-white bg-gray-700 p-4 rounded-xl mb-4">{result.youtube}</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => handleCopy(result.youtube)} className="bg-gray-600 p-3 rounded-xl">
                <Text className="text-white">Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSave(result.youtube, 'YouTube')} className="bg-green-500 p-3 rounded-xl">
                <Text className="text-black">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}