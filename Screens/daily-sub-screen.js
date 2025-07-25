import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LocationContext } from '../context/LocationContext';
import RainEffect from '../Components/RainEffect';
import { useTheme } from '../theme';
import { WeatherDataContext } from '../WeatherDataContext';

const WEATHERBIT_API_KEY = 'd49b871a655b4cdc80ab23d6985a07bb';

const theme = {
    background: '#181C23',
    text: '#fff',
    accent: '#FFD600',
    card: '#232733',
    border: '#232733',
    secondaryText: '#B0B0B0',
};

const { width, height } = Dimensions.get('window');

export default function DailySubScreen({ route }) {
    const { allMonths, loading, error, cityName, setCityName, changeCity } = React.useContext(WeatherDataContext);
    const { day, month, year } = route.params;
    const { theme } = useTheme();

    // Find the real day from allMonths
    const realDayFromAllMonths = (() => {
        if (!allMonths || !day) return null;
        for (const monthObj of allMonths) {
            const found = monthObj.days.find(d => d.valid_date === day.valid_date);
            if (found) return found;
        }
        return null;
    })();
    const realDay = realDayFromAllMonths || day;

    if (loading) {
        return (
            <LinearGradient
                colors={theme.gradient}
                style={{ flex: 1 }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <StatusBar barStyle={theme.text === '#fff' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
                <View style={styles.loadingContainerBox}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={theme.accent} />
                        <Text style={{ color: theme.text, marginTop: 10, fontSize: 18 }}>Loading weather...</Text>
                    </View>
                </View>
            </LinearGradient>
        );
    }
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={theme.background} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 18 }}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Use realDay for display
    const realFeel = realDay.temp + 2;
    const pressure = realDay.pres || 1000 + Math.round(Math.random() * 20);
    const humidity = realDay.rh || 40 + Math.round(Math.random() * 60);
    const maxTemp = realDay.max_temp || realDay.temp + Math.round(Math.random() * 3);
    const minTemp = realDay.min_temp || realDay.temp - Math.round(Math.random() * 3);
    const description = realDay.weather && realDay.weather.description ? realDay.weather.description : (realDay.pop > 60 ? 'Heavy Rain' : realDay.temp > 25 ? 'Sunny' : 'Partly Cloudy');
    const iconName = realDay.icon || (realDay.weather && getWeatherIcon(realDay.weather.icon)) || 'weather-partly-cloudy';
    const rainValue = realDay.pop !== undefined ? realDay.pop : realDay.rain;
    const dayNumber = realDay.day || (realDay.valid_date ? new Date(realDay.valid_date).getDate() : '');

    // Animation for weather icon
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 4,
        }).start();
    }, []);

    // Calculate progress for temp bar
    const tempRange = maxTemp - minTemp || 1;
    const tempProgress = Math.min(Math.max((realDay.temp - minTemp) / tempRange, 0), 1);

    return (
        <LinearGradient
            colors={theme.gradient}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
            {/* Rain effect if raining for this day */}
            {(realDay.weather && realDay.weather.description && realDay.weather.description.toLowerCase().includes('rain')) ||
                (realDay.weather && realDay.weather.icon && realDay.weather.icon.startsWith('r')) ? <RainEffect /> : null}
            {/* Subtle background icon */}
            <MaterialCommunityIcons
                name={iconName}
                size={220}
                color={theme.accent + '22'}
                style={styles.bgIcon}
            />
            {/* Back Button */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color={theme.accent} />
            </TouchableOpacity>
            {/* Card */}
            <View style={styles.card}>
                <Text style={[styles.title, { color: theme.accent }]}>{month} {dayNumber}, {year}</Text>
                {/* Animated Weather Icon */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <MaterialCommunityIcons name={iconName} size={72} color={theme.accent} style={{ marginVertical: 10 }} />
                </Animated.View>
                {/* Weather Description Chip */}
                <View style={[styles.chip, { backgroundColor: theme.accent }]}><Text style={[styles.chipText, { color: theme.background }]}>{description}</Text></View>
                <Text style={[styles.temp, { color: theme.temp }]}>{realDay.temp}°</Text>
                {/* Temperature Progress Bar */}
                <View style={styles.tempBarWrap}>
                    <Text style={styles.tempBarLabel}>{minTemp}°</Text>
                    <View style={styles.tempBarBg}>
                        <View style={[styles.tempBarFill, { width: `${tempProgress * 100}%` }]} />
                    </View>
                    <Text style={styles.tempBarLabel}>{maxTemp}°</Text>
                </View>
                {/* Details */}
                <View style={styles.detailList}>
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="thermometer" size={22} color={theme.accent} style={styles.detailIcon} />
                        <Text style={styles.label}>RealFeel</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{realFeel}°</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="gauge" size={22} color={theme.accent} style={styles.detailIcon} />
                        <Text style={styles.label}>Pressure</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{pressure} hPa</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Feather name="droplet" size={22} color={theme.accent} style={styles.detailIcon} />
                        <Text style={styles.label}>Humidity</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{humidity}%</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="arrow-up-bold" size={22} color={theme.accent} style={styles.detailIcon} />
                        <Text style={styles.label}>Max Temp</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{maxTemp}°</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="arrow-down-bold" size={22} color={theme.accent} style={styles.detailIcon} />
                        <Text style={styles.label}>Min Temp</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{minTemp}°</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Feather name="cloud-rain" size={22} color={theme.accent} style={styles.detailIcon} />
                        <Text style={styles.label}>Rainfall</Text>
                        <Text style={[styles.value, { color: theme.text }]}>{rainValue}%</Text>
                    </View>
                </View>
                {/* Visual indicator for mock data */}
                {!realDay.isReal && (
                    <Text style={{ color: theme.accent, fontSize: 12, marginTop: 8 }}>*Mock Data</Text>
                )}
            </View>
        </LinearGradient>
    );
}

function getWeatherIcon(iconCode) {
    const map = {
        'c01d': 'weather-sunny',
        'c01n': 'weather-night',
        'c02d': 'weather-partly-cloudy',
        'c02n': 'weather-night-partly-cloudy',
        'c03d': 'weather-cloudy',
        'c03n': 'weather-cloudy',
        'c04d': 'weather-cloudy',
        'c04n': 'weather-cloudy',
        'r01d': 'weather-pouring',
        'r01n': 'weather-pouring',
        'r02d': 'weather-pouring',
        'r02n': 'weather-pouring',
        't01d': 'weather-lightning',
        't01n': 'weather-lightning',
        's01d': 'weather-snowy',
        's01n': 'weather-snowy',
    };
    return map[iconCode] || 'weather-partly-cloudy';
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    bgIcon: {
        position: 'absolute',
        top: height * 0.18,
        left: width / 2 - 110,
        zIndex: 0,
    },
    backBtn: {
        position: 'absolute',
        top: 44,
        left: 18,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 20,
        padding: 6,
    },
    card: {
        backgroundColor: 'transparent',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        width: '88%',
        zIndex: 2,
    },
    title: {
        color: '#FFD600',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    chip: {
        backgroundColor: '#FFD600',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 10,
    },
    chipText: {
        color: '#232733',
        fontWeight: 'bold',
        fontSize: 15,
        letterSpacing: 0.2,
    },
    temp: {
        color: '#fff',
        fontSize: 54,
        fontWeight: 'bold',
        marginVertical: 4,
        letterSpacing: -2,
    },
    tempBarWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
        justifyContent: 'center',
    },
    tempBarLabel: {
        color: '#FFD600',
        fontWeight: 'bold',
        fontSize: 15,
        width: 44,
        textAlign: 'center',
    },
    tempBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: '#393C4A',
        borderRadius: 6,
        marginHorizontal: 8,
        overflow: 'hidden',
    },
    tempBarFill: {
        height: 8,
        backgroundColor: '#FFD600',
        borderRadius: 6,
    },
    detailList: {
        width: '100%',
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 7,
        paddingHorizontal: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#393C4A',
        width: '90%',
        alignSelf: 'center',
        opacity: 0.4,
        marginVertical: 2,
    },
    detailIcon: {
        marginRight: 10,
        width: 28,
        textAlign: 'center',
    },
    label: {
        color: '#B0B0B0',
        fontSize: 16,
        width: 100,
    },
    value: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loadingContainerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingBox: {
        width: width * 0.8,
        height: 180,
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
    headerLocationText: {
        color: '#fff',
    },
}); 