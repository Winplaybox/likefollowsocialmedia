/**
 * MorphingGradient - Google Antigravity style animated background
 * Features slow-moving, organic gradient blobs that morph and blend
 */
import React, {useEffect} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import Animated, {
    Easing,
    interpolate,
    SensorType,
    useAnimatedSensor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const MorphingBlob = ({
    index,
    color,
    size,
    initialX,
    initialY,
}: {
    index: number;
    color: string;
    size: number;
    initialX: number;
    initialY: number;
}) => {
    const progress = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        // Continuous morphing animation
        progress.value = withRepeat(
            withTiming(1, {
                duration: 25000 + index * 5000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );

        // Breathing scale animation
        scale.value = withRepeat(
            withTiming(1.2, {
                duration: 10000 + index * 2000,
                easing: Easing.inOut(Easing.sin),
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(progress.value, [0, 0.5, 1], [0, SCREEN_WIDTH * 0.15, 0]);
        const translateY = interpolate(progress.value, [0, 0.5, 1], [0, SCREEN_HEIGHT * 0.1, 0]);

        return {
            transform: [{translateX: initialX + translateX}, {translateY: initialY + translateY}, {scale: scale.value}],
            opacity: 0.1,
        };
    });

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    width: size,
                    height: size,
                    backgroundColor: color,
                    borderRadius: size / 2,
                },
            ]}
            className='blur-[180px]'
        />
    );
};

const FloatingParticle = ({index}: {index: number}) => {
    const x = useSharedValue(Math.random() * SCREEN_WIDTH);
    const y = useSharedValue(Math.random() * SCREEN_HEIGHT);
    const opacity = useSharedValue(Math.random() * 0.2 + 0.05);

    useEffect(() => {
        x.value = withRepeat(
            withTiming(Math.random() * SCREEN_WIDTH, {
                duration: 30000 + Math.random() * 20000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );

        y.value = withRepeat(
            withTiming(Math.random() * SCREEN_HEIGHT, {
                duration: 30000 + Math.random() * 20000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: x.value}, {translateY: y.value}],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: 'absolute',
                    width: 2.5,
                    height: 2.5,
                    backgroundColor: '#B2BBC5',
                    borderRadius: 2,
                },
            ]}
        />
    );
};

export default function MorphingGradient() {
    const mouseX = useSharedValue(0);
    const mouseY = useSharedValue(0);

    const sensor = Platform.OS !== 'web' ? useAnimatedSensor(SensorType.GYROSCOPE) : null;

    useEffect(() => {
        if (Platform.OS === 'web') {
            const handleMouseMove = (e: MouseEvent) => {
                mouseX.value = withTiming((e.clientX - SCREEN_WIDTH / 2) / 80, {duration: 300});
                mouseY.value = withTiming((e.clientY - SCREEN_HEIGHT / 2) / 80, {duration: 300});
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    const parallaxStyle = useAnimatedStyle(() => {
        if (Platform.OS === 'web') {
            return {
                transform: [{translateX: mouseX.value}, {translateY: mouseY.value}],
            };
        } else if (sensor) {
            const {x, y} = sensor.sensor.value;
            return {
                transform: [{translateX: withTiming(x * 10, {duration: 200})}, {translateY: withTiming(y * 10, {duration: 200})}],
            };
        }
        return {};
    });

    return (
        <View style={StyleSheet.absoluteFill} className='pointer-events-none z-0 overflow-hidden bg-white' pointerEvents='none'>
            <Animated.View style={[StyleSheet.absoluteFill, parallaxStyle]}>
                {/* Large morphing gradient blobs */}
                <MorphingBlob index={0} color='#4285F4' size={900} initialX={-300} initialY={-300} />
                <MorphingBlob index={1} color='#E8F0FE' size={800} initialX={SCREEN_WIDTH - 500} initialY={-200} />
                <MorphingBlob index={2} color='#F1F3F4' size={700} initialX={SCREEN_WIDTH / 2 - 350} initialY={SCREEN_HEIGHT - 300} />

                {/* Subtle floating particles */}
                {[...Array(30)].map((_, i) => (
                    <FloatingParticle key={i} index={i} />
                ))}
            </Animated.View>
        </View>
    );
}
