# Frontend Integration Guide

This guide explains how to integrate the SkyCast React Native frontend with the Spring Boot backend.

## Backend API Endpoints

The backend provides the following REST endpoints:

### Weather Data
- `GET /api/weather/current?lat={lat}&lon={lon}` - Current weather
- `GET /api/weather/daily?lat={lat}&lon={lon}&days={days}` - Daily forecast
- `GET /api/weather/hourly?lat={lat}&lon={lon}&hours={hours}` - Hourly forecast
- `GET /api/weather/all?lat={lat}&lon={lon}` - All weather data

### Location Services
- `GET /api/location/geocode?city={city}` - Geocode city to coordinates
- `GET /api/location/reverse?lat={lat}&lon={lon}` - Reverse geocode coordinates

### Cache Management
- `GET /api/cache/stats` - Cache statistics
- `DELETE /api/cache/clear` - Clear all caches

## Frontend Integration

### 1. Update WeatherDataContext.js

Replace the direct API calls with backend calls:

```javascript
// Replace this in WeatherDataContext.js
const WEATHERBIT_API_KEY = 'd49b871a655b4cdc80ab23d6985a07bb';

// With this
const BACKEND_BASE_URL = 'http://localhost:8080/api'; // or your backend URL

const fetchAllWeatherData = useCallback(async (lat, lon, city) => {
    setLoading(true);
    setError(null);
    try {
        // Get all weather data from backend
        const response = await fetch(`${BACKEND_BASE_URL}/weather/all?lat=${lat}&lon=${lon}`);
        const weatherData = await response.json();
        
        if (weatherData.current) {
            setWeather(weatherData.current);
        }
        if (weatherData.daily) {
            setDailyForecast(weatherData.daily);
            setAllMonths(generate6MonthCalendar(weatherData.daily));
        }
        if (weatherData.hourly) {
            setHourlyForecast(weatherData.hourly);
        }
    } catch (e) {
        setError('Failed to fetch weather data from backend');
    }
    setLoading(false);
}, []);
```

### 2. Update Location Services

```javascript
// In your location-related functions
const geocodeCity = async (cityName) => {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/location/geocode?city=${encodeURIComponent(cityName)}`);
        const locationData = await response.json();
        return locationData;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

const reverseGeocode = async (lat, lon) => {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/location/reverse?lat=${lat}&lon=${lon}`);
        const locationData = await response.json();
        return locationData;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
};
```

### 3. Environment Configuration

Create a configuration file for the backend URL:

```javascript
// config/api.js
export const API_CONFIG = {
    BACKEND_BASE_URL: __DEV__ 
        ? 'http://localhost:8080/api'  // Development
        : 'https://your-production-backend.com/api', // Production
    TIMEOUT: 10000,
};
```

### 4. Error Handling

Add proper error handling for network issues:

```javascript
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
};
```

### 5. Offline Support

Implement offline caching:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheWeatherData = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch (error) {
        console.error('Cache error:', error);
    }
};

const getCachedWeatherData = async (key, maxAge = 30 * 60 * 1000) => { // 30 minutes
    try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < maxAge) {
                return data;
            }
        }
    } catch (error) {
        console.error('Cache retrieval error:', error);
    }
    return null;
};
```

## Development Setup

### 1. Start the Backend

```bash
cd SkyCast-backend
./run.sh
```

### 2. Update Frontend Configuration

In your React Native app, update the API base URL:

```javascript
// In your API configuration
const BACKEND_URL = 'http://10.0.2.2:8080/api'; // Android emulator
// or
const BACKEND_URL = 'http://localhost:8080/api'; // iOS simulator
```

### 3. Test the Integration

```javascript
// Test endpoint
const testBackendConnection = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/weather/current?lat=40.7128&lon=-74.0060`);
        const data = await response.json();
        console.log('Backend connection successful:', data);
    } catch (error) {
        console.error('Backend connection failed:', error);
    }
};
```

## Production Deployment

### 1. Backend Deployment

Deploy the Spring Boot application to your preferred cloud platform:
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- Heroku

### 2. Update Frontend Configuration

Update the API base URL to your production backend:

```javascript
const BACKEND_URL = 'https://your-production-backend.com/api';
```

### 3. Environment Variables

Set up environment variables for different environments:

```javascript
// config/environment.js
export const ENV = {
    development: {
        BACKEND_URL: 'http://localhost:8080/api',
    },
    staging: {
        BACKEND_URL: 'https://staging-backend.com/api',
    },
    production: {
        BACKEND_URL: 'https://production-backend.com/api',
    },
};
```

## Benefits of Backend Integration

1. **Caching**: Reduced API calls and faster response times
2. **Rate Limiting**: Better API quota management
3. **Error Handling**: Centralized error handling and retry logic
4. **Monitoring**: Better observability and debugging
5. **Security**: API keys kept secure on the backend
6. **Scalability**: Easy to scale and add new features

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured correctly
2. **Network Timeouts**: Implement proper timeout handling
3. **Cache Issues**: Clear backend cache if needed
4. **API Key Issues**: Verify API keys are set correctly

### Debug Endpoints

Use these endpoints for debugging:

- `GET /api/cache/stats` - Check cache status
- `GET /actuator/health` - Check backend health
- `GET /actuator/metrics` - Check performance metrics 