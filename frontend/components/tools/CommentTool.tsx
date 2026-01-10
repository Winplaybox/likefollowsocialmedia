import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface GeneratedResponse {
  result: string;
}

export default function CommentTool() {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!context.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please describe the post context',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-comment`, {
        context,
      });

      setResult(response.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Comment suggestions generated!',
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate comments. Please try again.',
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

  const handleSave = async (comment: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Comment Suggestion',
      content: comment,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('hashtagHeroWishlist', JSON.stringify(saved));
    Toast.show({
      type: 'success',
      text1: 'Saved to wishlist!',
    });
  };

  const comments = result ? result.result.split('---').map(c => c.trim()).filter(c => c) : [];

  return (
    <ScrollView className="flex-1 bg-gray-900 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-white mb-2">AI Comment Wingman</Text>
        <Text className="text-gray-400 text-sm">Get smart replies to boost engagement</Text>
      </View>

      <View className="bg-gray-800 rounded-2xl p-6 mb-6">
        <View className="mb-4">
          <Text className="text-white mb-2">Post Context</Text>
          <TextInput
            value={context}
            onChangeText={setContext}
            placeholder="Describe the post you want to comment on..."
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
            <Text className="text-black font-bold text-lg">Generate Comments</Text>
          )}
        </TouchableOpacity>
      </View>

      {comments.length > 0 ? (
        <View className="bg-gray-800 rounded-2xl p-6">
          <Text className="text-white text-lg mb-4">Suggested Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="bg-gray-700 rounded-xl p-4 mb-4">
                <Text className="text-white mb-4">{item}</Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity onPress={() => handleCopy(item)} className="bg-gray-600 p-2 rounded-xl">
                    <Text className="text-white">Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSave(item)} className="bg-green-500 p-2 rounded-xl">
                    <Text className="text-black">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : result ? (
        <View className="bg-gray-800 rounded-2xl p-6 text-center">
          <Text className="text-6xl mb-4">💬</Text>
          <Text className="text-gray-400">Describe a post to get comment suggestions</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}