import React, {useEffect} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import Animated, {SensorType, useAnimatedSensor, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Particle = ({index}: {index: number}) => {
    const tx = useSharedValue(Math.random() * SCREEN_WIDTH);
    const ty = useSharedValue(Math.random() * SCREEN_HEIGHT);
    const opacity = useSharedValue(Math.random() * 0.4 + 0.1);

    useEffect(() => {
        tx.value = withRepeat(withTiming(Math.random() * SCREEN_WIDTH, {duration: 20000 + Math.random() * 20000}), -1, true);
        ty.value = withRepeat(withTiming(Math.random() * SCREEN_HEIGHT, {duration: 20000 + Math.random() * 20000}), -1, true);
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{translateX: (tx.value - SCREEN_WIDTH / 2) * 0.1}, {translateY: (ty.value - SCREEN_HEIGHT / 2) * 0.1}],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                style,
                {
                    position: 'absolute',
                    left: `${(index * 13) % 100}%`,
                    top: `${(index * 19) % 100}%`,
                    width: 2.5,
                    height: 3.5,
                    backgroundColor: '#00F0FF',
                    borderRadius: 1,
                },
            ]}
        />
    );
};

export default function InteractiveBackground() {
    const mouseX = useSharedValue(0);
    const mouseY = useSharedValue(0);

    // Sensors for native parallax
    const sensor = Platform.OS !== 'web' ? useAnimatedSensor(SensorType.GYROSCOPE) : null;

    useEffect(() => {
        if (Platform.OS === 'web') {
            const handleMouseMove = (e: MouseEvent) => {
                mouseX.value = withTiming((e.clientX - SCREEN_WIDTH / 2) / 40, {duration: 200});
                mouseY.value = withTiming((e.clientY - SCREEN_HEIGHT / 2) / 40, {duration: 200});
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
                transform: [{translateX: withTiming(x * 20, {duration: 100})}, {translateY: withTiming(y * 20, {duration: 100})}],
            };
        }
        return {};
    });

    return (
        <View style={StyleSheet.absoluteFill} className='pointer-events-none z-0 overflow-hidden bg-white mt-[-100px]'>
            <View style={StyleSheet.absoluteFill} className='antigravity-portal' />
            <Animated.View style={[StyleSheet.absoluteFill, parallaxStyle]} className='vignette-portal'>
                {/* Sharp Floating Particles - Reduced count for performance */}
                {[...Array(120)].map((_, i) => (
                    <Particle key={i} index={i} />
                ))}

                {/* Subtle Glow Hub - Center focused */}
                <View
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 800,
                        height: 800,
                        marginLeft: -400,
                        marginTop: -400,
                        backgroundColor: '#00F0FF',
                        borderRadius: 400,
                        opacity: 0.03,
                    }}
                    className='blur-[100px]'
                />
            </Animated.View>
        </View>
    );
}
