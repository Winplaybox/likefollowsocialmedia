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
import React from 'react';

interface AppContentProps {
    children: React.ReactNode;
    className?: string;
}

export default function AppContent({children, className = ''}: AppContentProps) {
    return <div className={`max-w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-grow ${className}`}>{children}</div>;
}
