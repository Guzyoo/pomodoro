import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatsChart } from '@/components/StatsChart';
import { useTheme } from '@/components/ThemeProvider';
import { ChartData, PomodoroSession } from '@/types';
import { getLast7DaysSessions, getTodaySession } from '@/utils/storage';

export default function StatsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [todayStats, setTodayStats] = useState<PomodoroSession | null>(null);
  const [weeklyTotal, setWeeklyTotal] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const sessions = await getLast7DaysSessions();
      const today = await getTodaySession();
      
      // Create chart data for last 7 days
      const last7Days = [];
      const today_date = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today_date);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      const chartLabels = last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en', { weekday: 'short' });
      });

      const chartValues = last7Days.map(date => {
        const session = sessions.find(s => s.date === date);
        return session ? session.completedPomodoros : 0;
      });

      setChartData({
        labels: chartLabels,
        datasets: [{ data: chartValues }],
      });

      setTodayStats(today);
      setWeeklyTotal(chartValues.reduce((sum, val) => sum + val, 0));
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
    },
    scrollContainer: {
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
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 16,
      marginHorizontal: 4,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statNumber: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your Pomodoro sessions</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayStats?.completedPomodoros || 0}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{weeklyTotal}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayStats?.totalSessions || 0}</Text>
            <Text style={styles.statLabel}>Sessions Today</Text>
          </View>
        </View>

        <StatsChart 
          data={chartData} 
          title="Last 7 Days" 
        />
      </ScrollView>
    </View>
  );
}