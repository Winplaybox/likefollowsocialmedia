import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface GeneratedResponse {
  result: string;
  character_count: number;
  platform_limit?: number;
}

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://your-backend-url.com';
const API = `${BACKEND_URL}/api`;

export default function CaptionTool() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('engaging');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please describe your content first',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/generate-caption`, {
        content_description: description,
        platform,
        tone,
      });

      setResult(response.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Caption generated successfully!',
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate caption. Please try again.',
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

  const handleSave = async (caption: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Caption Suggestion',
      content: caption,
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
        <Text className="text-2xl font-bold text-white mb-2">AI Caption Generator</Text>
        <Text className="text-gray-400 text-sm">Generate engaging captions that drive likes, comments, and shares</Text>
      </View>

      <View className="bg-gray-800 rounded-2xl p-6 mb-6">
        <View className="mb-4">
          <Text className="text-white mb-2">Content Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your post content..."
            className="bg-gray-700 text-white p-4 rounded-xl"
            multiline
            numberOfLines={4}
          />
        </View>

        <View className="mb-4">
          <Text className="text-white mb-2">Platform</Text>
          <View className="bg-gray-700 rounded-xl">
            <Picker
              selectedValue={platform}
              onValueChange={setPlatform}
              style={{ color: 'white' }}
            >
              <Picker.Item label="Instagram" value="instagram" />
              <Picker.Item label="TikTok" value="tiktok" />
              <Picker.Item label="YouTube" value="youtube" />
            </Picker>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-white mb-2">Tone</Text>
          <View className="bg-gray-700 rounded-xl">
            <Picker
              selectedValue={tone}
              onValueChange={setTone}
              style={{ color: 'white' }}
            >
              <Picker.Item label="Engaging" value="engaging" />
              <Picker.Item label="Professional" value="professional" />
              <Picker.Item label="Fun" value="fun" />
              <Picker.Item label="Inspirational" value="inspirational" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={loading}
          className="bg-green-500 p-4 rounded-xl flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black font-bold text-lg">Generate Caption</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View className="bg-gray-800 rounded-2xl p-6">
          <Text className="text-white text-lg mb-4">Generated Caption</Text>
          <Text className="text-white bg-gray-700 p-4 rounded-xl mb-4">{result.result}</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={() => handleCopy(result.result)} className="bg-gray-600 p-3 rounded-xl">
              <Text className="text-white">Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSave(result.result)} className="bg-green-500 p-3 rounded-xl">
              <Text className="text-black">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}