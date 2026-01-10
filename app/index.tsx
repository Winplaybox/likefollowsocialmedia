import { useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Landing() {
  const router = useRouter();

  const features = [
    {
      icon: '🖼️',
      title: 'Vision',
      subtitle: 'Image-to-Hashtag',
      description: 'Upload any photo and get 30 viral, SEO-optimized hashtags instantly.',
    },
    {
      icon: '✨',
      title: 'Content',
      subtitle: 'Magic Caption Generator',
      description: 'Generate engaging captions that drive likes, comments, and shares.',
    },
    {
      icon: '👤',
      title: 'Bio',
      subtitle: 'Profile Optimizer',
      description: 'Craft the perfect bio that converts visitors into followers.',
    },
    {
      icon: '💬',
      title: 'Engagement',
      subtitle: 'AI Comment Wingman',
      description: 'Get smart reply suggestions to boost engagement and build community.',
    },
    {
      icon: '🔄',
      title: 'Remix',
      subtitle: 'One Post, Everywhere',
      description: 'Adapt your content for Instagram, TikTok, and YouTube in one click.',
    },
    {
      icon: '🔥',
      title: 'Roast',
      subtitle: 'Profile Audit',
      description: 'Get brutally honest feedback to level up your social media game.',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-black">
      {/* Background glow */}
      <View className="absolute top-0 left-1/2 -ml-40 w-80 h-60 bg-green-500 opacity-10 blur-3xl" />

      {/* Navigation */}
      <View className="flex-row justify-between items-center px-6 py-8">
        <Text className="text-2xl font-bold">
          <Text className="text-green-400">Hashtag</Text>
          <Text className="text-white">Hero</Text>
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/wishlist')}
          className="flex-row items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full"
        >
          <Bookmark size={16} color="white" />
          <Text className="text-white">Wishlist</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View className="px-6 py-20">
        <Text className="text-5xl font-bold text-center mb-6 leading-tight">
          Go Viral with{'\n'}
          <Text className="text-green-400">AI-Powered</Text> Content
        </Text>
        <Text className="text-gray-400 text-lg text-center max-w-md mx-auto mb-12">
          Generate trending hashtags, viral captions, and optimized bios for Instagram, TikTok, and YouTube. 100% free, powered by AI.
        </Text>
        <View className="flex-row justify-center gap-4">
          <TouchableOpacity
            onPress={() => router.push('/dashboard')}
            className="px-8 py-4 bg-green-400 text-black font-bold rounded-full"
          >
            <Text className="text-black font-bold">Start Creating for Free</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features Grid */}
      <View className="px-6 pb-20">
        <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <View key={index} className="bg-gray-900 border border-white/10 rounded-2xl p-6">
              <Text className="text-3xl mb-4">{feature.icon}</Text>
              <Text className="text-xl font-bold text-white mb-2">{feature.title}</Text>
              <Text className="text-green-400 text-sm font-mono mb-3">{feature.subtitle}</Text>
              <Text className="text-gray-400 leading-relaxed">{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 py-8 border-t border-white/10">
        <Text className="text-gray-400 text-center">© 2025 HashtagHero. Powered by AI. Built for creators.</Text>
      </View>
    </ScrollView>
  );
}