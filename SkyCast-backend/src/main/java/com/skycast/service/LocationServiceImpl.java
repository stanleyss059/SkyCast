package com.skycast.service;

import com.skycast.model.LocationData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class LocationServiceImpl implements LocationService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    @Cacheable(value = "locationGeocode", key = "#city")
    public LocationData geocodeLocation(String city) {
        log.info("Geocoding location for city: {}", city);

        try {
            // Using a free geocoding service
            String url = String.format("https://nominatim.openstreetmap.org/search?q=%s&format=json&limit=1",
                    city.replace(" ", "+"));

            Object[] response = restTemplate.getForObject(url, Object[].class);

            if (response != null && response.length > 0) {
                // Parse the response and create LocationData
                // This is a simplified implementation
                LocationData locationData = new LocationData();
                locationData.setCity(city);
                // Additional parsing would be needed for full implementation
                return locationData;
            }

            log.warn("No geocoding results found for city: {}", city);
            return null;
        } catch (Exception e) {
            log.error("Error geocoding location: {}", e.getMessage());
            throw new RuntimeException("Failed to geocode location", e);
        }
    }

    @Override
    @Cacheable(value = "locationGeocode", key = "#lat + '_' + #lon")
    public LocationData reverseGeocode(Double lat, Double lon) {
        log.info("Reverse geocoding for lat: {}, lon: {}", lat, lon);

        try {
            String url = String.format("https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=json",
                    lat, lon);

            Object response = restTemplate.getForObject(url, Object.class);

            if (response != null) {
                // Parse the response and create LocationData
                // This is a simplified implementation
                LocationData locationData = new LocationData();
                locationData.setLatitude(lat);
                locationData.setLongitude(lon);
                // Additional parsing would be needed for full implementation
                return locationData;
            }

            log.warn("No reverse geocoding results found for lat: {}, lon: {}", lat, lon);
            return null;
        } catch (Exception e) {
            log.error("Error reverse geocoding: {}", e.getMessage());
            throw new RuntimeException("Failed to reverse geocode location", e);
        }
    }
}