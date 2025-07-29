import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const { mode, setMode, theme } = useTheme();
    const darkTheme = mode === 'dark';

    const handleThemeToggle = (value) => {
        setMode(value ? 'dark' : 'light');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.headerModern}>
                <MaterialCommunityIcons name="cog" size={32} color={theme.icon} style={{ marginRight: 10 }} />
                <Text style={[styles.headerTitleModern, { color: theme.temp }]}>Settings</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContentModern} showsVerticalScrollIndicator={false}>
                {/* Notifications */}
                <View style={styles.sectionModern}>
                    <Text style={[styles.sectionTitleModern, { color: theme.temp }]}>Notifications</Text>
                    <View style={styles.settingRowModern}>
                        <MaterialCommunityIcons name="bell-ring-outline" size={24} color={theme.icon} style={{ marginRight: 12 }} />
                        <Text style={styles.settingLabelModern}>Weather Notifications</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            thumbColor={notificationsEnabled ? '#FFD600' : '#888'}
                            trackColor={{ true: '#FFD60055', false: '#444' }}
                            style={{ marginLeft: 'auto' }}
                        />
                    </View>
                </View>
                {/* Theme */}
                <View style={styles.sectionModern}>
                    <Text style={[styles.sectionTitleModern, { color: theme.temp }]}>Appearance</Text>
                    <View style={styles.settingRowModern}>
                        <MaterialCommunityIcons name="theme-light-dark" size={24} color={theme.icon} style={{ marginRight: 12 }} />
                        <Text style={styles.settingLabelModern}>Dark Theme</Text>
                        <Switch
                            value={darkTheme}
                            onValueChange={handleThemeToggle}
                            thumbColor={darkTheme ? theme.accent : '#888'}
                            trackColor={{ true: theme.accent + '55', false: '#444' }}
                            style={{ marginLeft: 'auto' }}
                        />
                    </View>
                </View>
                {/* About Section (App Info) */}
                <View style={styles.appInfoSectionModern}>
                    <Text style={[styles.appInfoTitle, { color: theme.text }]}>SkyCast Weather</Text>
                    <Text style={[styles.appInfoVersion, { color: theme.secondaryText }]}>Version 1.0.0</Text>
                    <Text style={[styles.appInfoCopyright, { color: theme.secondaryText }]}>© 2024 SkyCast</Text>
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
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
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
    centeredInfoSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2749',
    },
    headerModern: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    headerTitleModern: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD600',
        letterSpacing: 0.5,
    },
    scrollContentModern: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    sectionModern: {
        marginBottom: 32,
        backgroundColor: 'transparent',
        borderRadius: 16,
        padding: 18,
        // No shadow
    },
    sectionTitleModern: {
        color: '#FFD600',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        letterSpacing: 0.2,
    },
    settingRowModern: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 6,
    },
    settingLabelModern: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    appInfoSectionModern: {
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
});