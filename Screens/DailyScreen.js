import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView, ImageBackground
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../Components/Footer';

export default function DailyScreen({ navigation }) {
  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.container}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('News')}>
            <MaterialCommunityIcons name="newspaper" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>SkyCast</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>Daily Forecast</Text>
          </View>
        </ScrollView>

        <Footer navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  safeContainer: { flex: 1, zIndex: 2 },
  header: {
    height: 60, borderBottomWidth: 1, borderBottomColor: 'white',
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16,
  },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  scrollContent: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20
  },
  content: { width: '100%', alignItems: 'center' },
  contentBox: {
    width: '100%', height: 200, backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    marginBottom: 20
  },
  contentText: {
    color: 'white', fontSize: 18, fontWeight: '500', textAlign: 'center'
  }
});
