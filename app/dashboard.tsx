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

import AppLayout from '@/app/components/common/AppLayout';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/app/components/ui/tabs';
import BioTool from '@/app/tools/BioTool';
import CaptionTool from '@/app/tools/CaptionTool';
import CommentTool from '@/app/tools/CommentTool';
import RemixTool from '@/app/tools/RemixTool';
import RoastTool from '@/app/tools/RoastTool';
import VisionTool from '@/app/tools/VisionTool';
import React from 'react';
import {useTranslation} from 'react-i18next';
// ...existing code...
import {NameSpace} from './types/Enums';

const Dashboard: React.FC = () => {
    const {t} = useTranslation(NameSpace.Common);
    const TOOLS = [
        {id: 'vision', label: t('dashboard.vision'), component: VisionTool, testId: 'vision-tool'},
        {id: 'caption', label: t('dashboard.caption'), component: CaptionTool, testId: 'caption-tool'},
        {id: 'bio', label: t('dashboard.bio'), component: BioTool, testId: 'bio-tool'},
        {id: 'comment', label: t('dashboard.comment'), component: CommentTool, testId: 'comment-tool'},
        {id: 'remix', label: t('dashboard.remix'), component: RemixTool, testId: 'remix-tool'},
        {id: 'roast', label: t('dashboard.roast'), component: RoastTool, testId: 'roast-tool'},
    ];

    return (
        <AppLayout showBack showWishlist showSettings>
            <div className='mb-8'>
                <h1 className='text-4xl font-bold mb-2 text-white'>{t('dashboard.toolsHeading')}</h1>
                <p className='text-[#A1A1AA]'>{t('dashboard.toolsDescription')}</p>
            </div>
            <Tabs defaultValue='vision' className='w-full'>
                {/* Dynamic Tab Triggers */}
                <TabsList className='grid w-full grid-cols-2 lg:grid-cols-6 gap-2 bg-transparent mb-8' data-testid='dashboard-tabs'>
                    {TOOLS.map((tool) => (
                        <TabsTrigger
                            key={tool.id}
                            value={tool.id}
                            data-testid={`tab-${tool.id}`}
                            className='data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-medium transition-all'
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
        </AppLayout>
    );
};
export default Dashboard;
