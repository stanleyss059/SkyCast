import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#282534',
  white: '#FFFFFF',
  accent: '#FFD700',
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Today');
    }
  };

  const handleSkip = () => {
    navigation.replace('Today');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        contentContainerStyle={styles.flatListContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, currentIndex === i && styles.activeDot]}
          />
        ))}
      </View>
      {/* Controls */}
      <View style={styles.controlsContainer}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 60 }} />}
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
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
  paginationContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 18,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  skipText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  nextButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
    // No shadow or elevation for transparent button
  },
  nextText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default OnBoardingScreen;