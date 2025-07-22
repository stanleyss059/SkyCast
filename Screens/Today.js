import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../Components/footer.js';

const placeholderHourly = [
  { id: '1', time: '10:00', temp: 23, icon: 'weather-lightning', selected: false },
  { id: '2', time: '11:00', temp: 21, icon: 'weather-lightning', selected: true },
  { id: '3', time: '12:00', temp: 22, icon: 'weather-partly-cloudy', selected: false },
  { id: '4', time: '01:00', temp: 19, icon: 'weather-night', selected: false },
];

const theme = {
  background: '#181C23',
  text: '#fff',
  accent: '#FFD600',
  card: '#232733',
  border: '#232733',
  secondaryText: '#B0B0B0',
};

export default function Today({ navigation }) {
  const [hourly] = useState(placeholderHourly);
  const cityName = 'Minsk';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      {/* Header (from HourScreen.js) */}
      <View style={styles.header}>
        {/* Search button (left) */}
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialCommunityIcons name="magnify" size={24} color={theme.accent} />
        </TouchableOpacity>
        {/* Location (center) */}
        <View style={styles.headerLocation}>
          <Ionicons name="location-outline" size={20} color={theme.accent} />
          <Text style={styles.headerLocationText}>{cityName}</Text>
        </View>
        {/* Settings button (right) */}
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation && navigation.navigate && navigation.navigate('Settings')}>
          <Ionicons name="settings" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      {/* Updating Status */}
      <View style={styles.updatingRow}>
        <View style={styles.updatingDot} />
        <Text style={styles.updatingText}>Updating</Text>
      </View>
      {/* Main Weather Icon & Temp */}
      <View style={styles.mainWeather}>
        <MaterialCommunityIcons name="weather-lightning" size={110} color={theme.accent} style={{ marginBottom: 10 }} />
        <Text style={styles.tempText}>23°</Text>
        <Text style={styles.weatherDesc}>Thunderclouds</Text>
      </View>
      {/* Weather Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Feather name="wind" size={22} color={theme.text} />
          <Text style={styles.detailValue}>13 km/h</Text>
          <Text style={styles.detailLabel}>Wind</Text>
        </View>
        <View style={styles.detailItem}>
          <Feather name="droplet" size={22} color={theme.text} />
          <Text style={styles.detailValue}>24%</Text>
          <Text style={styles.detailLabel}>Humidity</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="weather-pouring" size={22} color={theme.text} />
          <Text style={styles.detailValue}>87%</Text>
          <Text style={styles.detailLabel}>Rain</Text>
        </View>
      </View>
      {/* Hourly Forecast */}
      <View style={styles.hourlySection}>
        <View style={styles.hourlyHeader}>
          <Text style={styles.hourlyTitle}>Today</Text>
          <Text style={styles.sevenDays}>7 days</Text>
        </View>
        <FlatList
          data={hourly}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <View style={[styles.hourCard, item.selected && styles.hourCardSelected]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={32}
                color={item.selected ? theme.accent : theme.text}
                style={{ marginBottom: 4 }}
              />
              <Text style={[styles.hourTemp, item.selected && { color: theme.accent }]}>{item.temp}°</Text>
              <Text style={[styles.hourTime, item.selected && { color: theme.accent }]}>{item.time}</Text>
            </View>
          )}
        />
      </View>
      {/* Footer (from HourScreen.js) */}
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181C23',
  },
  header: {
    height: 60,
    borderBottomColor: '#232733',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#232733',
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
    backgroundColor: '#232733',
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
    backgroundColor: '#232733',
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
    borderWidth: 2,
    borderColor: '#FFD600',
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
});
