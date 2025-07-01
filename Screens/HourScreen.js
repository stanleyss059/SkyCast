import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import * as Location from 'expo-location';

const APIKey = '616ea8aa3059465184ec47c740648c1b';

const getMonthName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const groupByMonth = (data) => {
  return data.reduce((acc, day) => {
    const month = getMonthName(day.datetime);
    if (!acc[month]) acc[month] = [];
    acc[month].push(day);
    return acc;
  }, {});
};

const HourScreen = () => {
  const [forecastByMonth, setForecastByMonth] = useState({});
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

      const grouped = groupByMonth(json.data);
      setForecastByMonth(grouped);
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
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading Weather Data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{cityName}</Text>
      <Text style={styles.subtitle}>16-Day Forecast</Text>
      <ScrollView>
        {Object.entries(forecastByMonth).map(([month, days]) => (
          <View key={month} style={styles.monthSection}>
            <Text style={styles.monthTitle}>{month}</Text>
            {days.map((day, index) => (
              <View key={index} style={styles.dayCard}>
                <Text style={styles.date}>{day.datetime}</Text>
                <Text style={styles.temp}>
                  Max: {day.max_temp}°C | Min: {day.min_temp}°C
                </Text>
                <Image
                  source={{
                    uri: `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`,
                  }}
                  style={{ width: 50, height: 50, marginTop: 8 }}
                />
                <Text>Clouds: {day.clouds}%</Text>
                <Text>Precipitation: {day.precip} mm</Text>
                <Text style={styles.description}>{day.weather.description}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: 'gray',
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  dayCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  temp: {
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 4,
  },
});

export default HourScreen;
