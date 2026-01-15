import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

interface TypewriterProps {
    text: string;
    speed?: number;
    className?: string;
    onComplete?: (completed: boolean) => void;
    showCursor?: boolean;
    start?: boolean;
    delay?: number;
}

/**
 * A typewriter effect component for React Native.
 * Features:
 * - Dynamic text updates (resets on text change)
 * - Start/Delay controls
 * - Pulse cursor animation
 * - Completion callback
 */
export default function Typewriter({
    text,
    speed = 60,
    className = '',
    onComplete,
    showCursor = true,
    start = true,
    delay = 0,
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    // Reset component state whenever the text prop changes or component unmounts
    useEffect(() => {
        setDisplayedText('');
        setCurrentIndex(0);
        setIsComplete(false);
        setHasStarted(false);

        return () => {
            // Cleanup state on unmount
            setDisplayedText('');
            setCurrentIndex(0);
            setIsComplete(false);
        };
    }, [text]);

    useEffect(() => {
        // Only start if the 'start' prop is true
        if (!start) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        // Handle initial delay
        if (!hasStarted) {
            timeoutId = setTimeout(() => {
                setHasStarted(true);
            }, delay);
            return () => clearTimeout(timeoutId);
        }

        // Typing logic
        if (currentIndex < text.length) {
            timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeoutId);
        } else if (!isComplete && text.length > 0) {
            setIsComplete(true);
            onComplete?.(true);
        }
    }, [currentIndex, text, speed, isComplete, onComplete, start, delay, hasStarted]);

    return (
        <View className='flex-row flex-wrap items-center'>
            <Text className={className}>{displayedText}</Text>
            {showCursor && !isComplete && <View className='w-[2px] h-[1.2em] bg-current ml-1 animate-pulse' style={{opacity: 0.8}} />}
        </View>
    );
}
