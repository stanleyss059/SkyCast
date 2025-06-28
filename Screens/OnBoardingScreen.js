import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  FlatList,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#282534',
  white: '#FFFFFF',
};

const slides = [
  {
    id: '1',
    image: require('../assets/OnBoardingScreenpic -1.jpg'),
    subtitle: 'WELCOME',
    title: 'Step Into The Forecast.',
    description: 'Stay ahead of the weather with real-time updates, hyper-local forecasts, and severe weather alerts right when you need them. Designed for simplicity and speed, so you\'re never caught off guard. \n\nLet\'s get you set up in just a few taps.',
  },
  {
    id: '2',
    image: require('../assets/OnBoardingScreenpic -2.jpg'),
    subtitle: 'LOCATION ACCESS NEEDED',
    title: 'Stay Ahead Of The Storm',
    description: 'Turn on location services to get real-time forecasts, local weather alerts, and personalized updates based on your exact location. You can manage your location settings anytime in your device preferences.',
  },
  {
    id: '3',
    image: require('../assets/OnBoardingScreenpic -3.jpg'),
    subtitle: 'NOTIFICATIONS',
    title: 'Never Miss What Matters',
    description: 'Turn on notifications to get real-time updates on severe weather and breaking news in your area.',
  },
  {
    id: '4',
    image: require('../assets/OnBoardingScreenpic -4.jpg'),
    subtitle: 'ENJOY TAILORED ADS',
    title: 'Ads That Fit Your Interests',
    description: 'Let us use your data to deliver a smoother, more relevant online experience. See promotions, products and services that match your lifestyle-across the apps and websites you love.',
  },
  {
    id: '5',
    image: require('../assets/OnBoardingScreenpic -5.jpg'),
    subtitle: 'PRIVACY MATTERS',
    title: 'Be Informed. Be Protected',
    description: 'Your privacy matters to us. Review and accept our Terms of Use and Privacy Policy by tapping below, so you can enjoy a safe and seamless experience with the SKYCAST app',
  },
];

const Slide = ({ item }) => {
  return (
    <ImageBackground
      source={item.image}
      style={styles.slide}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const OnBoardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <FlatList
        data={slides}
        contentContainerStyle={styles.flatListContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  flatListContainer: {
    height: height,
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    paddingBottom: 200,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default OnBoardingScreen;