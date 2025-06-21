import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '@/types';

const THEME_KEY = 'theme_preference';

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#F97316',
    secondary: '#3B82F6',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#FB923C',
    secondary: '#60A5FA',
    accent: '#34D399',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setSystemTheme: () => void;
  themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [theme, setTheme] = useState<Theme>(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [systemColorScheme, themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        const mode = savedTheme as 'light' | 'dark' | 'system';
        setThemeMode(mode);
        
        if (mode === 'light') {
          setTheme(lightTheme);
        } else if (mode === 'dark') {
          setTheme(darkTheme);
        } else {
          setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
        }
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const saveThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = theme.isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    setTheme(newMode === 'dark' ? darkTheme : lightTheme);
    saveThemePreference(newMode);
  };

  const setSystemTheme = () => {
    setThemeMode('system');
    setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    saveThemePreference('system');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSystemTheme, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};