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
import Dropdown from '@/components/ui/Dropdown';
import {cn} from '@/lib/utils';
import React from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';

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
        <View className='flex-1 gap-8 bg-white border border-[#E1E6EC] rounded-[var(--shape-corner-sm)] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full justify-between'>
            {fields.map((field, idx) => (
                <View key={idx} className='w-full'>
                    {field.type === 'textarea' ? (
                        <View>
                            <Text className='block text-[11px] font-[450] mb-3 text-[#45474D] uppercase tracking-[0.1em]'>
                                {field.label}
                            </Text>
                            <TextInput
                                multiline
                                value={field.value}
                                onChangeText={field.onChange}
                                placeholder={field.placeholder}
                                placeholderTextColor='#B2BBC5'
                                className='w-full px-3 py-2 bg-[#f8f9fc] border border-[#E1E6EC] rounded-[var(--shape-corner-sm)] text-[#121317] h-auto font-normal text-lg'
                                textAlignVertical='top'
                            />
                        </View>
                    ) : field.type === 'select' && field.options ? (
                        <Dropdown
                            label={field.label}
                            value={field.value}
                            options={field.options}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                        />
                    ) : (
                        <View>
                            <Text className='block text-[11px] font-[450] mb-3 text-[#45474D] uppercase tracking-[0.1em]'>
                                {field.label}
                            </Text>
                            <TextInput
                                value={field.value}
                                onChangeText={field.onChange}
                                placeholder={field.placeholder}
                                placeholderTextColor='#B2BBC5'
                                className='w-full px-3 py-2 bg-[#f8f9fc] border border-[#E1E6EC] rounded-[var(--shape-corner-sm)] text-[#121317] font-normal text-lg'
                            />
                        </View>
                    )}
                </View>
            ))}
            <Pressable
                onPress={onSubmit}
                disabled={loading || disabled}
                className={cn(
                    'pill w-full mt-4 transition-all',
                    loading || disabled ? 'bg-[#E1E6EC] opacity-50' : 'bg-[#121317] active:scale-95 shadow-md'
                )}
            >
                <Text className='text-white tracking-tight'>{loading ? 'Loading...' : submitLabel}</Text>
            </Pressable>
        </View>
    );
}
