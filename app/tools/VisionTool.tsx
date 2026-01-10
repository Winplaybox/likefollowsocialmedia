import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface GeneratedResponse {
  result: string;
}

export default function VisionTool() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResponse | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission denied',
        text2: 'We need access to your photos',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select an image first',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/generate-hashtags-from-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Hashtags generated!',
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate hashtags. Please try again.',
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

  const handleSave = async (hashtags: string) => {
    const saved = JSON.parse(await AsyncStorage.getItem('hashtagHeroWishlist') || '[]');
    saved.push({
      id: Date.now(),
      type: 'Hashtag Suggestion',
      content: hashtags,
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
        <Text className="text-2xl font-bold text-white mb-2">AI Vision Hashtags</Text>
        <Text className="text-gray-400 text-sm">Upload any photo and get 30 viral, SEO-optimized hashtags instantly</Text>
      </View>

      <View className="bg-gray-800 rounded-2xl p-6 mb-6">
        <TouchableOpacity onPress={pickImage} className="bg-gray-700 rounded-xl p-6 mb-4 items-center">
          {image ? (
            <Image source={{ uri: image }} style={{ width: 200, height: 150, borderRadius: 10 }} />
          ) : (
            <Text className="text-gray-400">Tap to select image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={loading || !image}
          className="bg-green-500 p-4 rounded-xl flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-black font-bold text-lg">Generate Hashtags</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View className="bg-gray-800 rounded-2xl p-6">
          <Text className="text-white text-lg mb-4">Generated Hashtags</Text>
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