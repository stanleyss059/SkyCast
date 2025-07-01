import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  StatusBar,
} from 'react-native';
import Footer from '../Components/footer'; // Adjust if needed

const Maps = ({ navigation }) => (
  <ImageBackground
    source={require('../assets/background.jpg')}
    style={styles.container}
    resizeMode="cover"
  >
    <StatusBar barStyle="light-content" />
    <View style={styles.overlay} />
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.contentText}>Weather Maps</Text>
          {/* Insert your weather map component or image here */}
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


export default Maps;
