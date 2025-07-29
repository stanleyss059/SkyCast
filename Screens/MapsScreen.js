import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import Footer from '../Components/footer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const FOOTER_HEIGHT = 90;
const OPENWEATHER_KEY = 'ee84c8a759c7a2d150f8e5723b1f0b06';

// ✅ Only relevant weather layers (no snow)
const LAYERS = {
  Temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Precipitation: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Clouds: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Pressure: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
  Humidity: `https://tile.openweathermap.org/map/humidity_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
};

export default function MapsScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [layer, setLayer] = useState('Temperature');
  const [tileError, setTileError] = useState(false);
  const [zoom, setZoom] = useState(6);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission not granted.');
          setLoading(false);
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        if (!coords) {
          setLocationError('Unable to retrieve location.');
          setLoading(false);
          return;
        }

        setLocation(coords);
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        });
        setLoading(false);
      } catch (e) {
        setLocationError('Error retrieving location. Check your settings.');
        setLoading(false);
      }
    })();
  }, []);

  const handleZoom = (delta) => {
    setRegion((prev) => {
      if (!prev) return prev;
      const newDelta = Math.max(0.01, prev.latitudeDelta * (delta < 0 ? 2 : 0.5));
      const updatedRegion = {
        ...prev,
        latitudeDelta: newDelta,
        longitudeDelta: newDelta,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(updatedRegion, 300);
      }
      return updatedRegion;
    });
    setZoom((z) => Math.max(1, delta < 0 ? z - 1 : z + 1));
  };

  const recenterMap = () => {
    if (location && region) {
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#232946', '#1a1a2e', '#282a36']}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FFD600" />
            <Text style={styles.loadingText}>Loading weather map...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (locationError) {
    return (
      <LinearGradient
        colors={['#232946', '#1a1a2e', '#282a36']}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <Ionicons name="location-off" size={48} color="#FF6B6B" />
            <Text style={styles.errorText}>{locationError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => window.location.reload()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (!region) {
    return (
      <LinearGradient
        colors={['#232946', '#1a1a2e', '#282a36']}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FFD600" />
            <Text style={styles.loadingText}>Initializing map...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Layer Selector */}
      <View style={styles.layerSelector}>
        <Text style={styles.layerTitle}>Weather Layer</Text>
        <View style={styles.layerButtons}>
          {Object.keys(LAYERS).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => {
                setLayer(key);
                setTileError(false);
              }}
              style={[
                styles.layerButton,
                layer === key && styles.selectedLayerButton,
              ]}
            >
              <Text
                style={[
                  styles.layerText,
                  layer === key && styles.selectedLayerText,
                ]}
              >
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        loadingEnabled
        onMapReady={() => setTileError(false)}
      >
        <UrlTile
          urlTemplate={LAYERS[layer]}
          zIndex={1}
          maximumZ={15}
          tileSize={256}
          onError={() => setTileError(true)}
        />
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            pinColor="#FFD600"
          />
        )}
      </MapView>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom(1)}>
          <Ionicons name="add" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={() => handleZoom(-1)}>
          <Ionicons name="remove" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterBtn} onPress={recenterMap}>
        <Ionicons name="locate" size={28} color="#FFD700" />
      </TouchableOpacity>

      {/* Error Banner */}
      {tileError && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning" size={20} color="#FFD700" />
          <Text style={styles.errorBannerText}>
            Weather tiles failed to load. Check your connection.
          </Text>
        </View>
      )}

      {/* Footer Navigation */}
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: 'rgba(30, 39, 73, 0.95)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#FFD600',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#1E2749',
    fontWeight: 'bold',
    fontSize: 16,
  },
  layerSelector: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  layerTitle: {
    color: '#FFD600',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  layerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  layerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedLayerButton: {
    backgroundColor: '#FFD600',
    borderColor: '#FFD600',
  },
  layerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedLayerText: {
    color: '#1E2749',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  zoomControls: {
    position: 'absolute',
    left: 16,
    bottom: FOOTER_HEIGHT + 80,
    zIndex: 20,
    flexDirection: 'column',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 12,
    padding: 4,
    elevation: 4,
  },
  zoomBtn: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recenterBtn: {
    position: 'absolute',
    bottom: FOOTER_HEIGHT + 24,
    right: 18,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 28,
    padding: 12,
    zIndex: 20,
    elevation: 4,
  },
  errorBanner: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    zIndex: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  errorBannerText: {
    color: '#FFD700',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
});
