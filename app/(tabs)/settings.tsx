import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Sun, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsScreen() {
  const { theme, toggleTheme, setSystemTheme, themeMode } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
    },
    themeOptions: {
      gap: 8,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    themeOptionActive: {
      borderColor: theme.colors.primary,
    },
    themeOptionText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      marginLeft: 12,
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    infoTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

  const getThemeOptionStyle = (mode: string) => [
    styles.themeOption,
    themeMode === mode && styles.themeOptionActive,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your Pomodoro experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={getThemeOptionStyle('light')}
              onPress={() => {
                if (themeMode !== 'light') toggleTheme();
              }}
            >
              <Sun size={20} color={theme.colors.warning} />
              <Text style={styles.themeOptionText}>Light Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={getThemeOptionStyle('dark')}
              onPress={() => {
                if (themeMode !== 'dark') toggleTheme();
              }}
            >
              <Moon size={20} color={theme.colors.secondary} />
              <Text style={styles.themeOptionText}>Dark Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={getThemeOptionStyle('system')}
              onPress={setSystemTheme}
            >
              <Smartphone size={20} color={theme.colors.textSecondary} />
              <Text style={styles.themeOptionText}>System Default</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Pomodoro Technique</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              The Pomodoro Technique is a time management method that breaks work into 25-minute focused intervals followed by 5-minute breaks. This helps maintain concentration and prevents burnout.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}