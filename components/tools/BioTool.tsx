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

export default function BioTool() {
  const [details, setDetails] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!details.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please provide details about yourself',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-bio`, {
        details,
        platform,
      });

      setResult(response.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bio generated successfully!',
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate bio. Please try again.',
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

  const handleSave = async (bio: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Bio Suggestion',
      content: bio,
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
        <Text className="text-2xl font-bold text-white mb-2">AI Bio Generator</Text>
        <Text className="text-gray-400 text-sm">Craft the perfect bio that converts visitors into followers</Text>
      </View>

      <View className="bg-gray-800 rounded-2xl p-6 mb-6">
        <View className="mb-4">
          <Text className="text-white mb-2">Profile Details</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Describe yourself: interests, profession, personality..."
            className="bg-gray-700 text-white p-4 rounded-xl"
            multiline
            numberOfLines={4}
          />
        </View>

        <View className="mb-6">
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

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={loading}
          className="bg-green-500 p-4 rounded-xl flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black font-bold text-lg">Generate Bio</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View className="bg-gray-800 rounded-2xl p-6">
          <Text className="text-white text-lg mb-4">Generated Bio</Text>
          <Text className="text-white bg-gray-700 p-4 rounded-xl mb-4">{result.result}</Text>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-400">
              {result.character_count} characters
            </Text>
            <Text className={result.character_count > (result.platform_limit || 0) ? 'text-red-400' : 'text-green-400'}>
              {result.character_count} / {result.platform_limit}
            </Text>
          </View>
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