import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';


// ✅ Icon function - updated to match WeatherAPI conditions
const ConIcon = (condition) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return <MaterialCommunityIcons name="weather-sunny" size={60} color="orange" />;
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <MaterialCommunityIcons name="weather-rainy" size={60} color="blue" />;
  } else if (conditionLower.includes('cloud')) {
    return <MaterialCommunityIcons name="weather-cloudy" size={60} color="gray" />;
  } else if (conditionLower.includes('snow')) {
    return <MaterialCommunityIcons name="weather-snowy" size={60} color="skyblue" />;
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return <MaterialCommunityIcons name="weather-fog" size={60} color="lightgray" />;
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <MaterialCommunityIcons name="weather-lightning" size={60} color="purple" />;
  } else {
    return <MaterialCommunityIcons name="weather-partly-cloudy" size={60} color="white" />;
  }
};

const Today = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_KEY = '682c9107a385424fa92143615251807';
  const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

  const getLocationAndFetchWeather = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Cannot access location. Please enable location services to get weather data.');
        setLoading(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      const weatherUrl = `${BASE_URL}?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`;
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', 'Failed to fetch weather data. Please try again.');
    } finally {
      if (!isRefresh) setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getLocationAndFetchWeather(true);
  }, []);

  useEffect(() => {
    getLocationAndFetchWeather();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.loadingContainer}>
          <Text style={{ color: 'white', fontSize: 18 }}>Loading weather data...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!weatherData) {
    return (
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.loadingContainer}>
          <Text style={{ color: 'white', fontSize: 18 }}>Could not load weather data.</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={getLocationAndFetchWeather}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Extract relevant fields
  const { location, current } = weatherData;
  const iconUrl = current?.condition?.icon ? (current.condition.icon.startsWith('//') ? 'https:' + current.condition.icon : current.condition.icon) : null;

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('News')}>
            <MaterialCommunityIcons name="newspaper" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>SkyCast</Text>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FFD700"]}
              progressBackgroundColor="#57617e"
              tintColor="#FFD700"
            />
          }
        >
          {/* Location Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>{location?.name}, {location?.region}, {location?.country}</Text>
            <Text style={styles.timeText}>Local Time: {location?.localtime}</Text>
          </View>

          {/* Main Weather Card */}
          <View style={[styles.card, styles.centeredCard]}>
            {iconUrl && (
              <ImageBackground
                source={{ uri: iconUrl }}
                style={styles.weatherIcon}
                imageStyle={{ resizeMode: 'contain' }}
              />
            )}
            <Text style={styles.tempText}>{current?.temp_c}°C</Text>
            <Text style={styles.conditionText}>{current?.condition?.text}</Text>
            <Text style={styles.feelsLikeText}>Feels like: {current?.feelslike_c}°C</Text>
          </View>

          {/* Weather Details Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Humidity:</Text><Text style={styles.detailValue}>{current?.humidity}%</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Cloud Cover:</Text><Text style={styles.detailValue}>{current?.cloud}%</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Wind:</Text><Text style={styles.detailValue}>{current?.wind_kph} km/h ({current?.wind_degree}°)</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Precipitation:</Text><Text style={styles.detailValue}>{current?.precip_in} in</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Is Day:</Text><Text style={styles.detailValue}>{current?.is_day ? 'Yes' : 'No'}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Last Updated:</Text><Text style={styles.detailValue}>{current?.last_updated}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Timezone:</Text><Text style={styles.detailValue}>{location?.tz_id}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Latitude:</Text><Text style={styles.detailValue}>{location?.lat}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Longitude:</Text><Text style={styles.detailValue}>{location?.lon}</Text></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Today;

// ✅ Styles
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
  content1: {
    height: '35%',
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
  },
  content2: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  contentText2: {
    color: 'white',
    fontSize: 48,
    fontWeight: '500',
    textAlign: 'center',
    paddingLeft: 20,
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
  },
  LocTem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  centeredCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  locationText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  timeText: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  tempText: {
    color: 'white',
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  conditionText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  feelsLikeText: {
    color: '#b0b0b0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 4,
  },
  detailLabel: {
    color: '#b0b0b0',
    fontSize: 15,
  },
  detailValue: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});