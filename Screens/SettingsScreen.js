import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [expandedItems, setExpandedItems] = useState({});

  const settingsOptions = [
    {
      id: 1,
      title: 'Weather Units',
      subtitle: 'Temperature, wind speed, pressure',
      icon: 'thermometer',
      dropdownOptions: [
        { label: 'Temperature: Celsius (°C)', value: 'celsius' },
        { label: 'Temperature: Fahrenheit (°F)', value: 'fahrenheit' },
        { label: 'Wind Speed: km/h', value: 'kmh' },
        { label: 'Wind Speed: mph', value: 'mph' },
        { label: 'Pressure: hPa', value: 'hpa' },
        { label: 'Pressure: inHg', value: 'inhg' },
      ]
    },
    {
      id: 2,
      title: 'Location Services',
      subtitle: 'GPS and location preferences',
      icon: 'map-marker',
      dropdownOptions: [
        { label: 'Use Current Location', value: 'current' },
        { label: 'Manual Location Entry', value: 'manual' },
        { label: 'Saved Locations', value: 'saved' },
        { label: 'Location History', value: 'history' },
        { label: 'Privacy Settings', value: 'privacy' },
      ]
    },
    {
      id: 3,
      title: 'Notifications',
      subtitle: 'Weather alerts and updates',
      icon: 'bell',
      dropdownOptions: [
        { label: 'Severe Weather Alerts', value: 'severe' },
        { label: 'Daily Weather Summary', value: 'daily' },
        { label: 'Rain Notifications', value: 'rain' },
        { label: 'Temperature Extremes', value: 'temperature' },
        { label: 'Push Notification Sound', value: 'sound' },
        { label: 'Notification Frequency', value: 'frequency' },
      ]
    },
    {
      id: 4,
      title: 'Display Settings',
      subtitle: 'Theme and appearance',
      icon: 'palette',
      dropdownOptions: [
        { label: 'Dark Theme', value: 'dark' },
        { label: 'Light Theme', value: 'light' },
        { label: 'Auto Theme (System)', value: 'auto' },
        { label: 'Background Images', value: 'background' },
        { label: 'Icon Style', value: 'icons' },
        { label: 'Font Size', value: 'font' },
      ]
    },
    {
      id: 5,
      title: 'Data & Storage',
      subtitle: 'Cache and offline data',
      icon: 'database',
      dropdownOptions: [
        { label: 'Clear Cache', value: 'clear' },
        { label: 'Offline Data Storage', value: 'offline' },
        { label: 'Auto-sync Settings', value: 'sync' },
        { label: 'Data Usage Statistics', value: 'usage' },
        { label: 'Export Data', value: 'export' },
      ]
    },
    {
      id: 6,
      title: 'Privacy',
      subtitle: 'Data sharing and permissions',
      icon: 'shield-check',
      dropdownOptions: [
        { label: 'Location Permission', value: 'location' },
        { label: 'Data Collection Settings', value: 'collection' },
        { label: 'Analytics & Crash Reports', value: 'analytics' },
        { label: 'Third-party Integrations', value: 'integrations' },
        { label: 'Privacy Policy', value: 'policy' },
      ]
    },
    {
      id: 7,
      title: 'About',
      subtitle: 'Version info and support',
      icon: 'information',
      dropdownOptions: [
        { label: 'App Version', value: 'version' },
        { label: 'What\'s New', value: 'changelog' },
        { label: 'Help & Support', value: 'help' },
        { label: 'Contact Us', value: 'contact' },
        { label: 'Rate App', value: 'rate' },
        { label: 'Terms of Service', value: 'terms' },
      ]
    },
  ];

  const toggleDropdown = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleDropdownItemPress = (parentId, option) => {
    console.log(`Selected: ${option.label} from ${parentId}`);
    // Add your action logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your SkyCast experience</Text>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsGroup}>
          {settingsOptions.map((option, index) => (
            <View key={option.id}>
              <TouchableOpacity
                style={[
                  styles.settingItem,
                  index === settingsOptions.length - 1 && !expandedItems[option.id] && styles.lastItem
                ]}
                onPress={() => toggleDropdown(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingTitle}>{option.title}</Text>
                    <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name={expandedItems[option.id] ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </TouchableOpacity>

              {/* Dropdown Menu */}
              {expandedItems[option.id] && (
                <View style={styles.dropdownContainer}>
                  {option.dropdownOptions.map((dropdownOption, dropdownIndex) => (
                    <TouchableOpacity
                      key={dropdownOption.value}
                      style={[
                        styles.dropdownItem,
                        dropdownIndex === option.dropdownOptions.length - 1 && styles.lastDropdownItem
                      ]}
                      onPress={() => handleDropdownItemPress(option.id, dropdownOption)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.dropdownItemText}>{dropdownOption.label}</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={18}
                        color="rgba(255, 255, 255, 0.4)"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* App Info Section */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoTitle}>SkyCast Weather</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoCopyright}>© 2024 SkyCast Team</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2749',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 244, 253, 0.15)',
    backgroundColor: 'rgba(30, 39, 73, 0.9)',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E8F4FD',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(232, 244, 253, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  scrollContainer: {
    flex: 1,
  },
  settingsGroup: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: 'rgba(232, 244, 253, 0.08)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 244, 253, 0.12)',
    minHeight: 70,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(232, 244, 253, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8F4FD',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: 'rgba(232, 244, 253, 0.8)',
    fontWeight: '400',
  },
  appInfoSection: {
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E8F4FD',
    marginBottom: 5,
  },
  appInfoVersion: {
    fontSize: 16,
    color: 'rgba(232, 244, 253, 0.8)',
    marginBottom: 3,
  },
  appInfoCopyright: {
    fontSize: 14,
    color: 'rgba(232, 244, 253, 0.5)',
    fontStyle: 'italic',
  },
  dropdownContainer: {
    backgroundColor: 'rgba(232, 244, 253, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 244, 253, 0.12)',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingLeft: 75, // Indent to align with main content
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 244, 253, 0.05)',
    minHeight: 45,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: 'rgba(232, 244, 253, 0.8)',
    fontWeight: '400',
    flex: 1,
  },
});