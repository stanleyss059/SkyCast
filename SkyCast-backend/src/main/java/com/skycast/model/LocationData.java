package com.skycast.model;

import lombok.Data;

@Data
public class LocationData {
    private String city;
    private String country;
    private String state;
    private Double latitude;
    private Double longitude;
    private String timezone;
}