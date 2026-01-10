import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface GeneratedResponse {
  result: string;
}

export default function RoastTool() {
  const [profileDetails, setProfileDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const handleGenerate = async () => {
    if (!profileDetails.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please provide your profile details',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/roast-profile`, {
        profile_details: profileDetails,
      });

      setResult(response.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile roasted successfully!',
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to roast profile. Please try again.',
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

  const handleSave = async (roast: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Profile Roast',
      content: roast,
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
        <Text className="text-2xl font-bold text-white mb-2">Profile Roast</Text>
        <Text className="text-gray-400 text-sm">Get brutally honest feedback to level up your social media game</Text>
      </View>

      <View className="bg-gray-800 rounded-2xl p-6 mb-6">
        <View className="mb-4">
          <Text className="text-white mb-2">Your Profile Details</Text>
          <TextInput
            value={profileDetails}
            onChangeText={setProfileDetails}
            placeholder="Share details about your profile: bio, content type, posting frequency, engagement, follower count, etc."
            className="bg-gray-700 text-white p-4 rounded-xl"
            multiline
            numberOfLines={6}
          />
        </View>

        <View className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
          <Text className="text-orange-400 text-sm">Warning: This tool provides honest, constructive criticism. Expect direct feedback!</Text>
        </View>

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={loading}
          className="bg-green-500 p-4 rounded-xl flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black font-bold text-lg">Roast My Profile</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View className="bg-gray-800 rounded-2xl p-6">
          <Text className="text-white text-lg mb-4">Profile Roast</Text>
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