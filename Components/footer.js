import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const accent = '#FFD600';
const inactive = 'white';

const tabs = [
  { name: 'Today', icon: 'calendar-today' },
  { name: 'Hourly', icon: 'clock-outline' },
  { name: 'Daily', icon: 'calendar-outline' },
  { name: 'Maps', icon: 'map' },
];

export default function Footer({ navigation }) {
  const [pressed, setPressed] = useState(null);
  // Get the current route name from navigation state
  let currentRoute = '';
  try {
    const state = navigation.getState();
    const routes = state.routes;
    const index = state.index;
    currentRoute = routes[index]?.name;
  } catch (e) {
    currentRoute = '';
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'transparent' }} edges={['bottom']}>
      <LinearGradient
        colors={['#232733ee', '#232733cc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.footerWrap}
      >
        <View style={styles.footerShadow} />
        <View style={styles.footer}>
          {tabs.map((tab, idx) => {
            const isActive = currentRoute === tab.name;
            return (
              <Animated.View key={tab.name} style={{ alignItems: 'center', flex: 1 }}>
                <TouchableOpacity
                  style={[
                    styles.footerButton,
                    (pressed === tab.name || isActive) && styles.footerButtonPressed,
                  ]}
                  activeOpacity={0.7}
                  onPressIn={() => setPressed(tab.name)}
                  onPressOut={() => setPressed(null)}
                  onPress={() => navigation.navigate(tab.name)}
                >
                  <MaterialCommunityIcons
                    name={tab.icon}
                    size={28}
                    color={isActive ? accent : inactive}
                    style={isActive ? { transform: [{ scale: 1.15 }] } : {}}
                  />
                  <Text
                    style={[
                      styles.footerText,
                      isActive && { color: accent, fontWeight: 'bold', fontSize: 13 },
                    ]}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    zIndex: 100,
    pointerEvents: 'box-none',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 32, 40, 0.7)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  footerShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 22,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    zIndex: 2,
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    minWidth: 60,
    borderRadius: 16,
    transition: 'all 0.2s',
  },
  footerButtonPressed: {
    backgroundColor: 'rgba(255, 214, 0, 0.08)',
    transform: [{ scale: 1.08 }],
  },
  footerText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
