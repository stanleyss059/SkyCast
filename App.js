import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import Nav from './Screens/nav.js'; // This handles all screen navigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './theme';
import { CacheProvider } from './CacheContext';
import { LocationContext } from './context/LocationContext';
import { WeatherDataProvider } from './WeatherDataContext';

export default function App() {
  const [cityName, setCityName] = useState('');
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setInitialRoute(seen === 'true' ? 'Today' : 'onBoarding');
    })();
  }, []);

  if (!initialRoute) return null; // Optionally show a splash/loading screen

  return (
    <ThemeProvider>
      <LocationContext.Provider value={{ cityName, setCityName }}>
        <WeatherDataProvider>
          <StatusBar barStyle="light-content" />
          <Nav initialRouteName={initialRoute} />
        </WeatherDataProvider>
      </LocationContext.Provider>
    </ThemeProvider>
  );
}
