// Full updated code with safe Dimensions handling and runtime fix

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../Components/footer';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import RainEffect from '../Components/RainEffect';

const now = new Date();
const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const weatherConditions = [
  { icon: 'weather-sunny', desc: 'Sunny', precipitation: 0 },
  { icon: 'weather-partly-cloudy', desc: 'Partly Cloudy', precipitation: 5 },
  { icon: 'weather-cloudy', desc: 'Cloudy', precipitation: 15 },
  { icon: 'weather-partly-rainy', desc: 'Light Rain', precipitation: 35 },
  { icon: 'weather-rainy', desc: 'Rainy', precipitation: 65 },
  { icon: 'weather-lightning-rainy', desc: 'Thunderstorms', precipitation: 85 },
  { icon: 'weather-fog', desc: 'Foggy', precipitation: 10 },
  { icon: 'weather-windy', desc: 'Windy', precipitation: 20 },
];

const getSeasonalTemp = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  let baseTemp, variation;
  if (month >= 11 || month <= 1) {
    baseTemp = 8; variation = 15;
  } else if (month >= 2 && month <= 4) {
    baseTemp = 18; variation = 12;
  } else if (month >= 5 && month <= 7) {
    baseTemp = 28; variation = 8;
  } else {
    baseTemp = 20; variation = 10;
  }
  const dailyVariation = Math.sin((day / 30) * Math.PI) * 3;
  return { baseTemp: baseTemp + dailyVariation, variation };
};

const generateDailyForecast = () => {
  const forecast = [];
  const sixMonthsLater = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
  const totalDays = Math.ceil((sixMonthsLater - now) / (1000 * 60 * 60 * 24));

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + i);
    const { baseTemp, variation } = getSeasonalTemp(currentDate);
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const high = baseTemp + Math.floor(Math.random() * variation) - Math.floor(variation / 2);
    const low = high - (5 + Math.floor(Math.random() * 8));
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[currentDate.getDay()];

    forecast.push({
      id: i + 1,
      date: currentDate,
      dayName,
      shortDay: shortDayNames[currentDate.getDay()],
      dayNumber: currentDate.getDate(),
      month: shortMonthNames[currentDate.getMonth()],
      fullMonth: monthNames[currentDate.getMonth()],
      year: currentDate.getFullYear(),
      icon: condition.icon,
      description: condition.desc,
      high: Math.round(Math.max(high, low + 3)),
      low: Math.round(low),
      precipitation: Math.round(condition.precipitation + Math.floor(Math.random() * 20)),
      humidity: Math.round(40 + Math.floor(Math.random() * 45)),
      windSpeed: Math.round(5 + Math.floor(Math.random() * 20)),
      uvIndex: Math.max(1, Math.floor(3 + Math.random() * 8)),
      sunrise: '6:' + (20 + Math.floor(Math.random() * 40)).toString().padStart(2, '0'),
      sunset: (17 + Math.floor(Math.random() * 3)) + ':' + (15 + Math.floor(Math.random() * 45)).toString().padStart(2, '0'),
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
      weekNumber: Math.ceil((i + 1) / 7)
    });
  }
  return forecast;
};

const dailyForecast = generateDailyForecast();

const groupForecastsByMonth = (forecast) => {
  const grouped = {};
  forecast.forEach(day => {
    const monthKey = `${day.year}-${day.date.getMonth()}`;
    if (!grouped[monthKey]) {
      grouped[monthKey] = {
        month: day.fullMonth,
        year: day.year,
        days: []
      };
    }
    grouped[monthKey].days.push(day);
  });
  return Object.values(grouped);
};

const monthlyGroups = groupForecastsByMonth(dailyForecast);

const APIKey = 'd49b871a655b4cdc80ab23d6985a07bb';

const Daily = ({ navigation }) => {
  const [expandedMonths, setExpandedMonths] = useState({ '0': true });
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityName, setCityName] = useState('Kumasi');
  const [searchError, setSearchError] = useState('');
  const [screenSize, setScreenSize] = useState({ width: initialWidth, height: initialHeight });
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setScreenSize({ width, height });
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    fetchForecastData();
    return () => {
      clearTimeout(timer);
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  const fetchForecastData = async (city = null) => {
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
      // Fetch up to 16 days from Weatherbit
      const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&days=16&key=${APIKey}`;
      const response = await fetch(url);
      const json = await response.json();
      let realForecast = (json.data || []).map((item, idx) => ({
        id: idx + 1,
        date: new Date(item.valid_date),
        dayName: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayNames[new Date(item.valid_date).getDay()],
        shortDay: shortDayNames[new Date(item.valid_date).getDay()],
        dayNumber: new Date(item.valid_date).getDate(),
        month: shortMonthNames[new Date(item.valid_date).getMonth()],
        fullMonth: monthNames[new Date(item.valid_date).getMonth()],
        year: new Date(item.valid_date).getFullYear(),
        icon: weatherbitToIcon(item.weather.icon),
        description: item.weather.description,
        high: Math.round(item.max_temp),
        low: Math.round(item.min_temp),
        precipitation: Math.round(item.pop),
        humidity: Math.round(item.rh),
        windSpeed: Math.round(item.wind_spd),
        uvIndex: Math.round(item.uv),
        sunrise: item.sunrise_ts ? new Date(item.sunrise_ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        sunset: item.sunset_ts ? new Date(item.sunset_ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        isWeekend: [0, 6].includes(new Date(item.valid_date).getDay()),
        weekNumber: Math.ceil((idx + 1) / 7),
        isSimulated: false,
      }));
      // Simulate the rest up to 6 months
      const now = new Date();
      const sixMonthsLater = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
      const totalDays = Math.ceil((sixMonthsLater - now) / (1000 * 60 * 60 * 24));
      let simulated = [];
      if (totalDays > realForecast.length) {
        for (let i = realForecast.length; i < totalDays; i++) {
          const currentDate = new Date(now);
          currentDate.setDate(now.getDate() + i);
          const { baseTemp, variation } = getSeasonalTemp(currentDate);
          const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
          const high = baseTemp + Math.floor(Math.random() * variation) - Math.floor(variation / 2);
          const low = high - (5 + Math.floor(Math.random() * 8));
          const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[currentDate.getDay()];
          simulated.push({
            id: i + 1,
            date: currentDate,
            dayName,
            shortDay: shortDayNames[currentDate.getDay()],
            dayNumber: currentDate.getDate(),
            month: shortMonthNames[currentDate.getMonth()],
            fullMonth: monthNames[currentDate.getMonth()],
            year: currentDate.getFullYear(),
            icon: condition.icon,
            description: condition.desc + ' (Simulated)',
            high: Math.round(Math.max(high, low + 3)),
            low: Math.round(low),
            precipitation: Math.round(condition.precipitation + Math.floor(Math.random() * 20)),
            humidity: Math.round(40 + Math.floor(Math.random() * 45)),
            windSpeed: Math.round(5 + Math.floor(Math.random() * 20)),
            uvIndex: Math.max(1, Math.floor(3 + Math.random() * 8)),
            sunrise: '6:' + (20 + Math.floor(Math.random() * 40)).toString().padStart(2, '0'),
            sunset: (17 + Math.floor(Math.random() * 3)) + ':' + (15 + Math.floor(Math.random() * 45)).toString().padStart(2, '0'),
            isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
            weekNumber: Math.ceil((i + 1) / 7),
            isSimulated: true,
          });
        }
      }
      setForecast([...realForecast, ...simulated]);
      setLoading(false);
    } catch (error) {
      setSearchError('Error fetching forecast');
      setLoading(false);
    }
  };

  const weatherbitToIcon = (iconCode) => {
    // Map Weatherbit icon codes to MaterialCommunityIcons
    const map = {
      'c01d': 'weather-sunny',
      'c02d': 'weather-partly-cloudy',
      'c03d': 'weather-cloudy',
      'r01d': 'weather-rainy',
      'r02d': 'weather-pouring',
      's01d': 'weather-snowy',
      // Add more mappings as needed
    };
    return map[iconCode] || 'weather-cloudy';
  };

  const handleSearchSubmit = async () => {
    if (!searchText.trim()) return;
    setSearchVisible(false);
    await fetchForecastData(searchText.trim());
    setSearchText('');
  };

  // Helper to build calendar grid for a month
  const buildCalendarGrid = (daysArr, year, monthIdx) => {
    // Get first day of the month (0=Sun)
    const firstDay = new Date(year, monthIdx, 1).getDay();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const grid = [];
    let week = Array(firstDay).fill(null); // Fill leading blanks
    let dayIdx = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dayObj = daysArr.find(day => day.dayNumber === d && day.month === shortMonthNames[monthIdx] && day.year === year);
      week.push(dayObj || null);
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      grid.push(week);
    }
    return grid;
  };

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
  const currentMonth = groupForecastsByMonth(forecast)[0];
  const firstDay = currentMonth && currentMonth.days && currentMonth.days[0];
  const theme = firstDay && isNight(firstDay.sunrise, firstDay.sunset) ? nightTheme : dayTheme;

  // Helper to determine if it's raining for the first day in the current month
  const isRaining = firstDay && (String(firstDay.description).toLowerCase().includes('rain') || String(firstDay.description).toLowerCase().includes('shower') || String(firstDay.icon).startsWith('r'));

  if (loading) {
    return (
      <View style={styles.loadingContainerBox}>
        <View style={{
          width: screenSize.width * 0.8,
          height: screenSize.height * 0.4,
          backgroundColor: 'rgba(30, 39, 73, 0.95)',
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}>
          <ActivityIndicator size="large" color="#E8F4FD" />
          <Text style={{ color: '#E8F4FD', marginTop: 10 }}>Loading Daily Forecast...</Text>
        </View>
      </View>
    );
  }

  // Main UI content
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
        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Overview */}
          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, marginBottom: 20 }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>6-Month Outlook</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 14, textAlign: 'center', marginBottom: 15 }}>{forecast.length} days ahead</Text>
            {/* Add more overview stats here if needed */}
          </View>
          {/* Monthly Sections */}
          {groupForecastsByMonth(forecast).map((monthData, index) => {
            // Determine if this is the current month
            const isCurrentMonth = monthData.year === now.getFullYear() && shortMonthNames.indexOf(monthData.month) === now.getMonth();
            let daysToShow = monthData.days;
            if (isCurrentMonth) {
              // Only show days from today onwards
              const todayNum = now.getDate();
              const monthIdx = shortMonthNames.indexOf(monthData.month);
              const daysInMonth = new Date(monthData.year, monthIdx + 1, 0).getDate();
              daysToShow = monthData.days.filter(d => d.dayNumber >= todayNum);
              // Fill in missing days from today to end of month
              const existingDays = daysToShow.map(d => d.dayNumber);
              for (let i = todayNum; i <= daysInMonth; i++) {
                if (!existingDays.includes(i)) {
                  const shortDay = shortDayNames[new Date(monthData.year, monthIdx, i).getDay()];
                  daysToShow.push({
                    id: `sim-${monthData.year}-${monthIdx}-${i}`,
                    dayNumber: i,
                    shortDay,
                    icon: 'weather-cloudy',
                    high: '--',
                    low: '--',
                    description: '',
                  });
                }
              }
              daysToShow.sort((a, b) => a.dayNumber - b.dayNumber);
            } else {
              const monthIdx = shortMonthNames.indexOf(monthData.month);
              const daysInMonth = new Date(monthData.year, monthIdx + 1, 0).getDate();
              daysToShow = Array.from({ length: daysInMonth }).map((_, i) => {
                let dayObj = monthData.days.find(d => d.dayNumber === i + 1);
                if (!dayObj) {
                  const shortDay = shortDayNames[new Date(monthData.year, monthIdx, i + 1).getDay()];
                  dayObj = {
                    id: `sim-${monthData.year}-${monthIdx}-${i + 1}`,
                    dayNumber: i + 1,
                    shortDay,
                    icon: 'weather-cloudy',
                    high: '--',
                    low: '--',
                    description: '',
                  };
                }
                return dayObj;
              });
            }
            return (
              <View key={`${monthData.year}-${monthData.month}`} style={{ marginBottom: 15 }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: 15, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 10 }}>
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>{monthData.month} {monthData.year}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, marginTop: 2 }}>{daysToShow.length} days</Text>
                </View>
                <FlatList
                  data={daysToShow}
                  keyExtractor={day => day.id.toString()}
                  renderItem={({ item }) => (
                    <View style={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: 8,
                      paddingVertical: 18,
                      paddingHorizontal: 12,
                      minWidth: 70,
                      width: 80,
                      shadowColor: '#000',
                      shadowOpacity: 0.08,
                      shadowRadius: 6,
                      elevation: 2,
                    }}>
                      <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>{item.dayNumber}</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 12, marginBottom: 2 }}>{item.shortDay}</Text>
                      <MaterialCommunityIcons name={item.icon} size={28} color={theme.accent} />
                      <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 15, marginTop: 2 }}>{item.high}°</Text>
                      <Text style={{ color: '#2563EB', fontSize: 13 }}>{item.low}°</Text>
                      {item.description ? <Text style={{ color: theme.text, fontSize: 11, marginTop: 2 }}>{item.description.replace(' (Simulated)', '')}</Text> : null}
                    </View>
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8 }}
                />
              </View>
            );
          })}
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
});

export default Daily;
