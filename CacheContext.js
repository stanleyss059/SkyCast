import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const CacheContext = createContext();

const CACHE_KEY = 'SKYCAST_WEATHER_CACHE';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in ms

export function CacheProvider({ children }) {
    const [cache, setCache] = useState(null);
    const [lastFetch, setLastFetch] = useState(0);
    const [isOnline, setIsOnline] = useState(true);
    const [loading, setLoading] = useState(true);

    // Listen to network status
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected && state.isInternetReachable !== false);
        });
        return () => unsubscribe();
    }, []);

    // Load cache from AsyncStorage on mount
    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem(CACHE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setCache(parsed.data);
                setLastFetch(parsed.lastFetch);
            }
            setLoading(false);
        })();
    }, []);

    // Helper to update cache and persist
    const updateCache = useCallback(async (data) => {
        setCache(data);
        setLastFetch(Date.now());
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, lastFetch: Date.now() }));
    }, []);

    // Helper to fetch and update cache (should be called by screens)
    const fetchAndCache = useCallback(async (fetchFn) => {
        if (!isOnline) return cache; // If offline, use cache
        setLoading(true);
        try {
            const data = await fetchFn();
            await updateCache(data);
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            return cache; // fallback to cache on error
        }
    }, [isOnline, cache, updateCache]);

    // Helper to get data (auto-refresh if stale)
    const getData = useCallback(async (fetchFn) => {
        const now = Date.now();
        if (cache && (now - lastFetch < CACHE_TTL)) {
            return cache;
        }
        return await fetchAndCache(fetchFn);
    }, [cache, lastFetch, fetchAndCache]);

    return (
        <CacheContext.Provider value={{ cache, getData, updateCache, loading, isOnline }}>
            {children}
        </CacheContext.Provider>
    );
}

export function useCache() {
    return useContext(CacheContext);
} 