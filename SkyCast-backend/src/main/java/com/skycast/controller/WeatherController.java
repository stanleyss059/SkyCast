package com.skycast.controller;

import com.skycast.model.WeatherData;
import com.skycast.service.WeatherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/current")
    public ResponseEntity<WeatherData> getCurrentWeather(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        try {
            WeatherData weather = weatherService.getCurrentWeather(lat, lon);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            log.error("Error getting current weather: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/daily")
    public ResponseEntity<WeatherData> getDailyForecast(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "16") Integer days) {
        try {
            WeatherData weather = weatherService.getDailyForecast(lat, lon, days);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            log.error("Error getting daily forecast: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/hourly")
    public ResponseEntity<WeatherData> getHourlyForecast(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "120") Integer hours) {
        try {
            WeatherData weather = weatherService.getHourlyForecast(lat, lon, hours);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            log.error("Error getting hourly forecast: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<WeatherData> getAllWeatherData(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        try {
            WeatherData weather = weatherService.getAllWeatherData(lat, lon);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            log.error("Error getting all weather data: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}