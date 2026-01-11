import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark } from 'lucide-react';
import React from 'react';

// Tools Imports
import BioTool from '@/app/tools/BioTool';
import CaptionTool from '@/app/tools/CaptionTool';
import CommentTool from '@/app/tools/CommentTool';
import RemixTool from '@/app/tools/RemixTool';
import RoastTool from '@/app/tools/RoastTool';
import VisionTool from '@/app/tools/VisionTool';

// --- Configuration ---

type ToolConfig = {
  id: string;
  label: string;
  component: React.ComponentType;
  testId: string;
};

const TOOLS: ToolConfig[] = [
  { id: 'vision', label: 'Vision', component: VisionTool, testId: 'vision-tool' },
  { id: 'caption', label: 'Caption', component: CaptionTool, testId: 'caption-tool' },
  { id: 'bio', label: 'Bio', component: BioTool, testId: 'bio-tool' },
  { id: 'comment', label: 'Comment', component: CommentTool, testId: 'comment-tool' },
  { id: 'remix', label: 'Remix', component: RemixTool, testId: 'remix-tool' },
  { id: 'roast', label: 'Roast', component: RoastTool, testId: 'roast-tool' },
];

const THEME = {
  colors: {
    bg: '#050505',
    accent: '#CCFF00',
    textMuted: '#A1A1AA',
    border: 'rgba(255, 255, 255, 0.1)',
  }
};

// --- Sub-Components ---

const DashboardHeader = ({ onBack, onWishlist }: { onBack: () => void, onWishlist: () => void }) => (
  <nav className="relative z-10 px-6 py-6 flex justify-between items-center border-b border-white/10">
    <button 
      onClick={onBack}
      data-testid="back-to-home-button"
      className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </button>
    
    <div className="text-2xl font-bold select-none">
      <span className="text-[#CCFF00]">Hashtag</span>
      <span className="text-white">Hero</span>
    </div>

    <button
      onClick={onWishlist}
      data-testid="dashboard-wishlist-button"
      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all"
    >
      <Bookmark className="w-4 h-4" />
      Wishlist
    </button>
  </nav>
);

// --- Main Component ---

const Dashboard: React.FC = () => {
  const router = useRouter();

  // Handlers
  const handleBack = () => router.back();
  const handleWishlist = () => router.push('/wishlist' as any); // Type assertion kept for expo-router specifics

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#CCFF00] opacity-5 blur-[100px] pointer-events-none" />
      
      <DashboardHeader onBack={handleBack} onWishlist={handleWishlist} />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">AI Content Studio</h1>
          <p className="text-[#A1A1AA]">Choose a tool to supercharge your social media</p>
        </div>

        <Tabs defaultValue="vision" className="w-full">
          {/* Dynamic Tab Triggers */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 bg-transparent mb-8" data-testid="dashboard-tabs">
            {TOOLS.map((tool) => (
              <TabsTrigger 
                key={tool.id}
                value={tool.id} 
                data-testid={`tab-${tool.id}`}
                className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium transition-all"
              >
                {tool.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dynamic Tab Content */}
          {TOOLS.map((tool) => (
            <TabsContent key={tool.id} value={tool.id} data-testid={`${tool.id}-content`}>
              <tool.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;