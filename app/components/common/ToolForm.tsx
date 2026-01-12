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
import {motion} from 'framer-motion';
import React from 'react';

interface ToolFormProps {
    fields: Array<{
        label: string;
        value: string;
        onChange: (v: string) => void;
        type?: 'text' | 'textarea' | 'select';
        options?: Array<{value: string; label: string}>;
        placeholder?: string;
        testId?: string;
    }>;
    onSubmit: () => void;
    loading: boolean;
    submitLabel: string;
    disabled?: boolean;
}

export default function ToolForm({fields, onSubmit, loading, submitLabel, disabled}: ToolFormProps) {
    return (
        <motion.form
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className='space-y-6 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8'
        >
            {fields.map((field, idx) => (
                <div key={idx}>
                    <label className='block text-sm font-medium mb-2'>{field.label}</label>
                    {field.type === 'textarea' ? (
                        <textarea
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={field.placeholder}
                            data-testid={field.testId}
                            className='w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all h-32 resize-none'
                        />
                    ) : field.type === 'select' && field.options ? (
                        <select
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            data-testid={field.testId}
                            className='w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all'
                        >
                            {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={field.placeholder}
                            data-testid={field.testId}
                            className='w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all'
                        />
                    )}
                </div>
            ))}
            <button
                type='submit'
                disabled={loading || disabled}
                className='w-full px-8 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B3E600] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
            >
                {loading ? <span>Loading...</span> : submitLabel}
            </button>
        </motion.form>
    );
}
