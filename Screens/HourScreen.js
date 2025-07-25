import * as Location from 'expo-location';
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../Components/footer.js';
import { LocationContext } from '../context/LocationContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { WeatherDataContext } from '../WeatherDataContext';

const { width, height } = Dimensions.get('window');

const WEATHERBIT_API_KEY = 'd49b871a655b4cdc80ab23d6985a07bb';

export default function HourScreen({ navigation }) {
  const {
    hourlyForecast,
    loading,
    error,
    cityName,
    setCityName,
    changeCity,
  } = React.useContext(WeatherDataContext);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { theme } = useTheme();

  // Search submit handler
  const handleSearchSubmit = async () => {
    if (searchText.trim()) {
      await changeCity(searchText.trim());
      setSearchMode(false);
      setSearchText('');
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={theme.gradient}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <StatusBar barStyle={theme.text === '#fff' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <View style={styles.loadingContainerBox}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={{ color: theme.text, marginTop: 10, fontSize: 18 }}>Loading weather...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 18 }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Group hourly data by day
  const days = [];
  let currentDay = null;
  let currentDayData = [];
  (Array.isArray(hourlyForecast) ? hourlyForecast : []).forEach((item, idx) => {
    const date = new Date(item.timestamp_local);
    const dayLabel = date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    if (!currentDay || currentDay !== dayLabel) {
      if (currentDayData.length > 0) {
        days.push({ label: currentDay, hours: currentDayData });
      }
      currentDay = dayLabel;
      currentDayData = [];
    }
    currentDayData.push({
      hour: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      temp: item.temp,
      rain: item.pop,
      icon: item.weather.icon,
      isCurrentHour: idx === 0,
    });
  });
  if (currentDayData.length > 0) {
    days.push({ label: currentDay, hours: currentDayData });
  }

  // Fallback UI if no data
  if (!Array.isArray(hourlyForecast) || hourlyForecast.length === 0) {
    return (
      <LinearGradient
        colors={theme.gradient}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
          <Text style={{ color: theme.text, fontSize: 18, textAlign: 'center' }}>
            No hourly forecast data available. Please check your internet connection or API quota.
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradient}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar barStyle={theme.text === '#fff' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        {/* Header */}
        <SafeAreaView style={styles.headerSafe} edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setSearchMode(true)}>
              <MaterialCommunityIcons name="magnify" size={24} color={theme.icon} />
            </TouchableOpacity>
            <View style={styles.headerLocation}>
              <Ionicons name="location-outline" size={20} color={theme.icon} />
              {searchMode ? (
                <>
                  <TextInput
                    style={styles.headerLocationInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Enter location"
                    placeholderTextColor="#B0B0B0"
                    onSubmitEditing={handleSearchSubmit}
                    autoFocus
                    returnKeyType="search"
                  />
                  <TouchableOpacity onPress={() => { setSearchMode(false); setSearchText(''); }}>
                    <Ionicons name="close" size={20} color={theme.icon} style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={[styles.headerLocationText, { color: '#fff' }]}>{cityName}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation && navigation.navigate && navigation.navigate('Settings')}>
              <Ionicons name="settings" size={24} color={theme.icon} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        {/* 7-Day Hourly Forecast */}
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {(Array.isArray(days) ? days : []).map((day, idx) => (
            <View key={day.label} style={[styles.monthSection, idx === 0 && styles.currentDaySection]}>
              <Text style={[styles.monthTitle, { color: theme.temp }]}>{day.label}</Text>
              <FlatList
                data={day.hours}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(hour, i) => `${hour.hour}-${i}`}
                contentContainerStyle={styles.daysRow}
                renderItem={({ item, i }) => (
                  <View style={[styles.dayCard, item.isCurrentHour && styles.currentHourCard]}>
                    <Text style={styles.dayNumber}>{item.hour}</Text>
                    <MaterialCommunityIcons name={getWeatherIcon(item.icon)} size={28} color={theme.icon} style={{ marginVertical: 4 }} />
                    <Text style={[styles.dayTemp, { color: theme.temp }]}>{Math.round(item.temp)}°</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Feather name="droplet" size={16} color={theme.icon} style={{ marginRight: 2 }} />
                      <Text style={[styles.rainText, { color: theme.icon }]}>{Math.round(item.rain)}%</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          ))}
        </ScrollView>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </LinearGradient>
  );
}

function getWeatherIcon(iconCode) {
  const map = {
    'c01d': 'weather-sunny',
    'c01n': 'weather-night',
    'c02d': 'weather-partly-cloudy',
    'c02n': 'weather-night-partly-cloudy',
    'c03d': 'weather-cloudy',
    'c03n': 'weather-cloudy',
    'c04d': 'weather-cloudy',
    'c04n': 'weather-cloudy',
    'r01d': 'weather-pouring',
    'r01n': 'weather-pouring',
    'r02d': 'weather-pouring',
    'r02n': 'weather-pouring',
    't01d': 'weather-lightning',
    't01n': 'weather-lightning',
    's01d': 'weather-snowy',
    's01n': 'weather-snowy',
  };
  return map[iconCode] || 'weather-partly-cloudy';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: Platform.OS === 'ios' ? 90 : 70 + (StatusBar.currentHeight || 0),
    borderBottomColor: '#232733',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    backgroundColor: '#232733',
    paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 24),
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(232, 244, 253, 0.1)',
  },
  headerLocation: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerLocationText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 6,
  },
  monthSection: {
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 18,
    borderRadius: 12,
    backgroundColor: 'transparent',
    padding: 12,
    // No shadow or border
  },
  monthTitle: {
    color: '#FFD600',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  dayCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 64,
  },
  dayNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayTemp: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  rainText: {
    color: '#FFD600',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
  },
  currentDaySection: {
    borderWidth: 2,
    borderColor: '#FFD600',
    backgroundColor: '#232733cc',
  },
  currentHourCard: {
    backgroundColor: '#FFD60033',
    borderColor: '#FFD600',
    borderWidth: 2,
  },
  headerLocationInput: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD600',
    minWidth: 120,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  headerSafe: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    height: Platform.OS === 'ios' ? 56 : 56,
    minHeight: 56,
  },
  loadingContainerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    width: width * 0.8,
    height: 180,
    backgroundColor: 'rgba(30, 39, 73, 0.95)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
