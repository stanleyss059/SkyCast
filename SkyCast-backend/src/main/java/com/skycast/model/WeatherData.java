package com.skycast.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WeatherData {
    private String cityName;
    private Double latitude;
    private Double longitude;
    private CurrentWeather current;
    private DailyForecast[] daily;
    private HourlyForecast[] hourly;

    @Data
    public static class CurrentWeather {
        private String datetime;
        private Double temp;
        private Double feels_like;
        private Double humidity;
        private Double wind_speed;
        private WeatherDescription weather;
    }

    @Data
    public static class DailyForecast {
        private String valid_date;
        private Double temp;
        private Double max_temp;
        private Double min_temp;
        private Double pop;
        private WeatherDescription weather;
    }

    @Data
    public static class HourlyForecast {
        private String timestamp_local;
        private Double temp;
        private Double pop;
        private WeatherDescription weather;
    }

    @Data
    public static class WeatherDescription {
        private String description;
        private String icon;
        private String code;
    }
}