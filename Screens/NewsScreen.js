import React from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define days
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Color theme
const colors = {
  primary: '#1E2749',
  secondary: 'rgba(30, 39, 73, 0.9)',
  accent: '#B0C4DE',
  white: '#E8F4FD',
  lightGray: '#B0C4DE',
  cardBackground: 'rgba(232, 244, 253, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

// Get ordered days starting from today
function getDaysStartingFromToday() {
  const todayIndex = new Date().getDay();
  return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
}

// Create 24 hours
let Hours = [];
for (let i = 0; i < 24; i++) {
  Hours.push(i.toString().padStart(2, '0') + ':00');
}

// Get current hour index
const currentHourIndex = new Date().getHours();

// Sample weather data for each hour
const generateHourlyData = () => {
  const weatherIcons = ['weather-sunny', 'weather-partly-cloudy', 'weather-cloudy', 'weather-rainy'];
  const temperatures = [
    { high: '89°C', low: '70°C' },
    { high: '85°C', low: '79°C' },
    { high: '82°C', low: '72°C' },
    { high: '78°C', low: '69°C' },
    { high: '75°C', low: '65°C' },
    { high: '80°C', low: '75°C' },
    { high: '83°C', low: '77°C' },
  ];

  return Hours.map((hour, index) => ({
    id: (index + 1).toString(),
    hour: hour,
    weather_icon: weatherIcons[index % weatherIcons.length],
    High_temperature: temperatures[index % temperatures.length].high,
    Low_temperature: temperatures[index % temperatures.length].low,
    text: 'RealFeel',
    raindrop_icon: 'water',
    rain_percent: `${Math.floor(Math.random() * 100)}%`,
  }));
};

const slide = generateHourlyData();

// Days data
const orderedDays = getDaysStartingFromToday();
const slide3 = orderedDays.map((day, index) => ({
  id: (index + 1).toString(),
  day,
}));

export default function NewsScreen() {
  return (
    <>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {(Array.isArray(slide3) ? slide3 : []).map((dayItem, dayIndex) => {
              const isToday = dayIndex === 0;
              const filteredSlide = isToday
                ? slide.slice(currentHourIndex) // show from current hour for today
                : slide; // full slide for other days

              return (
                <View key={dayItem.id} style={styles.dayBlock}>
                  <Text style={styles.dayTitle}>{dayItem.day}</Text>
                  {(Array.isArray(filteredSlide) ? filteredSlide : []).map((hourItem) => (
                    <View key={hourItem.id} style={styles.card}>
                      <Text style={styles.textWhite}>{hourItem.hour}</Text>
                      <MaterialCommunityIcons
                        name={hourItem.weather_icon}
                        size={24}
                        color={colors.accent}
                      />
                      <Text style={styles.textWhite}>{hourItem.High_temperature}</Text>

                      <View style={styles.row}>
                        <Text style={styles.textSecondary}>{hourItem.text}</Text>
                        <Text style={styles.textWhite}>{hourItem.Low_temperature}</Text>
                      </View>

                      <View style={styles.row}>
                        <MaterialCommunityIcons
                          name={hourItem.raindrop_icon}
                          size={20}
                          color={colors.accent}
                        />
                        <Text style={styles.textWhite}>{hourItem.rain_percent}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  scrollContainer: {
    padding: 15,
  },
  dayBlock: {
    marginBottom: 25,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 244, 253, 0.12)',
  },
  textWhite: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textSecondary: {
    color: colors.lightGray,
    fontSize: 12,
    opacity: 0.9,
    marginRight: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});