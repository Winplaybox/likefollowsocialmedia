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
import LanguageSelector from '@/app/locales/LanguageSelector';
import {NameSpace} from '@/app/types/Enums';
import React from 'react';
import {useTranslation} from 'react-i18next';

export default function AppFooter() {
    const {t} = useTranslation(NameSpace.Common);
    return (
        <>
            <footer className='relative z-10 mt-32 py-8 border-t border-white/10 flex-grow0'>
                <div className='max-w-7xl mx-auto px-6 text-center text-[#A1A1AA] text-sm flex flex-row items-center justify-center gap-4'>
                    <p>{t('home.footer', {year: new Date().getFullYear()})}</p>
                    <LanguageSelector />
                </div>
            </footer>
        </>
    );
}
