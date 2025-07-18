import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import Footer from '../Components/footer.js';

const Conditions = ['Sunny', 'Rainy', 'Cloudy', 'Snowy'];

const ConIcon = (condition) => {
  switch (condition) {
    case 'Sunny':
      return <MaterialCommunityIcons name="weather-sunny" size={80} color="#FFD700" />;
    case 'Rainy':
      return <MaterialCommunityIcons name="weather-rainy" size={80} color="#40BFFF" />;
    case 'Cloudy':
      return <MaterialCommunityIcons name="weather-cloudy" size={80} color="#AAB2BD" />;
    case 'Snowy':
      return <MaterialCommunityIcons name="weather-snowy" size={80} color="#B3E5FC" />;
    default:
      return <MaterialCommunityIcons name="weather-partly-cloudy" size={80} color="#E8F4FD" />;
  }
};

const now = new Date();
const currday = now.getDay();
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const upcomingDays = [];
for (let i = 0; i < 7; i++) {
  const dayIndex = (currday + i) % 7;
  upcomingDays.push(days[dayIndex]);
}

const Today = ({ navigation }) => {
  const location = 'Kumasi';
  const currentCondition = Conditions[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2749" />
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('News')}>
            <MaterialCommunityIcons name="newspaper" size={24} color="#E8F4FD" />
          </TouchableOpacity>
          <Text style={styles.title}>SkyCast</Text>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color="#E8F4FD" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mainWeatherCard}>
            <Text style={styles.locationText}>{location}</Text>
            <View style={styles.weatherIconContainer}>
              {ConIcon(currentCondition)}
              <Text style={styles.temperatureText}>21°</Text>
            </View>
            <Text style={styles.conditionText}>{currentCondition}</Text>
            <Text style={styles.feelsLikeText}>Feels like 22°</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <MaterialCommunityIcons name="thermometer-high" size={28} color="#FF6B6B" />
              <Text style={styles.detailLabel}>High</Text>
              <Text style={styles.detailValue}>21°C</Text>
            </View>
            <View style={styles.detailCard}>
              <MaterialCommunityIcons name="thermometer-low" size={28} color="#4ECDC4" />
              <Text style={styles.detailLabel}>Low</Text>
              <Text style={styles.detailValue}>21°C</Text>
            </View>
            <View style={styles.detailCard}>
              <MaterialCommunityIcons name="water-percent" size={28} color="#45B7D1" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>65%</Text>
            </View>
            <View style={styles.detailCard}>
              <Feather name="wind" size={28} color="#96CEB4" />
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>10 km/h</Text>
            </View>
          </View>

          <View style={styles.additionalInfoContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <MaterialCommunityIcons name="thermometer" size={24} color="#FFD93D" />
                <Text style={styles.infoLabel}>RealFeel</Text>
              </View>
              <Text style={styles.infoValue}>22°C</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <MaterialCommunityIcons name="gauge" size={24} color="#A8E6CF" />
                <Text style={styles.infoLabel}>Pressure</Text>
              </View>
              <Text style={styles.infoValue}>1020 hPa</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <MaterialCommunityIcons name="white-balance-sunny" size={24} color="#FFB347" />
                <Text style={styles.infoLabel}>UV Index</Text>
              </View>
              <Text style={styles.infoValue}>10</Text>
              <Text style={styles.uvWarning}>Very High</Text>
            </View>
          </View>

         
        </ScrollView>

        <Footer navigation={navigation} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2749',
  },
  safeContainer: {
    flex: 1,
  },
  header: {
    height: 60,
    borderBottomColor: 'rgba(232, 244, 253, 0.15)',
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(30, 39, 73, 0.9)',
  },
  headerButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(232, 244, 253, 0.1)',
  },
  title: {
    color: '#E8F4FD',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  mainWeatherCard: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    color: '#E8F4FD',
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 16,
  },
  weatherIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  temperatureText: {
    color: '#E8F4FD',
    fontSize: 64,
    fontWeight: '300',
    marginLeft: 16,
  },
  conditionText: {
    color: '#E8F4FD',
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 8,
  },
  feelsLikeText: {
    color: '#E8F4FD',
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.7,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  detailCard: {
    width: '48%',
    backgroundColor: 'rgba(232, 244, 253, 0.08)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 244, 253, 0.12)',
  },
  detailLabel: {
    color: '#E8F4FD',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.8,
  },
  detailValue: {
    color: '#E8F4FD',
    fontSize: 18,
    fontWeight: '600',
  },
  additionalInfoContainer: {
    width: '100%',
  },
  infoCard: {
    backgroundColor: 'rgba(232, 244, 253, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 244, 253, 0.12)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    color: '#E8F4FD',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    opacity: 0.9,
  },
  infoValue: {
    color: '#E8F4FD',
    fontSize: 18,
    fontWeight: '600',
  },
  uvWarning: {
    color: '#FFB347',
    fontSize: 12,
    fontWeight: '500',
    position: 'absolute',
    right: 20,
    bottom: 8,
  },
});

export default Today;
