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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../Components/footer'; // Adjust path if needed

const now = new Date();
const currday = now.getDay();
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Slide data: current day to next 6 days
const slide = [];
for (let i = 0; i < 7; i++) {
  slide.push({
    id: i + 1,
    day: days[(currday + i) % 7],
    icon: 'weather-night-partly-cloudy',
    temperature: `${20 + i}°C`,
  });
}

// ✅ Slide card component
const Slide = ({ item }) => (
  <View style={styles.example}>
    <Text style={styles.slideDay}>{item.day}</Text>
    <MaterialCommunityIcons name={item.icon} size={60} color="#B0C4DE" />
    <Text style={styles.slideTemp}>{item.temperature}</Text>
  </View>
);

const Daily = ({ navigation }) => (
  <ImageBackground
    source={require('../assets/background.jpg')}
    style={styles.container}
    resizeMode="cover"
  >
    <StatusBar barStyle="light-content" />
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.contentText}>Daily Forecast</Text>

          <FlatList
            data={slide}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Slide item={item} />}
            contentContainerStyle={styles.flatListContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        </View>
      </ScrollView>

      <Footer navigation={navigation} />
    </SafeAreaView>
  </ImageBackground>
);

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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  contentText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  flatListContainer: {
    gap: 16,
    paddingVertical: 10,
  },
  example: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    height: 180,
    width: 120,
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 8,
  },
  slideDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  slideTemp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});

export default Daily;
