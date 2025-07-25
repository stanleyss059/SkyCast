import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import Footer from '../Components/footer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const FOOTER_HEIGHT = 90;
const OPENWEATHER_KEY = 'ee84c8a759c7a2d150f8e5723b1f0b06';

const LAYERS = {
  Temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Precipitation: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Clouds: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
};

export default function MapsScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [layer, setLayer] = useState('Temperature');
  const [tileError, setTileError] = useState(false);
  const [zoom, setZoom] = useState(6);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission not granted. Enable location to view the heat map.');
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        if (!coords || coords.latitude == null || coords.longitude == null) {
          setLocationError('Could not get your location.');
          return;
        }
        setLocation(coords);
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        });
      } catch (e) {
        setLocationError('Failed to get location. Please check your device settings.');
      }
    })();
  }, []);

  // Zoom controls
  const handleZoom = (delta) => {
    if (!region) return;
    let newDelta = Math.max(0.01, region.latitudeDelta * (delta < 0 ? 2 : 0.5));
    setRegion({ ...region, latitudeDelta: newDelta, longitudeDelta: newDelta });
    if (mapRef.current) {
      mapRef.current.animateToRegion({ ...region, latitudeDelta: newDelta, longitudeDelta: newDelta }, 300);
    }
    setZoom(z => Math.max(1, delta < 0 ? z - 1 : z + 1));
  };

  // Re-center map to user location
  const recenterMap = () => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      });
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }, 1000);
      }
    }
  };

  if (locationError) {
    return (
      <LinearGradient
        colors={["#232946", "#1a1a2e", "#282a36"]}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.loadingContainerBox}>
          <View style={styles.loadingBox}>
            <Text style={{ color: 'red', marginTop: 10, fontSize: 18, textAlign: 'center' }}>{locationError}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (!region) {
    return (
      <LinearGradient
        colors={["#232946", "#1a1a2e", "#282a36"]}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.loadingContainerBox}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FFD600" />
            <Text style={{ color: '#fff', marginTop: 10, fontSize: 18 }}>Loading weather...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      {/* Layer Selector (vertical) */}
      <View style={styles.topLayerSelector}>
        {Object.keys(LAYERS).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => { setLayer(key); setTileError(false); }}
            style={[styles.layerButtonVertical, layer === key && styles.selectedLayerButton]}
          >
            <Text style={[styles.layerText, layer === key && styles.selectedLayer]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {region && (
        <MapView
          ref={mapRef}
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
          {location && location.latitude != null && location.longitude != null && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
              pinColor="red"
            />
          )}
        </MapView>
      )}
      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom(1)}>
          <Ionicons name="add" size={22} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom(-1)}>
          <Ionicons name="remove" size={22} color="#FFD700" />
        </TouchableOpacity>
      </View>
      {/* Re-center Button */}
      <TouchableOpacity style={styles.recenterBtn} onPress={recenterMap}>
        <Ionicons name="locate" size={26} color="#FFD700" />
      </TouchableOpacity>
      {tileError && (
        <View style={styles.tileErrorBanner}>
          <Text style={styles.tileErrorText}>Weather map tiles failed to load. Check your API key or network.</Text>
        </View>
      )}
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    flex: 1,
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
  topLayerSelector: {
    position: 'absolute',
    top: 70,
    left: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
    alignItems: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  layerButtonVertical: {
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'rgba(30,30,30,0.7)',
    minWidth: 120,
    alignItems: 'flex-start',
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
  zoomControls: {
    position: 'absolute',
    left: 16,
    bottom: FOOTER_HEIGHT + 80,
    zIndex: 20,
    flexDirection: 'column',
    backgroundColor: 'rgba(30,30,30,0.85)',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  zoomBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recenterBtn: {
    position: 'absolute',
    bottom: FOOTER_HEIGHT + 24,
    right: 18,
    backgroundColor: 'rgba(30,30,30,0.95)',
    borderRadius: 22,
    padding: 10,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
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
});
