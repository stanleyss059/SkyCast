import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const NUM_DROPS = 18;
const DROP_LENGTH = 32;
const DROP_COLOR = 'rgba(180,200,255,0.35)';

function randomX() {
    return Math.random() * width;
}

function randomDelay() {
    return Math.random() * 2000;
}

export default function RainEffect() {
    const drops = Array.from({ length: NUM_DROPS }).map(() => useRef(new Animated.Value(0)).current);

    useEffect(() => {
        drops.forEach((drop, i) => {
            const animate = () => {
                drop.setValue(0);
                Animated.timing(drop, {
                    toValue: 1,
                    duration: 1200 + Math.random() * 800,
                    delay: randomDelay(),
                    useNativeDriver: true,
                }).start(() => animate());
            };
            animate();
        });
    }, []);

    return (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width, height, zIndex: 99 }}>
            {drops.map((drop, i) => {
                const x = randomX();
                const translateY = drop.interpolate({ inputRange: [0, 1], outputRange: [-DROP_LENGTH, height + DROP_LENGTH] });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            left: x,
                            width: 2,
                            height: DROP_LENGTH,
                            backgroundColor: DROP_COLOR,
                            borderRadius: 1,
                            opacity: 0.7,
                            transform: [{ translateY }],
                        }}
                    />
                );
            })}
        </View>
    );
} 