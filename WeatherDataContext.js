import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

const WEATHERBIT_API_KEY = 'd49b871a655b4cdc80ab23d6985a07bb';

export const WeatherDataContext = createContext();

export function WeatherDataProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coords, setCoords] = useState(null);
    const [cityName, setCityName] = useState('');
    const [weather, setWeather] = useState(null);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [allMonths, setAllMonths] = useState([]);

    const fetchAllWeatherData = useCallback(async (lat, lon, city) => {
        setLoading(true);
        setError(null);
        try {
            // Current weather
            const currentRes = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`);
            const currentJson = await currentRes.json();
            setWeather(currentJson.data[0]);
            // Daily forecast (180 days)
            let allData = [];
            let startDate = new Date();
            for (let i = 0; i < 12; i++) {
                const fetchDays = Math.min(15, 180 - allData.length);
                if (fetchDays <= 0) break;
                const startStr = startDate.toISOString().slice(0, 10);
                const res = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=${fetchDays}&start_date=${startStr}&key=${WEATHERBIT_API_KEY}`);
                const json = await res.json();
                if (json.data && Array.isArray(json.data)) {
                    allData = allData.concat(json.data);
                }
                startDate.setDate(startDate.getDate() + fetchDays);
            }
            setDailyForecast(allData);
            setAllMonths(generate6MonthCalendar(allData));
            // Hourly forecast (120 hours)
            const hourlyRes = await fetch(`https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&hours=120&key=${WEATHERBIT_API_KEY}`);
            const hourlyJson = await hourlyRes.json();
            setHourlyForecast(hourlyJson.data);
        } catch (e) {
            setError('Failed to fetch weather data');
        }
        setLoading(false);
    }, []);

    // Get current location and fetch data on mount
    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setCityName('Location Off');
                    setError('Location permission not granted');
                    setLoading(false);
                    return;
                }
                let loc = await Location.getCurrentPositionAsync({});
                setCoords(loc.coords);
                let geocode = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
                if (geocode && geocode[0] && geocode[0].city) {
                    setCityName(geocode[0].city);
                } else {
                    setCityName('Unknown');
                }
                await fetchAllWeatherData(loc.coords.latitude, loc.coords.longitude, geocode[0]?.city || '');
            } catch (e) {
                setError('Failed to get location or weather');
            }
            setLoading(false);
        })();
    }, [fetchAllWeatherData]);

    // Allow manual refresh
    const refresh = useCallback(async () => {
        if (coords) {
            await fetchAllWeatherData(coords.latitude, coords.longitude, cityName);
        }
    }, [coords, cityName, fetchAllWeatherData]);

    // Allow city change
    const changeCity = useCallback(async (newCity) => {
        setLoading(true);
        setError(null);
        try {
            let geo = await Location.geocodeAsync(newCity);
            if (geo && geo[0]) {
                setCoords({ latitude: geo[0].latitude, longitude: geo[0].longitude });
                setCityName(newCity);
                await fetchAllWeatherData(geo[0].latitude, geo[0].longitude, newCity);
            }
        } catch (e) {
            setError('Failed to fetch weather for city');
        }
        setLoading(false);
    }, [fetchAllWeatherData]);

    function generate6MonthCalendar(realData) {
        const now = new Date();
        const months = [];
        let realIdx = 0;
        for (let m = 0; m < 6; m++) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() + m, 1);
            const monthName = monthDate.toLocaleString('default', { month: 'long' });
            const year = monthDate.getFullYear();
            const daysInMonth = new Date(year, monthDate.getMonth() + 1, 0).getDate();
            let startDay = 1;
            if (m === 0) startDay = now.getDate();
            const days = [];
            for (let d = startDay; d <= daysInMonth; d++) {
                if (realIdx < realData.length) {
                    const real = realData[realIdx++];
                    days.push({ ...real, isReal: true });
                } else {
                    break;
                }
            }
            months.push({ name: monthName, year, days });
        }
        return months;
    }

    return (
        <WeatherDataContext.Provider value={{
            loading,
            error,
            coords,
            cityName,
            setCityName,
            weather,
            dailyForecast,
            hourlyForecast,
            allMonths,
            refresh,
            changeCity,
        }}>
            {children}
        </WeatherDataContext.Provider>
    );
} 