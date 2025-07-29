# SkyCast Backend

A Spring Boot backend service for the SkyCast weather application that handles API calls and caching for all weather data.

## Features

- **Weather API Integration**: Integrates with WeatherBit API for current weather, daily forecasts, and hourly forecasts
- **Location Services**: Geocoding and reverse geocoding using OpenStreetMap Nominatim
- **Redis Caching**: Intelligent caching with different TTL for different data types
- **RESTful API**: Clean REST endpoints for all weather and location operations
- **CORS Support**: Configured for cross-origin requests from mobile apps
- **Health Monitoring**: Built-in health checks and metrics

## API Endpoints

### Weather Endpoints
- `GET /api/weather/current?lat={lat}&lon={lon}` - Get current weather
- `GET /api/weather/daily?lat={lat}&lon={lon}&days={days}` - Get daily forecast
- `GET /api/weather/hourly?lat={lat}&lon={lon}&hours={hours}` - Get hourly forecast
- `GET /api/weather/all?lat={lat}&lon={lon}` - Get all weather data

### Location Endpoints
- `GET /api/location/geocode?city={city}` - Geocode city name to coordinates
- `GET /api/location/reverse?lat={lat}&lon={lon}` - Reverse geocode coordinates to location

### Cache Management
- `GET /api/cache/stats` - Get cache statistics
- `DELETE /api/cache/clear` - Clear all caches
- `DELETE /api/cache/clear/{cacheName}` - Clear specific cache

## Cache Configuration

- **Current Weather**: 15 minutes TTL
- **Daily Forecast**: 1 hour TTL
- **Hourly Forecast**: 30 minutes TTL
- **Location Geocode**: 24 hours TTL

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Redis server

## Setup

1. **Install Redis**:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install redis-server
   
   # macOS
   brew install redis
   
   # Windows
   # Download from https://redis.io/download
   ```

2. **Start Redis**:
   ```bash
   redis-server
   ```

3. **Set Environment Variables** (optional):
   ```bash
   export WEATHERBIT_API_KEY=your_weatherbit_api_key
   export OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Build and Run**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

## Docker Setup

1. **Build the application**:
   ```bash
   docker build -t skycast-backend .
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

## Configuration

The application uses `application.yml` for configuration. Key settings:

- **Server Port**: 8080
- **Redis Host**: localhost:6379
- **WeatherBit API**: Configured with your API key
- **Cache TTL**: Different TTL for different data types

## Health Checks

- `GET /actuator/health` - Application health
- `GET /actuator/info` - Application info
- `GET /actuator/metrics` - Application metrics
- `GET /actuator/caches` - Cache information

## Development

### Running Tests
```bash
mvn test
```

### Code Formatting
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## API Response Format

All weather endpoints return data in the following format:

```json
{
  "cityName": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "current": {
    "datetime": "2024-01-15T10:00:00",
    "temp": 15.5,
    "feels_like": 12.3,
    "humidity": 65,
    "wind_speed": 8.5,
    "weather": {
      "description": "Partly cloudy",
      "icon": "c02d",
      "code": "802"
    }
  },
  "daily": [...],
  "hourly": [...]
}
```

## Error Handling

The application includes comprehensive error handling:
- API rate limiting
- Network timeouts
- Invalid coordinates
- Missing API keys
- Cache failures

## Monitoring

The application includes:
- Request/response logging
- Cache hit/miss metrics
- API call performance monitoring
- Error tracking and alerting

## Security

- CORS configuration for mobile app access
- Input validation for coordinates and city names
- Rate limiting on API endpoints
- Secure API key handling 