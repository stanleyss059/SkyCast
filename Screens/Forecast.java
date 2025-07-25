package com.whether.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "forecasts")
public class Forecast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "forecast_date")
    private LocalDate forecastDate;
    @Column(name = "min_temperature")
    private Double minTemperature;
    @Column(name = "max_temperature")
    private Double maxTemperature;
    @Column(name = "weather_condition")
    private String weatherCondition;
    private String description;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "high_temperature")
    private Double highTemperature;

    @Column(name = "low_temperature")
    private Double lowTemperature;

    private Integer humidity;

    @Column(name = "wind_speed")
    private Double windSpeed;

    private String condition;

    @Column(name = "real_feel")
    private Double realFeel;

    @Column(name = "uv_index")
    private String uvIndex;
} 