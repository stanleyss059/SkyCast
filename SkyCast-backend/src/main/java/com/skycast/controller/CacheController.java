package com.skycast.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/cache")
@CrossOrigin(origins = "*")
public class CacheController {

    @Autowired
    private CacheManager cacheManager;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            cacheManager.getCacheNames().forEach(name -> {
                stats.put(name, "Cache exists");
            });
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting cache stats: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearAllCaches() {
        try {
            cacheManager.getCacheNames().forEach(name -> {
                cacheManager.getCache(name).clear();
            });
            log.info("All caches cleared");
            return ResponseEntity.ok("All caches cleared successfully");
        } catch (Exception e) {
            log.error("Error clearing caches: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/clear/{cacheName}")
    public ResponseEntity<String> clearCache(@PathVariable String cacheName) {
        try {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
                log.info("Cache '{}' cleared", cacheName);
                return ResponseEntity.ok("Cache '" + cacheName + "' cleared successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error clearing cache '{}': {}", cacheName, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}