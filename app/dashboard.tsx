import BioTool from '@/app/tools/BioTool';
import CaptionTool from '@/app/tools/CaptionTool';
import CommentTool from '@/app/tools/CommentTool';
import RemixTool from '@/app/tools/RemixTool';
import RoastTool from '@/app/tools/RoastTool';
import VisionTool from '@/app/tools/VisionTool';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const tools = [
  { key: 'vision', label: 'Vision', component: VisionTool },
  { key: 'caption', label: 'Caption', component: CaptionTool },
  { key: 'bio', label: 'Bio', component: BioTool },
  { key: 'comment', label: 'Comment', component: CommentTool },
  { key: 'remix', label: 'Remix', component: RemixTool },
  { key: 'roast', label: 'Roast', component: RoastTool },
];

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('caption');

  const ActiveComponent = tools.find(tool => tool.key === activeTab)?.component || (() => null);

  return (
    <View className="flex-1 bg-black">
      <View className="px-6 py-6 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 text-gray-400 mb-4">
          <Text className="text-gray-400">← Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white mb-2">AI Content Studio</Text>
        <Text className="text-gray-400">Choose a tool to supercharge your social media</Text>
      </View>

      <ScrollView horizontal className="px-6 py-4 border-b border-white/10" showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.key}
              onPress={() => setActiveTab(tool.key)}
              className={`px-4 py-3 rounded-xl ${
                activeTab === tool.key ? 'bg-green-400 text-black' : 'bg-white/5 border border-white/10 text-white'
              }`}
            >
              <Text className={activeTab === tool.key ? 'text-black font-bold' : 'text-white'}>{tool.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ActiveComponent />
    </View>
  );
}