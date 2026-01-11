
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

interface AppContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppContainer({ children, className = '' }: AppContainerProps) {
  return (
    <div className={`min-h-screen bg-[#050505] ${className}`}>
      {children}
    </div>
  );
}
