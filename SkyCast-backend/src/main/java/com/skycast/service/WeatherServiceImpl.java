package com.skycast.service;

import com.skycast.model.WeatherData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.skycast.client.WeatherApiClient;
import org.springframework.beans.factory.annotation.Autowired;

@Slf4j
@Service
public class WeatherServiceImpl implements WeatherService {

    @Value("${weather.api.weatherbit.base-url}")
    private String weatherbitBaseUrl;

    @Value("${weather.api.weatherbit.key}")
    private String weatherbitApiKey;

    @Autowired
    private WeatherApiClient weatherApiClient;

    @Override
    @Cacheable(value = "currentWeather", key = "#lat + '_' + #lon")
    public WeatherData getCurrentWeather(Double lat, Double lon) {
        log.info("Fetching current weather for lat: {}, lon: {}", lat, lon);
        return weatherApiClient.getCurrentWeather(lat, lon);
    }

    @Override
    @Cacheable(value = "dailyForecast", key = "#lat + '_' + #lon + '_' + #days")
    public WeatherData getDailyForecast(Double lat, Double lon, Integer days) {
        log.info("Fetching daily forecast for lat: {}, lon: {}, days: {}", lat, lon, days);
        return weatherApiClient.getDailyForecast(lat, lon, days);
    }

    @Override
    @Cacheable(value = "hourlyForecast", key = "#lat + '_' + #lon + '_' + #hours")
    public WeatherData getHourlyForecast(Double lat, Double lon, Integer hours) {
        log.info("Fetching hourly forecast for lat: {}, lon: {}, hours: {}", lat, lon, hours);
        return weatherApiClient.getHourlyForecast(lat, lon, hours);
    }

    @Override
    public WeatherData getAllWeatherData(Double lat, Double lon) {
        log.info("Fetching all weather data for lat: {}, lon: {}", lat, lon);

        WeatherData weatherData = new WeatherData();
        weatherData.setLatitude(lat);
        weatherData.setLongitude(lon);

        // Get current weather
        WeatherData current = getCurrentWeather(lat, lon);
        if (current != null && current.getCurrent() != null) {
            weatherData.setCurrent(current.getCurrent());
        }

        // Get daily forecast (16 days)
        WeatherData daily = getDailyForecast(lat, lon, 16);
        if (daily != null && daily.getDaily() != null) {
            weatherData.setDaily(daily.getDaily());
        }

        // Get hourly forecast (120 hours)
        WeatherData hourly = getHourlyForecast(lat, lon, 120);
        if (hourly != null && hourly.getHourly() != null) {
            weatherData.setHourly(hourly.getHourly());
        }

        return weatherData;
    }
}