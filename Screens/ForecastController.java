package com.whether.demo.controller;

import com.whether.demo.service.ForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {
    @Autowired
    private ForecastService forecastService;

    @GetMapping
    public List<Map<String, Object>> getForecasts(@RequestParam String city) {
        return forecastService.getForecastsByCity(city);
    }
} 