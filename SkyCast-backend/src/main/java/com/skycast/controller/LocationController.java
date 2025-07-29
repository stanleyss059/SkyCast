package com.skycast.controller;

import com.skycast.model.LocationData;
import com.skycast.service.LocationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/geocode")
    public ResponseEntity<LocationData> geocodeLocation(@RequestParam String city) {
        try {
            LocationData location = locationService.geocodeLocation(city);
            if (location != null) {
                return ResponseEntity.ok(location);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error geocoding location: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/reverse")
    public ResponseEntity<LocationData> reverseGeocode(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        try {
            LocationData location = locationService.reverseGeocode(lat, lon);
            if (location != null) {
                return ResponseEntity.ok(location);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error reverse geocoding: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}