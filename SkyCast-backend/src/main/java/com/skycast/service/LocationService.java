package com.skycast.service;

import com.skycast.model.LocationData;

public interface LocationService {
    LocationData geocodeLocation(String city);

    LocationData reverseGeocode(Double lat, Double lon);
}