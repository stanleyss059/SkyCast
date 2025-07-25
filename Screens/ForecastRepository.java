package com.whether.demo.repository;

import com.whether.demo.entity.Forecast;
import com.whether.demo.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, Long> {
    List<Forecast> findByLocation_CityIgnoreCase(String city);
} 