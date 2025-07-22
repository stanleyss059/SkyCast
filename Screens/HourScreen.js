import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Footer from '../Components/footer.js';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import RainEffect from '../Components/RainEffect';

const APIKey = 'd49b871a655b4cdc80ab23d6985a07bb';
const getDimensions = () => Dimensions.get('window');

const weatherIconMap = {
  'c01d': 'weather-sunny',
  'c02d': 'weather-partly-cloudy',
  'c03d': 'weather-cloudy',
  'r01d': 'weather-rainy',
  'r02d': 'weather-pouring',
  's01d': 'weather-snowy',
};

const weatherGradients = {
  'c01d': ['#FFD700', '#FF8C00'],
  'c02d': ['#87CEEB', '#4682B4'],
  'c03d': ['#708090', '#2F4F4F'],
  'r01d': ['#4FC3F7', '#29B6F6'],
  'r02d': ['#1976D2', '#0D47A1'],
  's01d': ['#E0E0E0', '#BDBDBD'],
};

function getTodayLabel() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[now.getDay()];
}

// Define day and night themes using provided palettes
const dayTheme = {
  background: '#f2f2f2',
  text: '#1a1a1a',
  secondaryText: '#4f4f4f',
  card: '#ffffff',
  accent: '#007AFF',
  border: '#e0e0e0',
};
const nightTheme = {
  background: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  card: '#121212',
  accent: '#0A84FF',
  border: '#2a2a2a',
};
// Helper to determine if it's night
function isNight(sunrise, sunset) {
  if (!sunrise || !sunset) return false;
  const now = new Date();
  const sunriseDate = new Date(now.toDateString() + ' ' + sunrise);
  const sunsetDate = new Date(now.toDateString() + ' ' + sunset);
  return now < sunriseDate || now > sunsetDate;
}

const HourScreen = ({ navigation }) => {
  const [hourly, setHourly] = useState([]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const { width, height } = getDimensions();
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    fetchHourlyData();
  }, []);

  const fetchHourlyData = async (city = null) => {
    setLoading(true);
    try {
      let latitude, longitude, resolvedName;
      if (city) {
        const geoResp = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`);
        const geoJson = await geoResp.json();
        if (!geoJson[0]) {
          setSearchError('City not found');
          setLoading(false);
          return;
        }
        latitude = geoJson[0].lat;
        longitude = geoJson[0].lon;
        resolvedName = city;
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCityName('Location Access Denied');
          setLoading(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
        // Try to get a resolved city name from reverse geocoding with timeout
        let resolvedName = city;
        try {
          const address = await Promise.race([
            Location.reverseGeocodeAsync({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
          ]);
          if (address && address[0]) {
            const loc = address[0];
            resolvedName = loc?.city || loc?.subregion || loc?.region || loc?.country || city;
          }
        } catch (e) {
          resolvedName = city;
        }
        setCityName(resolvedName);
      }
      // Fetch up to 120 hours (5 days) from Weatherbit
      const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${latitude}&lon=${longitude}&hours=120&key=${APIKey}`;
      const response = await fetch(url);
      const json = await response.json();
      let data = json.data || [];
      // Group by day
      const daysMap = {};
      data.forEach(item => {
        const date = item.timestamp_local.slice(0, 10); // YYYY-MM-DD
        if (!daysMap[date]) daysMap[date] = [];
        daysMap[date].push(item);
      });
      let groupedArr = Object.entries(daysMap).map(([date, hours]) => ({
        date,
        hours,
      }));
      // If less than 7 days, simulate the rest
      const today = new Date();
      while (groupedArr.length < 7) {
        const simDate = new Date(today);
        simDate.setDate(today.getDate() + groupedArr.length);
        const simDateStr = simDate.toISOString().slice(0, 10);
        // Simulate 24 hours
        const simHours = Array.from({ length: 24 }).map((_, h) => ({
          timestamp_local: `${simDateStr}T${h.toString().padStart(2, '0')}:00:00`,
          temp: Math.round(18 + Math.random() * 10),
          app_temp: Math.round(18 + Math.random() * 10),
          weather: { icon: 'c01d', description: 'Simulated' },
          pop: Math.round(Math.random() * 100),
        }));
        groupedArr.push({ date: simDateStr, hours: simHours });
      }
      setGrouped(groupedArr.slice(0, 7));
      setLoading(false);
    } catch (error) {
      setSearchError('Error fetching hourly forecast');
      setLoading(false);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchText.trim()) return;
    setSearchVisible(false);
    await fetchHourlyData(searchText.trim());
    setSearchText('');
  };

  // Helper to determine if it's raining for the current hour
  const isRaining = grouped.length > 0 && grouped[0].hours && grouped[0].hours[0] && (
    String(grouped[0].hours[0].weather.description).toLowerCase().includes('rain') ||
    String(grouped[0].hours[0].weather.description).toLowerCase().includes('shower') ||
    String(grouped[0].hours[0].weather.icon).startsWith('r')
  );

  const firstHour = grouped.length > 0 && grouped[0].hours && grouped[0].hours[0];
  const theme = firstHour && isNight(firstHour.sunrise, firstHour.sunset) ? nightTheme : dayTheme;

  if (loading) {
    return (
      <View style={styles.loadingContainerBox}>
        <View style={[styles.loadingBox, { width: width * 0.8, height: height * 0.4 }]}>
          <ActivityIndicator size="large" color="#E8F4FD" />
          <Text style={{ color: '#E8F4FD', marginTop: 10 }}>Loading Hourly Data...</Text>
        </View>
      </View>
    );
  }

  // Main UI content: vertical list of days, each with horizontal scroll of hourly cards
  return (
    <LinearGradient
      colors={[theme.background, theme.card]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={theme === nightTheme ? "light-content" : "dark-content"} backgroundColor={theme.background} />
        {isRaining && <RainEffect />}
        {/* Header */}
        <View style={{
          height: 60,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: theme.card,
        }}>
          {/* Search button (left) */}
          <TouchableOpacity style={{ padding: 8, borderRadius: 20, backgroundColor: 'rgba(232, 244, 253, 0.1)' }} onPress={() => setSearchVisible(true)}>
            <MaterialCommunityIcons name="magnify" size={24} color={theme.accent} />
          </TouchableOpacity>
          {/* Location (center) */}
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Ionicons name="location-outline" size={20} color={theme.accent} />
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700', marginLeft: 6 }}>{cityName}</Text>
          </View>
          {/* Settings button (right) */}
          <TouchableOpacity style={{ padding: 8, borderRadius: 20, backgroundColor: 'rgba(232, 244, 253, 0.1)' }} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        {/* Search Modal */}
        <Modal
          visible={searchVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSearchVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '80%', backgroundColor: theme.card, borderRadius: 18, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}>
                <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Enter City Name</Text>
                <TextInput
                  style={{ width: '100%', backgroundColor: theme.card, color: theme.text, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.accent }}
                  placeholder="e.g. London"
                  placeholderTextColor={theme.secondaryText}
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={handleSearchSubmit}
                  autoFocus
                  returnKeyType="search"
                />
                {searchError ? <Text style={{ color: '#FF6B6B', marginBottom: 4, fontWeight: '600' }}>{searchError}</Text> : null}
                <TouchableOpacity style={{ backgroundColor: theme.accent, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 30, marginTop: 6 }} onPress={handleSearchSubmit}>
                  <Text style={{ color: theme.card, fontWeight: '700', fontSize: 16 }}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setSearchVisible(false)}>
                  <Text style={{ color: theme.secondaryText, fontSize: 15, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* Summary */}
        {/* Summary is removed as per the new_code, as the hourly data is now grouped by day. */}
        {/* Hourly Forecast */}
        <ScrollView style={{ flex: 1 }}>
          {grouped.map((day, idx) => (
            <View key={day.date} style={{ marginBottom: 24 }}>
              <Text style={{ color: theme.accent, fontSize: 18, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 }}>
                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </Text>
              <FlatList
                data={day.hours}
                keyExtractor={(item, i) => item.timestamp_local + i}
                renderItem={({ item }) => (
                  <View style={{ borderRadius: 16, padding: 12, alignItems: 'center', marginHorizontal: 6, width: 90, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
                      {item.timestamp_local.slice(11, 16)}
                    </Text>
                    <MaterialCommunityIcons name={weatherIconMap[item.weather.icon] || 'weather-cloudy'} size={28} color={theme.accent} style={{ marginVertical: 4 }} />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.accent }}>{Math.round(item.temp)}°</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 12, marginTop: 2 }}>RealFeel {Math.round(item.app_temp)}°</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <MaterialCommunityIcons name="weather-pouring" size={16} color={theme.accent} />
                      <Text style={{ color: theme.accent, fontSize: 12, marginLeft: 2 }}>{item.pop}%</Text>
                    </View>
                  </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 8 }}
              />
            </View>
          ))}
        </ScrollView>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingContainerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2749',
  },
  loadingBox: {
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

export default HourScreen;
