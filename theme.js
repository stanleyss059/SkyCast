// theme.js
import React, { createContext, useState, useContext } from 'react';

const themes = {
    dark: {
        background: '#16213E', // deep blue background
        card: '#1A237E', // dark blue card
        text: '#fff', // white text for dark mode
        accent: '#FFD600', // yellow accent (sun)
        secondaryText: '#7EC6F5', // blue for secondary text
        gradient: ['#0F2027', '#2C5364', '#16213E'], // deep blue gradient
        inputBg: 'rgba(35, 41, 70, 0.18)',
        icon: '#fff', // white icons in dark mode
        temp: '#FFD600', // yellow for temperature in dark mode
    },
    light: {
        background: '#B3D8F8', // light blue background
        card: '#fff',
        text: '#1A2A3A', // dark blue for text
        accent: '#FFD600', // yellow accent (sun)
        secondaryText: '#4A90E2', // blue for secondary text
        gradient: ['#7EC6F5', '#4A90E2', '#B3D8F8'], // blue gradient
        inputBg: 'rgba(255,255,255,0.2)',
        icon: '#fff', // white icons in light mode
        temp: '#1A237E', // deep blue for temperature in light mode
    },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState('dark');
    const value = {
        theme: themes[mode],
        mode,
        setMode,
    };
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
} 