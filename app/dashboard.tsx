import BioTool from '@/app/tools/BioTool';
import CaptionTool from '@/app/tools/CaptionTool';
import CommentTool from '@/app/tools/CommentTool';
import RemixTool from '@/app/tools/RemixTool';
import RoastTool from '@/app/tools/RoastTool';
import VisionTool from '@/app/tools/VisionTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark } from 'lucide-react';
import React from 'react';

const Dashboard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#CCFF00] opacity-5 blur-[100px] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center border-b border-white/10">
        <button 
          onClick={() => router.back()}
          data-testid="back-to-home-button"
          className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="text-2xl font-bold">
          <span className="text-[#CCFF00]">Hashtag</span>
          <span className="text-white">Hero</span>
        </div>
        <button
          onClick={() => router.push('/wishlist' as any)}
          data-testid="dashboard-wishlist-button"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all"
        >
          <Bookmark className="w-4 h-4" />
          Wishlist
        </button>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Content Studio</h1>
          <p className="text-[#A1A1AA]">Choose a tool to supercharge your social media</p>
        </div>

        <Tabs defaultValue="vision" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 bg-transparent mb-8" data-testid="dashboard-tabs">
            <TabsTrigger 
              value="vision" 
              data-testid="tab-vision"
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium"
            >
              Vision
            </TabsTrigger>
            <TabsTrigger 
              value="caption" 
              data-testid="tab-caption"
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium"
            >
              Caption
            </TabsTrigger>
            <TabsTrigger 
              value="bio" 
              data-testid="tab-bio"
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium"
            >
              Bio
            </TabsTrigger>
            <TabsTrigger 
              value="comment" 
              data-testid="tab-comment"
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium"
            >
              Comment
            </TabsTrigger>
            <TabsTrigger 
              value="remix" 
              data-testid="tab-remix"
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium"
            >
              Remix
            </TabsTrigger>
            <TabsTrigger 
              value="roast" 
              data-testid="tab-roast"
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium"
            >
              Roast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vision" data-testid="vision-tool-content">
            <VisionTool />
          </TabsContent>

          <TabsContent value="caption" data-testid="caption-tool-content">
            <CaptionTool />
          </TabsContent>

          <TabsContent value="bio" data-testid="bio-tool-content">
            <BioTool />
          </TabsContent>

          <TabsContent value="comment" data-testid="comment-tool-content">
            <CommentTool />
          </TabsContent>

          <TabsContent value="remix" data-testid="remix-tool-content">
            <RemixTool />
          </TabsContent>

          <TabsContent value="roast" data-testid="roast-tool-content">
            <RoastTool />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;