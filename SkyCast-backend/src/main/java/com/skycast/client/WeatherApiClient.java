package com.skycast.client;

import com.skycast.model.WeatherData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;

@Slf4j
@Component
public class WeatherApiClient {

    @Value("${weather.api.weatherbit.base-url}")
    private String weatherbitBaseUrl;

    @Value("${weather.api.weatherbit.key}")
    private String weatherbitApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherData getCurrentWeather(Double lat, Double lon) {
        String url = String.format("%s/current?lat=%s&lon=%s&key=%s",
                weatherbitBaseUrl, lat, lon, weatherbitApiKey);

        try {
            ResponseEntity<WeatherData> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), WeatherData.class);
            return response.getBody();
        } catch (ResourceAccessException e) {
            log.error("Network error fetching current weather: {}", e.getMessage());
            throw new RuntimeException("Network error: Unable to reach weather API", e);
        } catch (Exception e) {
            log.error("Error fetching current weather: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch current weather data", e);
        }
    }

    public WeatherData getDailyForecast(Double lat, Double lon, Integer days) {
        String url = String.format("%s/forecast/daily?lat=%s&lon=%s&days=%s&key=%s",
                weatherbitBaseUrl, lat, lon, days, weatherbitApiKey);

        try {
            ResponseEntity<WeatherData> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), WeatherData.class);
            return response.getBody();
        } catch (ResourceAccessException e) {
            log.error("Network error fetching daily forecast: {}", e.getMessage());
            throw new RuntimeException("Network error: Unable to reach weather API", e);
        } catch (Exception e) {
            log.error("Error fetching daily forecast: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch daily forecast data", e);
        }
    }

    public WeatherData getHourlyForecast(Double lat, Double lon, Integer hours) {
        String url = String.format("%s/forecast/hourly?lat=%s&lon=%s&hours=%s&key=%s",
                weatherbitBaseUrl, lat, lon, hours, weatherbitApiKey);

        try {
            ResponseEntity<WeatherData> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), WeatherData.class);
            return response.getBody();
        } catch (ResourceAccessException e) {
            log.error("Network error fetching hourly forecast: {}", e.getMessage());
            throw new RuntimeException("Network error: Unable to reach weather API", e);
        } catch (Exception e) {
            log.error("Error fetching hourly forecast: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch hourly forecast data", e);
        }
    }
}