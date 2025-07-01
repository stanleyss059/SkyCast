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
import Footer from '../Components/footer'; // Adjust path if needed

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
          {/* Add daily forecast cards/components here */}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
});


export default Daily;
