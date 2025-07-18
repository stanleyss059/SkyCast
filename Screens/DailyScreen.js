import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { BarChart } from 'react-native-chart-kit';

const APIKey = '616ea8aa3059465184ec47c740648c1b';
const screenWidth = Dimensions.get('window').width;

const Daily = ({ navigation }) => {
  const [forecast, setForecast] = useState([]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchForecastData = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCityName('Location Access Denied');
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const loc = address[0];
      const resolvedName =
        loc?.city ||
        loc?.subregion ||
        loc?.region ||
        loc?.country ||
        'Unknown Location';
      setCityName(resolvedName);
      const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${APIKey}`;
      const response = await fetch(url);
      const json = await response.json();
      setForecast(json.data.slice(0, 7)); // Only next 7 days
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setCityName('Error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('News')}>
              <MaterialCommunityIcons name="newspaper" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>SkyCast</Text>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={{ color: 'white', marginTop: 16 }}>Loading daily forecast...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // Prepare chart data for 7 days
  const labels = forecast.map(day => {
    const d = new Date(day.datetime);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  });
  const highTemps = forecast.map(day => day.max_temp);
  const lowTemps = forecast.map(day => day.min_temp);
  const precipitation = forecast.map(day => day.pop); // probability of precipitation

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('News')}>
            <MaterialCommunityIcons name="newspaper" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>SkyCast</Text>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>7-Day Forecast - {cityName}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollContent}>
            <View style={styles.barRow}>
              {forecast.map((day, idx) => {
                const isToday = idx === 0;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.barContainer,
                      isToday && styles.activeBarContainer,
                    ]}
                  >
                    {/* Date label at top */}
                    <Text style={styles.dateLabel}>{labels[idx]}</Text>
                    {/* Cloud icon above bar, opacity based on cloudiness */}
                    <MaterialCommunityIcons
                      name="weather-cloudy"
                      size={34}
                      color={`rgba(120, 180, 255, ${0.3 + 0.7 * (day.clouds / 100)})`}
                      style={{ marginBottom: 8 }}
                    />
                    {/* Max temp at top */}
                    <Text style={styles.maxTempText}>{Math.round(day.max_temp)}°</Text>
                    {/* Bar with gradient and shadow */}
                    <View style={styles.barWrapperMedium}>
                      <View
                        style={[
                          styles.tempBarMedium,
                          {
                            height: (day.max_temp - day.min_temp) * 7,
                            shadowColor: '#4faaff',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 6,
                            elevation: 6,
                            backgroundColor: 'linear-gradient(180deg, #4faaff 60%, #b0c4de 100%)',
                          },
                        ]}
                      />
                    </View>
                    {/* Min temp at bottom */}
                    <Text style={styles.minTempText}>{Math.round(day.min_temp)}°</Text>
                    {/* Precipitation below */}
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                      <Text style={styles.precipText}>{day.pop}%</Text>
                      <MaterialCommunityIcons name="weather-rainy" size={22} color="#4faaff" style={{ marginTop: 2 }} />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  safeContainer: { flex: 1, zIndex: 2 },
  header: {
    height: 60,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  headerButton: { padding: 8 },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    width: 54,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  activeBarContainer: {
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#FFD700',
    shadowOpacity: 0.25,
    elevation: 8,
  },
  barWrapperMedium: {
    backgroundColor: 'rgba(224,231,239,0.7)',
    borderRadius: 16,
    width: 28,
    height: 260,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(79,170,255,0.15)',
  },
  tempBarMedium: {
    borderRadius: 16,
    width: 28,
    position: 'absolute',
    bottom: 0,
    // backgroundColor is set inline for gradient
  },
  dateLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  maxTempText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  minTempText: {
    color: '#b0c4de',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  precipText: {
    color: '#4faaff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    marginBottom: 64, // Add more space below the graph
  },
  chartScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 320, // Increase height of the graph area
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
});

export default Daily;
