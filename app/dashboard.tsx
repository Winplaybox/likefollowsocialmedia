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

import AppLayout from '@/components/common/AppLayout';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs';
import {cn} from '@/lib/utils';
import BioTool from '@/tools/BioTool';
import CaptionTool from '@/tools/CaptionTool';
import CommentTool from '@/tools/CommentTool';
import RemixTool from '@/tools/RemixTool';
import RoastTool from '@/tools/RoastTool';
import VisionTool from '@/tools/VisionTool';
import {NameSpace} from '@/types/Enums';
import {Camera, FileText, MessageSquare, Repeat2, User, Zap} from 'lucide-react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

const Dashboard: React.FC = () => {
    const {t} = useTranslation(NameSpace.Common);
    const TOOLS = [
        {id: 'vision', label: t('dashboard.vision'), icon: Camera, component: VisionTool, testId: 'vision-tool'},
        {id: 'caption', label: t('dashboard.caption'), icon: FileText, component: CaptionTool, testId: 'caption-tool'},
        {id: 'bio', label: t('dashboard.bio'), icon: User, component: BioTool, testId: 'bio-tool'},
        {id: 'comment', label: t('dashboard.comment'), icon: MessageSquare, component: CommentTool, testId: 'comment-tool'},
        {id: 'remix', label: t('dashboard.remix'), icon: Repeat2, component: RemixTool, testId: 'remix-tool'},
        {id: 'roast', label: t('dashboard.roast'), icon: Zap, component: RoastTool, testId: 'roast-tool'},
    ];

    const [activeTab, setActiveTab] = React.useState('vision');
    const ActiveComponent = TOOLS.find((t) => t.id === activeTab)?.component || VisionTool;

    const headerOpacity = useSharedValue(0);
    const headerTranslateY = useSharedValue(30);
    const contentOpacity = useSharedValue(0);
    const contentTranslateY = useSharedValue(20);

    useEffect(() => {
        headerOpacity.value = withTiming(1, {duration: 500});
        headerTranslateY.value = withTiming(0, {duration: 500});
    }, []);

    useEffect(() => {
        contentOpacity.value = 0;
        contentTranslateY.value = 20;
        contentOpacity.value = withTiming(1, {duration: 300});
        contentTranslateY.value = withTiming(0, {duration: 300});
    }, [activeTab]);

    const headerStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
        transform: [{translateY: headerTranslateY.value}],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{translateY: contentTranslateY.value}],
    }));

    return (
        <AppLayout showBack showWishlist showSettings>
            {/* <Animated.View style={headerStyle} className='mb-24 items-center'>
                <Typewriter
                    text={t('dashboard.toolsHeading')}
                    speed={70}
                    className='text-[54px] font-[450] mb-6 text-[#121317] tracking-tight text-center leading-[1.1]'
                />
                <Text className='text-[#45474D] font-normal text-xl max-w-2xl text-center leading-relaxed tracking-tight'>
                    {t('dashboard.toolsDescription')}
                </Text>
            </Animated.View> */}

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-full flex flex-col justify-between items-center  h-[calc(100vh-52px)]'
            >
                <View key={activeTab} className='w-full h-full flex-1 items-center justify-center'>
                    <View className='flex flex-col lg:flex-row gap-8 w-full lg:w-[80%] h-[91%] items-start'>
                        <ActiveComponent />
                    </View>
                </View>
                <TabsList>
                    {TOOLS.map((tool) => (
                        <TabsTrigger key={tool.id} value={tool.id}>
                            <View className='flex-row items-center gap-3'>
                                <tool.icon size={20} color={activeTab === tool.id ? '#121317' : '#45474D'} strokeWidth={1.5} />
                                <Text
                                    className={cn(
                                        'text-[15px] font-[500] tracking-tight',
                                        activeTab === tool.id ? 'text-[#121317]' : 'text-[#45474D]'
                                    )}
                                >
                                    {tool.label}
                                </Text>
                            </View>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </AppLayout>
    );
};

export default Dashboard;
