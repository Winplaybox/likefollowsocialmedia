import React from 'react';
import {Platform, ScrollView} from 'react-native';

interface AppContentProps {
    children: React.ReactNode;
    className?: string;
    onScroll?: (y: number) => void;
}

export default function AppContent({children, className = ''}: AppContentProps) {
    return (
        <ScrollView className={`flex-1 ${className}`} scrollEventThrottle={16} decelerationRate={Platform.OS === 'ios' ? 'normal' : 0.9}>
            {children}
        </ScrollView>
    );
}
