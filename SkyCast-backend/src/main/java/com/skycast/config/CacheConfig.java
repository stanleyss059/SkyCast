package com.skycast.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class CacheConfig {

        @Bean
        public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
                Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

                // Configure different TTL for different types of data
                cacheConfigurations.put("currentWeather",
                                RedisCacheConfiguration.defaultCacheConfig()
                                                .entryTtl(Duration.ofSeconds(900)) // 15 minutes
                                                .serializeKeysWith(
                                                                RedisSerializationContext.SerializationPair
                                                                                .fromSerializer(new StringRedisSerializer()))
                                                .serializeValuesWith(RedisSerializationContext.SerializationPair
                                                                .fromSerializer(new GenericJackson2JsonRedisSerializer())));

                cacheConfigurations.put("dailyForecast",
                                RedisCacheConfiguration.defaultCacheConfig()
                                                .entryTtl(Duration.ofSeconds(3600)) // 1 hour
                                                .serializeKeysWith(
                                                                RedisSerializationContext.SerializationPair
                                                                                .fromSerializer(new StringRedisSerializer()))
                                                .serializeValuesWith(RedisSerializationContext.SerializationPair
                                                                .fromSerializer(new GenericJackson2JsonRedisSerializer())));

                cacheConfigurations.put("hourlyForecast",
                                RedisCacheConfiguration.defaultCacheConfig()
                                                .entryTtl(Duration.ofSeconds(1800)) // 30 minutes
                                                .serializeKeysWith(
                                                                RedisSerializationContext.SerializationPair
                                                                                .fromSerializer(new StringRedisSerializer()))
                                                .serializeValuesWith(RedisSerializationContext.SerializationPair
                                                                .fromSerializer(new GenericJackson2JsonRedisSerializer())));

                cacheConfigurations.put("locationGeocode",
                                RedisCacheConfiguration.defaultCacheConfig()
                                                .entryTtl(Duration.ofSeconds(86400)) // 24 hours
                                                .serializeKeysWith(
                                                                RedisSerializationContext.SerializationPair
                                                                                .fromSerializer(new StringRedisSerializer()))
                                                .serializeValuesWith(RedisSerializationContext.SerializationPair
                                                                .fromSerializer(new GenericJackson2JsonRedisSerializer())));

                return RedisCacheManager.builder(connectionFactory)
                                .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
                                                .entryTtl(Duration.ofSeconds(1800)) // Default 30 minutes
                                                .serializeKeysWith(
                                                                RedisSerializationContext.SerializationPair
                                                                                .fromSerializer(new StringRedisSerializer()))
                                                .serializeValuesWith(RedisSerializationContext.SerializationPair
                                                                .fromSerializer(new GenericJackson2JsonRedisSerializer())))
                                .withInitialCacheConfigurations(cacheConfigurations)
                                .build();
        }
}