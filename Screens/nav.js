import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Settings from '../Screens/SettingsScreen.js';
import News from '../Screens/NewsScreen.js';
import HourScreen from '../Screens/HourScreen.js';
import Today from '../Screens/Today.js';
import Daily from '../Screens/DailyScreen.js';
import Maps from '../Screens/MapsScreen.js';
import OnBoardingScreen from '../Screens/OnBoardingScreen.js';

const Stack = createNativeStackNavigator();

const Nav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
      <Stack.Screen name="onBoarding" component={OnBoardingScreen} />
        <Stack.Screen name="Today" component={Today} />
        <Stack.Screen name="Hourly" component={HourScreen} />
        <Stack.Screen name="Daily" component={Daily} />
        <Stack.Screen name="Maps" component={Maps} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="News" component={News} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
