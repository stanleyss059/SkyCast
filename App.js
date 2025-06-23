import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Settings from './Screens/SettingsScreen';
import News from './Screens/NewsScreen';

const Stack = createNativeStackNavigator();

const Conditions = ['Sunny', 'Rainy', 'Cloudy', 'Snowy'];
const ConIcon = ( condition) => {
  switch (condition) {
    case 'Sunny':
      return <MaterialCommunityIcons name="weather-sunny" size={60} color="orange" />;
    case 'Rainy':
      return <MaterialCommunityIcons name="weather-rainy" size={60} color="blue" />;
    case 'Cloudy':
      return <MaterialCommunityIcons name="weather-cloudy" size={60} color="gray" />;
    case 'Snowy':
      return <MaterialCommunityIcons name="weather-snowy" size={60} color="skyblue" />;
    default:
      return null;
  }
}

const Today = ({ navigation }) => {
  const Location = 'Kumasi';

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('News')}>
            <MaterialCommunityIcons name="newspaper" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>SkyCast</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content1}>
            <View style={styles.Loc}>
              <Text style={styles.contentText}>{Location}</Text>
            </View>
            <View style={styles.LocTem}>
              {ConIcon(Conditions[3])}
              <Text style={styles.contentText2}>21°C</Text>
            </View>
            <View>
              <Text style={{ color: 'white', fontSize: 24, textAlign: 'center' }}>
                  {Conditions[3]}
              </Text>

            </View>
            
          </View>

          <View style={styles.content2}>
            {[
              ['Weather Details', ''],
              ['High Temperature', '21°C'],
              ['Low Temperature', '21°C'],
              ['Humidity', '65%'],
              ['Wind Speed', '10 km/h'],
              ['Condition', 'Sunny'],
              ['RealFeel', '22°C'],
              ['UV Index', 'N/A'],
            ].map(([label, value], index) => (
              <View key={index} style={styles.contentView}>
                <Text style={styles.contentText}>{label}</Text>
                {value ? <Text style={styles.contentText}>{value}</Text> : null}
              </View>
            ))}
          </View>
        </ScrollView>
        

        <Footer navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};


const getCurrentHour24 = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  return `${hours}:00`;
};


const Hourly = ({ navigation }) => {
  const Location = 'Accra';

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('News')}>
            <MaterialCommunityIcons name="newspaper" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>SkyCast</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.Hourlycontent}>
            
              <Text style={styles.contentText}>
                {getCurrentHour24()}
              </Text>
              <MaterialCommunityIcons name="water" size={20} color="white" />
          </View>
        </ScrollView>

        <Footer navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const Daily = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('News')}>
            <MaterialCommunityIcons name="newspaper" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>SkyCast</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.content1}>
              <Text style={styles.contentText}>Daily Forecast</Text>
            </View>
          </View>
        </ScrollView>

        <Footer navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const Maps = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeContainer}>
        

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.content1}>
              <Text style={styles.contentText}>Weather Maps</Text>
            </View>
          </View>
        </ScrollView>

        <Footer navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const Footer = ({ navigation }) => {
  if (!navigation) return null;

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Today')}>
        <MaterialCommunityIcons name="calendar-today" size={25} color="white" />
        <Text style={styles.footerText}>Today</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Hourly')}>
        <MaterialCommunityIcons name="clock-outline" size={25} color="white" />
        <Text style={styles.footerText}>Hourly</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Daily')}>
        <MaterialCommunityIcons name="calendar-outline" size={25} color="white" />
        <Text style={styles.footerText}>Daily</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Maps')}>
        <MaterialCommunityIcons name="map" size={25} color="white" />
        <Text style={styles.footerText}>Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Today} name="Today" />
        <Stack.Screen component={Hourly} name="Hourly" />
        <Stack.Screen component={Daily} name="Daily" />
        <Stack.Screen component={Maps} name="Maps" />
        <Stack.Screen component={Settings} name="Settings" />
        <Stack.Screen component={News} name="News" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
  contentText2:{
    color: 'white',
    fontSize: 48,
    fontWeight: '500',
    textAlign: 'center',
    paddingLeft: 20,
  },
  footer: {
    backgroundColor: 'rgba(87, 97, 126, 0.9)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    minWidth: 60,
  },
  footerText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  content1: {
    height: '30%',
    width: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  content2: {
    height: '60%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 20,
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
  },
  LocTem:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
