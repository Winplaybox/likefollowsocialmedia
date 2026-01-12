/**
 * Copyright (c) 2026 Winplaybox
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 *
 * Proprietary and confidential.
 */

// removed useI18n, use useTranslation below
import FeatureCard from '@/app/components/common/FeatureCard';
import {useRouter} from 'expo-router';
import {motion} from 'framer-motion';
import {Image, MessageSquare, Shuffle, Sparkles, Target, UserCircle} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import AppLayout from './components/common/AppLayout';
import {NameSpace} from './types/Enums';

export default function Landing() {
    const {t} = useTranslation(NameSpace.Common);
    const router = useRouter();
    const features = [
        {
            icon: <Image className='w-8 h-8' />,
            title: t('features.vision.title'),
            subtitle: t('features.vision.subtitle'),
            description: t('features.vision.description'),
            color: '#CCFF00',
        },
        {
            icon: <Sparkles className='w-8 h-8' />,
            title: t('features.content.title'),
            subtitle: t('features.content.subtitle'),
            description: t('features.content.description'),
            color: '#00F0FF',
        },
        {
            icon: <UserCircle className='w-8 h-8' />,
            title: t('features.bio.title'),
            subtitle: t('features.bio.subtitle'),
            description: t('features.bio.description'),
            color: '#FF0099',
        },
        {
            icon: <MessageSquare className='w-8 h-8' />,
            title: t('features.engagement.title'),
            subtitle: t('features.engagement.subtitle'),
            description: t('features.engagement.description'),
            color: '#7000FF',
        },
        {
            icon: <Shuffle className='w-8 h-8' />,
            title: t('features.remix.title'),
            subtitle: t('features.remix.subtitle'),
            description: t('features.remix.description'),
            color: '#CCFF00',
        },
        {
            icon: <Target className='w-8 h-8' />,
            title: t('features.roast.title'),
            subtitle: t('features.roast.subtitle'),
            description: t('features.roast.description'),
            color: '#00F0FF',
        },
    ];

    return (
        <AppLayout showWishlist showSettings>
            {/* Hero Section */}

            <motion.div
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                className='text-center mb-20'
            >
                <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight'>
                    {t('home.welcome')}
                    <br />
                    <span className='text-[#CCFF00]'>{t('home.subtitle')}</span> {t('home.content')}
                </h1>
                <p className='text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-12'>{t('home.description')}</p>
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => router.push('/dashboard')}
                    data-testid='hero-get-started-button'
                    className='px-12 py-6 bg-[#CCFF00] text-black text-lg font-bold rounded-full hover:bg-[#B3E600] transition-all shadow-[0_0_30px_rgba(204,255,0,0.3)]'
                >
                    {t('home.goToDashboard')}
                </motion.button>
            </motion.div>
            {/* Features Grid */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.3, duration: 0.8}}
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            >
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        subtitle={feature.subtitle}
                        description={feature.description}
                        color={feature.color}
                    />
                ))}
            </motion.div>
            {/* CTA Section */}
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.8}} className='mt-20 text-center'>
                <div className='inline-block px-8 py-3 bg-white/5 border border-white/10 rounded-full mb-6'>
                    <p className='text-sm text-[#A1A1AA]'>{t('home.trusted')}</p>
                </div>
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => router.push('/dashboard')}
                    data-testid='cta-button'
                    className='px-12 py-6 bg-[#CCFF00] text-black text-lg font-bold rounded-full hover:bg-[#B3E600] transition-all'
                >
                    {t('home.tryAllTools')}
                </motion.button>
            </motion.div>
        </AppLayout>
    );
}
