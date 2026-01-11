
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  color?: string;
  onClick?: () => void;
}

export default function FeatureCard({ icon, title, subtitle, description, color = '#CCFF00', onClick }: FeatureCardProps) {
  return (
    <div
      className="rounded-2xl p-6 bg-[#0A0A0A] border border-white/10 flex flex-col items-start gap-3 cursor-pointer hover:bg-white/5 transition-all"
      style={{ borderColor: color }}
      onClick={onClick}
    >
      <div className="mb-2" style={{ color }}>{icon}</div>
      <div className="font-bold text-lg text-white">{title}</div>
      <div className="text-[#A1A1AA] text-sm font-semibold">{subtitle}</div>
      <div className="text-[#A1A1AA] text-sm mt-1">{description}</div>
    </div>
  );
}
