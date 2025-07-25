import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../Components/footer.js';
import * as Location from 'expo-location';
import { LocationContext } from '../context/LocationContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import RainEffect from '../Components/RainEffect';
import { useTheme } from '../theme';
import { WeatherDataContext } from '../WeatherDataContext';

const { width, height } = Dimensions.get('window');

const WEATHERBIT_API_KEY = 'd49b871a655b4cdc80ab23d6985a07bb';

export default function Today({ navigation }) {
  const {
    weather,
    dailyForecast,
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

  // Remove all useEffect and fetchWeatherData logic

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

  return (
    <LinearGradient
      colors={theme.gradient}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* Rain effect if raining */}
      {weather && (
        (weather.weather.description && weather.weather.description.toLowerCase().includes('rain')) ||
        (weather.weather.icon && weather.weather.icon.startsWith('r'))
      ) && <RainEffect />}
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
        {/* Main Weather Icon & Temp */}
        <View style={styles.mainWeather}>
          <MaterialCommunityIcons name={getWeatherIcon(weather.weather.icon)} size={110} color={theme.icon} style={{ marginBottom: 10 }} />
          <Text style={[styles.tempText, { color: theme.temp }]}>{Math.round(weather.temp)}°</Text>
          <Text style={[styles.weatherDesc, { color: theme.text }]}>{weather.weather.description}</Text>
        </View>
        {/* Weather Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Feather name="wind" size={22} color={theme.icon} />
            <Text style={[styles.detailValue, { color: theme.text }]}>{Math.round(weather.wind_spd)} km/h</Text>
            <Text style={styles.detailLabel}>Wind</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="droplet" size={22} color={theme.icon} />
            <Text style={[styles.detailValue, { color: theme.text }]}>{Math.round(weather.rh)}%</Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="weather-pouring" size={22} color={theme.icon} />
            <Text style={[styles.detailValue, { color: theme.text }]}>{Math.round(weather.precip)}%</Text>
            <Text style={styles.detailLabel}>Rain</Text>
          </View>
        </View>
        {/* 10-Day Daily Forecast */}
        <View style={styles.hourlySection}>
          <View style={styles.hourlyHeader}>
            <Text style={[styles.hourlyTitle, { color: theme.temp }]}>10 days Daily Forecast</Text>
          </View>
          <FlatList
            data={dailyForecast}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, i) => `${item.valid_date}-${i}`}
            contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
            renderItem={({ item, index }) => (
              <View style={[styles.hourCard, index === 0 && styles.hourCardSelected]}>
                <MaterialCommunityIcons
                  name={getWeatherIcon(item.weather.icon)}
                  size={32}
                  color={index === 0 ? theme.icon : theme.text}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[styles.hourTemp, index === 0 && { color: theme.icon }]}>{Math.round(item.temp)}°</Text>
                <Text style={[styles.hourTime, index === 0 && { color: theme.icon }]}>{new Date(item.valid_date).toLocaleDateString(undefined, { weekday: 'short' })}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Feather name="droplet" size={16} color={index === 0 ? theme.icon : theme.text} style={{ marginRight: 2 }} />
                  <Text style={{ color: index === 0 ? theme.icon : theme.text, fontWeight: 'bold', fontSize: 13 }}>{Math.round(item.pop)}%</Text>
                </View>
              </View>
            )}
          />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* ...main content... */}
        </ScrollView>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </LinearGradient>
  );
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
  updatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  updatingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD600',
    marginRight: 7,
  },
  updatingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  mainWeather: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  tempText: {
    color: '#fff',
    fontSize: 72,
    fontWeight: 'bold',
    letterSpacing: -2,
    marginBottom: 2,
  },
  weatherDesc: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginTop: -4,
    marginBottom: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 18,
    marginHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
  },
  detailItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  detailValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 2,
  },
  detailLabel: {
    color: '#B0B0B0',
    fontSize: 13,
    marginTop: 1,
  },
  hourlySection: {
    marginTop: 2,
  },
  hourlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 22,
    marginBottom: 8,
  },
  hourlyTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sevenDays: {
    color: '#B0B0B0',
    fontWeight: '600',
    fontSize: 15,
  },
  hourCard: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minWidth: 70,
  },
  hourCardSelected: {
    backgroundColor: '#FFD60022',
    // No border
  },
  hourTemp: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  hourTime: {
    color: '#B0B0B0',
    fontSize: 13,
    marginTop: 2,
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

function getWeatherIcon(iconCode) {
  // Weatherbit icon codes: https://www.weatherbit.io/api/codes
  // Map a few common ones, fallback to 'weather-partly-cloudy'
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
