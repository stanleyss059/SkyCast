import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Polyline, Circle, Defs, LinearGradient, Stop, Text as SvgText, G } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const colors = {
  primary: '#282534',
  accent: '#4A90E2',
  white: '#FFFFFF',
  cardBackground: 'rgba(74, 144, 226, 0.15)',
  overlay: 'rgba(40, 37, 52, 0.7)',
  blue: '#1e3c72',
  blue2: '#2a5298',
  gold: '#FFD700',
  rain: '#4faaff',
};

// Fixed hour generation logic
const generateHours = () => {
  const hours = [];
  for (let i = 0; i < 12; i++) {
    const hour = (i + 5) % 24;
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? 'AM' : 'PM';
    hours.push(`${display} ${period}`);
  }
  return hours;
};

const Hours = generateHours();

// Replace generateHourlyData and Hours logic
function generateMockHours(startHour, count) {
  const hours = [];
  for (let i = 0; i < count; i++) {
    const hour24 = (startHour + i) % 24;
    const display = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 < 12 ? 'AM' : 'PM';
    hours.push({
      hour: `${display} ${period}`,
      hour24,
    });
  }
  return hours;
}

const weatherIcons = [
  'weather-sunny', 'weather-partly-cloudy', 'weather-cloudy', 'weather-partly-cloudy',
  'weather-cloudy', 'weather-rainy', 'weather-rainy', 'weather-partly-cloudy',
  'weather-cloudy', 'weather-night', 'weather-night', 'weather-night',
  'weather-sunny', 'weather-partly-cloudy', 'weather-cloudy', 'weather-partly-cloudy',
  'weather-cloudy', 'weather-rainy', 'weather-rainy', 'weather-partly-cloudy',
  'weather-cloudy', 'weather-night', 'weather-night', 'weather-night'
];

function generateHourlyData(startHour, count, startTemp = 82) {
  const hours = generateMockHours(startHour, count);
  return hours.map((h, i) => {
    const temp = Math.round(startTemp - i * 1.5 + Math.random() * 2 - 1);
    const realFeel = Math.round(temp + (i % 2 === 0 ? 2 : -2) + Math.random() * 2 - 1);
    return {
      id: `${h.hour24}-${i}-${Date.now()}`,
      hour: h.hour,
      weather_icon: weatherIcons[(h.hour24) % weatherIcons.length],
      temperature: temp,
      realFeel,
      rain_percent: Math.max(0, 3 + ((h.hour24 + i) % 5) * 2),
    };
  });
}

const HourScreen = () => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [lastHour, setLastHour] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const firstBatch = generateHourlyData(currentHour, 12);
      setHourlyData(firstBatch);
      setLastHour((currentHour + 11) % 24);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleShowMore = () => {
    const nextStartHour = (lastHour + 1) % 24;
    const nextBatch = generateHourlyData(nextStartHour, 12, hourlyData[hourlyData.length - 1]?.temperature || 82);
    setHourlyData([...hourlyData, ...nextBatch]);
    setLastHour((nextStartHour + 11) % 24);
    setShowAll(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading Hourly Data...</Text>
      </SafeAreaView>
    );
  }

  const displayedData = showAll ? hourlyData : hourlyData.slice(0, 12);

  // Chart dimensions and calculations
  const chartWidth = Math.max(screenWidth - 24, 600);
  const chartHeight = 260;
  const padding = 32;
  const n = hourlyData.length;
  const xStep = (chartWidth - 2 * padding) / Math.max(n - 1, 1);
  
  const allTemps = hourlyData.flatMap(h => [h.temperature, h.realFeel]);
  const yMin = Math.min(...allTemps) - 2;
  const yMax = Math.max(...allTemps) + 2;
  const yRange = Math.max(yMax - yMin, 1);
  const yScale = (chartHeight - 2 * padding) / yRange;
  
  const getX = i => padding + i * xStep;
  const getY = v => chartHeight - padding - (v - yMin) * yScale;

  // Build SVG paths
  const tempPoints = hourlyData.map((h, i) => `${getX(i)},${getY(h.temperature)}`).join(' ');
  const realFeelPoints = hourlyData.map((h, i) => `${getX(i)},${getY(h.realFeel)}`).join(' ');

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.listScroll}>
          {displayedData.map((h, idx) => (
            <View key={h.id} style={styles.listCard}>
              <Text style={styles.listHour}>{h.hour}</Text>
              <MaterialCommunityIcons 
                name={h.weather_icon} 
                size={28} 
                color="#4faaff" 
                style={styles.listIcon} 
              />
              <Text style={styles.listTemp}>{h.temperature}°</Text>
              <Text style={styles.listRealFeel}>RealFeel {h.realFeel}°</Text>
              <View style={styles.listRainRow}>
                <MaterialCommunityIcons name="weather-rainy" size={18} color="#4faaff" />
                <Text style={styles.listRainText}>{h.rain_percent}%</Text>
              </View>
            </View>
          ))}
          {!showAll && (
            <TouchableOpacity style={styles.showMoreBtn} onPress={handleShowMore}>
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  overlay: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  safeContainer: { 
    flex: 1, 
    zIndex: 2 
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  loadingText: {
    color: colors.white,
    marginTop: 12,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
    gap: 10,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 4,
  },
  toggleBtnActive: {
    backgroundColor: '#4faaff',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  toggleTextActive: {
    color: '#1e3c72',
  },
  graphScroll: {
    alignItems: 'center',
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 340,
  },
  graphCardFlat: {
    backgroundColor: 'rgba(30,60,114,0.95)',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    alignItems: 'center',
    width: '100%',
    minWidth: 600,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minWidth: 600,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 0,
  },
  hourCol: {
    alignItems: 'center',
    width: 48,
  },
  weatherIcon: {
    marginBottom: 2,
  },
  hourLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  svgChart: {
    alignSelf: 'center',
    marginTop: 0,
  },
  rainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minWidth: 600,
    marginTop: 8,
    paddingHorizontal: 0,
  },
  rainCol: {
    alignItems: 'center',
    width: 48,
  },
  rainText: {
    color: '#4faaff',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 16,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  listScroll: {
    padding: 18,
    paddingBottom: 40,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  listHour: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    width: 54,
  },
  listIcon: {
    marginHorizontal: 8,
  },
  listTemp: {
    color: '#4faaff',
    fontWeight: 'bold',
    fontSize: 18,
    width: 54,
    textAlign: 'center',
  },
  listRealFeel: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
    width: 90,
    textAlign: 'center',
  },
  listRainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 54,
    justifyContent: 'flex-end',
  },
  listRainText: {
    color: '#4faaff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 2,
  },
  showMoreBtn: {
    backgroundColor: '#4faaff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  showMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default HourScreen;