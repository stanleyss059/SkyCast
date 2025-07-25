package com.whether.demo.service;

import com.whether.demo.entity.Forecast;
import com.whether.demo.repository.ForecastRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class ForecastService {
    @Autowired
    private ForecastRepository forecastRepository;

    public List<Map<String, Object>> getForecastsByCity(String city) {
        List<Forecast> forecasts = forecastRepository.findByLocation_CityIgnoreCase(city);
        return forecasts.stream().map(forecast -> {
            Map<String, Object> map = new HashMap<>();
            map.put("Weather Details", "");
            map.put("High Temperature", forecast.getHighTemperature() != null ? forecast.getHighTemperature() + "°C" : null);
            map.put("Low Temperature", forecast.getLowTemperature() != null ? forecast.getLowTemperature() + "°C" : null);
            map.put("Humidity", forecast.getHumidity() != null ? forecast.getHumidity() + "%" : null);
            map.put("Wind Speed", forecast.getWindSpeed() != null ? forecast.getWindSpeed() + " km/h" : null);
            map.put("Condition", forecast.getCondition());
            map.put("RealFeel", forecast.getRealFeel() != null ? forecast.getRealFeel() + "°C" : null);
            map.put("UV Index", forecast.getUvIndex() != null ? forecast.getUvIndex() : "N/A");
            return map;
        }).collect(Collectors.toList());
    }
} 