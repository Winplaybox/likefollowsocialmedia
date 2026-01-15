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
import {cn} from '@/lib/utils';
import * as React from 'react';
import {Pressable, ScrollView, View} from 'react-native';

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

const Tabs = ({defaultValue, value: controlledValue, onValueChange, children, className}: TabsProps) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = React.useCallback(
        (newValue: string) => {
            if (!isControlled) {
                setUncontrolledValue(newValue);
            }
            onValueChange?.(newValue);
        },
        [isControlled, onValueChange]
    );

    return (
        <TabsContext.Provider value={{value, onValueChange: handleValueChange}}>
            <View className={cn(className)}>{children}</View>
        </TabsContext.Provider>
    );
};

const TabsList = ({className, children}: {children: React.ReactNode; className?: string}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className={cn('w-full max-h-[52px] absolute bottom-0 flex justify-start lg:justify-center', className)}
            contentContainerStyle={{
                paddingHorizontal: 10,
                alignItems: 'center',
                gap: 6,
            }}
            style={{
                insetInline: 0,
                insetBlockEnd: 36,
            }}
        >
            {children}
        </ScrollView>
    );
};

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

const TabsTrigger = ({className, value, children}: TabsTriggerProps) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');
    const {value: activeValue, onValueChange} = context;
    const isActive = activeValue === value;

    return (
        <Pressable
            onPress={() => onValueChange(value)}
            className={cn(
                'px-8 h-[52px] rounded-full flex-row items-center justify-center  transition-all  backdrop-blur[8px]  bg-[#b7bfd917] color-[var(--palette-grey-1200)] border border-[var(--theme-outline-variant)]',
                isActive ? 'border-[var(--theme-inverse-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.05)]' : 'opacity-70',
                className
            )}
        >
            {children}
        </Pressable>
    );
};

const TabsContent = ({value, className, children}: {value: string; children: React.ReactNode; className?: string}) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');
    if (context.value !== value) return null;
    return <View className={cn('mt-8', className)}>{children}</View>;
};

export {Tabs, TabsContent, TabsList, TabsTrigger};
