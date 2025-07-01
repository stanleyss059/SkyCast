import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Footer from '../Components/footer.js';

// ✅ Define conditions and icon function here
const Conditions = ['Sunny', 'Rainy', 'Cloudy', 'Snowy'];

const ConIcon = (condition) => {
  switch (condition) {
    case 'Sunny':
      return <MaterialCommunityIcons name="weather-sunny" size={60} color="orange" />;
    case 'Rainy':
      return <MaterialCommunityIcons name="weather-rainy" size={60} color="blue" />;
    case 'Cloudy':
      return <MaterialCommunityIcons name="weather-cloudy" size={60} color="gray" />;
    case 'Snowy':
      return <MaterialCommunityIcons name="weather-snowy" size={60} color="skyblue" />;
    default:
      return <MaterialCommunityIcons name="weather-partly-cloudy" size={60} color="white" />;
  }
};

const Today = ({ navigation }) => {
  const Location = 'Kumasi';
  const currentCondition = Conditions[0]; // You can replace this with dynamic data

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

        {/* Weather Info */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content1}>
            <Text style={styles.contentText}>{Location}</Text>
            <View style={styles.LocTem}>
              {ConIcon(currentCondition)}
              <Text style={styles.contentText2}>21°C</Text>
            </View>
            <Text style={{ color: 'white', fontSize: 24, textAlign: 'center' }}>{currentCondition}</Text>
          </View>

          <View style={styles.content2}>
            {[
              ['Weather Details', ''],
              ['High Temperature', '21°C'],
              ['Low Temperature', '21°C'],
              ['Humidity', '65%'],
              ['Wind Speed', '10 km/h'],
              ['Condition', currentCondition],
              ['RealFeel', '22°C'],
              ['UV Index', 'N/A'],
            ].map(([label, value], index) => (
              <View key={index} style={styles.contentView}>
                <Text style={styles.contentText}>{label}</Text>
                {value ? <Text style={styles.contentText}>{value}</Text> : null}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <Footer navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Today;

// --- Styles ---
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
    height: '30%',
    width: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  content2: {
    height: '60%',
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
    borderBottomColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
  },
  LocTem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
