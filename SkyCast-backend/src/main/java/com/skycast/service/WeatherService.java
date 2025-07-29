package com.skycast.service;

import com.skycast.model.WeatherData;

public interface WeatherService {
    WeatherData getCurrentWeather(Double lat, Double lon);

    WeatherData getDailyForecast(Double lat, Double lon, Integer days);

    WeatherData getHourlyForecast(Double lat, Double lon, Integer hours);

    WeatherData getAllWeatherData(Double lat, Double lon);
}