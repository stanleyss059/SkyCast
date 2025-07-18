import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const FOOTER_HEIGHT = 90;
const WEATHERBIT_KEY = '616ea8aa3059465184ec47c740648c1b';

const LAYERS = {
  Temperature: `https://maps.weatherbit.io/v2.0/singleband/temp2m/latest/{z}/{x}/{y}.png?key=${WEATHERBIT_KEY}`,
  Precipitation: `https://maps.weatherbit.io/v2.0/singleband/catprecipdbz/latest/{z}/{x}/{y}.png?key=${WEATHERBIT_KEY}`,
  Wind: `https://maps.weatherbit.io/v2.0/singleband/wind10m/latest/{z}/{x}/{y}.png?key=${WEATHERBIT_KEY}`,
  Clouds: `https://maps.weatherbit.io/v2.0/singleband/fullsat/latest/{z}/{x}/{y}.png?key=${WEATHERBIT_KEY}`,
};

const WeatherHeatMap = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [layer, setLayer] = useState('Temperature');

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

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading Weather Heat Map...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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

      <View style={styles.layerSelector}>
        {Object.keys(LAYERS).map((key) => (
          <TouchableOpacity key={key} onPress={() => setLayer(key)} style={styles.layerButton}>
            <Text style={[styles.layerText, layer === key && styles.selectedLayer]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width,
  },
  loader: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerSelector: {
    position: 'absolute',
    bottom: FOOTER_HEIGHT + 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 8,
  },
  layerButton: {
    marginHorizontal: 6,
  },
  layerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedLayer: {
    textDecorationLine: 'underline',
    color: '#FFD700',
  },
});

export default WeatherHeatMap;
