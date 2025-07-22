import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../Components/footer';
import RainEffect from '../Components/RainEffect';

const { width, height } = Dimensions.get('window');
const FOOTER_HEIGHT = 90;
const OPENWEATHER_KEY = 'b4ee65c70e1e3f3edbe4aef3abb2a691';

const LAYERS = {
  Temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Precipitation: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Clouds: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
};

// Define day and night themes using provided palettes
const dayTheme = {
  background: '#f2f2f2',
  text: '#1a1a1a',
  secondaryText: '#4f4f4f',
  card: '#ffffff',
  accent: '#007AFF',
  border: '#e0e0e0',
};
const nightTheme = {
  background: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  card: '#121212',
  accent: '#0A84FF',
  border: '#2a2a2a',
};
// For demo, always use night mode
const theme = nightTheme;

const WeatherHeatMap = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [layer, setLayer] = useState('Temperature');
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission Required', 'Enable location to view the heat map');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      });
    })();
  }, []);

  // For demo: always show rain effect, or add logic if weather data is available
  const isRaining = true; // Replace with real condition if you have weather data

  if (!region) {
    return (
      <View style={styles.loadingContainerBox}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#E8F4FD" />
          <Text style={{ color: '#E8F4FD', marginTop: 10 }}>Loading Weather Heat Map...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {isRaining && <RainEffect />}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={[styles.map, { height: height - FOOTER_HEIGHT }]}
        region={region}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
      >
        <UrlTile
          urlTemplate={LAYERS[layer]}
          zIndex={1}
          maximumZ={15}
          tileSize={256}
          onError={() => setTileError(true)}
        />
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="red"
        />
      </MapView>
      {tileError && (
        <View style={styles.tileErrorBanner}>
          <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#FFD700" />
          <Text style={styles.tileErrorText}>Weather map tiles failed to load. Check your API key or network.</Text>
        </View>
      )}
      <View style={styles.layerSelector}>
        {Object.keys(LAYERS).map((key) => (
          <TouchableOpacity key={key} onPress={() => { setLayer(key); setTileError(false); }} style={[styles.layerButton, layer === key && styles.selectedLayerButton]}>
            <Text style={[styles.layerText, layer === key && styles.selectedLayer]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    flex: 1,
  },
  loader: {
    flex: 1,
    backgroundColor: '#1E2749',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerSelector: {
    position: 'absolute',
    bottom: FOOTER_HEIGHT + 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(232, 244, 253, 0.08)',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  layerButton: {
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  selectedLayerButton: {
    backgroundColor: '#FFD70022',
  },
  layerText: {
    color: '#E8F4FD',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedLayer: {
    textDecorationLine: 'underline',
    color: '#FFD700',
  },
  tileErrorBanner: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30,30,30,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD70044',
    justifyContent: 'center',
  },
  tileErrorText: {
    color: '#FFD700',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2749',
  },
  loadingBox: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: 'rgba(30, 39, 73, 0.95)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default WeatherHeatMap;
