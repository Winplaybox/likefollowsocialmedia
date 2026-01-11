import { useRouter } from 'expo-router';
import { motion } from 'framer-motion';
import { Bookmark, Image, MessageSquare, Shuffle, Sparkles, Target, UserCircle } from 'lucide-react';
import { ScrollView } from 'react-native';

export default function Landing() {
  const router = useRouter();

   const features = [
    {
      icon: <Image className="w-8 h-8" />,
      title: "Vision",
      subtitle: "Image-to-Hashtag",
      description: "Upload any photo and get 30 viral, SEO-optimized hashtags instantly.",
      color: "#CCFF00"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Content",
      subtitle: "Magic Caption Generator",
      description: "Generate engaging captions that drive likes, comments, and shares.",
      color: "#00F0FF"
    },
    {
      icon: <UserCircle className="w-8 h-8" />,
      title: "Bio",
      subtitle: "Profile Optimizer",
      description: "Craft the perfect bio that converts visitors into followers.",
      color: "#FF0099"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Engagement",
      subtitle: "AI Comment Wingman",
      description: "Get smart reply suggestions to boost engagement and build community.",
      color: "#7000FF"
    },
    {
      icon: <Shuffle className="w-8 h-8" />,
      title: "Remix",
      subtitle: "One Post, Everywhere",
      description: "Adapt your content for Instagram, TikTok, and YouTube in one click.",
      color: "#CCFF00"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Roast",
      subtitle: "Profile Audit",
      description: "Get brutally honest feedback to level up your social media game.",
      color: "#00F0FF"
    }
  ];

  return (
    <ScrollView>
      <div className="min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#CCFF00] opacity-10 blur-[120px] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight"
        >
          <span className="text-[#CCFF00]">Hashtag</span>
          <span className="text-white">Hero</span>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/wishlist')}
          data-testid="nav-wishlist-button"
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all"
        >
          <Bookmark className="w-4 h-4" />
          Wishlist
        </motion.button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Go Viral with
            <br />
            <span className="text-[#CCFF00]">AI-Powered</span> Content
          </h1>
          <p className="text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-12">
            Generate trending hashtags, viral captions, and optimized bios for Instagram, TikTok, and YouTube. 
            100% free, powered by AI.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            data-testid="hero-get-started-button"
            className="px-12 py-6 bg-[#CCFF00] text-black text-lg font-bold rounded-full hover:bg-[#B3E600] transition-all shadow-[0_0_30px_rgba(204,255,0,0.3)]"
          >
            Start Creating for Free
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              data-testid={`feature-card-${index}`}
              className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:border-[#CCFF00]/50 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div 
                  className="inline-flex p-3 rounded-xl mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <div style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#CCFF00] mb-3 font-mono">{feature.subtitle}</p>
                <p className="text-[#A1A1AA] leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-8 py-3 bg-white/5 border border-white/10 rounded-full mb-6">
            <p className="text-sm text-[#A1A1AA]">
              Trusted by 10,000+ creators • 100% Free • No Credit Card
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            data-testid="cta-button"
            className="px-12 py-6 bg-[#CCFF00] text-black text-lg font-bold rounded-full hover:bg-[#B3E600] transition-all"
          >
            Try All Tools Now
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-32 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-[#A1A1AA] text-sm">
          <p>© {new Date().getFullYear()} HashtagHero. Powered by AI. Built for creators.</p>
        </div>
      </footer>
    </div>
    </ScrollView>
  );
}