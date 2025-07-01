import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Settings from './Screens/SettingsScreen.js';
import News from './Screens/NewsScreen.js';
import HourScreen from './Screens/HourScreen.js';
import Today from './Screens/Today.js';
import Footer from './Components/footer.js';
import Daily from './Screens/DailyScreen.js';
import Maps from './Screens/MapsScreen.js';

const Stack = createNativeStackNavigator();

const nav = ()  => {
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Today" component={Today} />
        <Stack.Screen name="Hourly" component={HourScreen} />
        <Stack.Screen name="Daily" component={Daily} />
        <Stack.Screen name="Maps" component={Maps} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="News" component={News} />
      </Stack.Navigator>
    </NavigationContainer>
}

export default nav;