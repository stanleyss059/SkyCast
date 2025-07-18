import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Settings from '../Screens/SettingsScreen.js';
import News from '../Screens/NewsScreen.js';
import HourScreen from '../Screens/HourScreen.js';
import Today from '../Screens/Today.js';
import Daily from '../Screens/DailyScreen.js';
import Maps from '../Screens/MapsScreen.js';
import OnBoardingScreen from '../Screens/OnBoardingScreen.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Today') iconName = 'calendar-today';
          else if (route.name === 'Hourly') iconName = 'clock-outline';
          else if (route.name === 'Daily') iconName = 'calendar-outline';
          else if (route.name === 'Maps') iconName = 'map';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#b0b0b0',
        tabBarStyle: { backgroundColor: 'rgba(87, 97, 126, 0.9)' },
      })}
    >
      <Tab.Screen name="Today" component={Today} />
      <Tab.Screen name="Hourly" component={HourScreen} />
      <Tab.Screen name="Daily" component={Daily} />
      <Tab.Screen name="Maps" component={Maps} />
    </Tab.Navigator>
  );
}

const Nav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* If you want onboarding, add it here */}
        {/* <Stack.Screen name="OnBoarding" component={OnBoardingScreen} /> */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="News" component={News} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
