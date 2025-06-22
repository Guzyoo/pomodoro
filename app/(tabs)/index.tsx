import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Timer } from '@/components/Timer';
import { useTheme } from '@/components/ThemeProvider';
import { getLast7DaysSessions, getTodaySession} from '@/utils/storage';
import { PomodoroSession } from '@/types';

export default function HomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [todayStats, setTodayStats] = useState<PomodoroSession| null>(null);
  useEffect(() => {
    const loadData = async () => {
      const sessions = await getLast7DaysSessions();
      const today = await getTodaySession();
      setTodayStats(today);
      console.log("Today:", today);
    };
    loadData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
    },
  });

  return (
    <View style={styles.container}>
      <Timer />
    </View>
  );
}