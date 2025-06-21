import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from './ThemeProvider';
import { ChartData } from '@/types';

const screenWidth = Dimensions.get('window').width;

interface StatsChartProps {
  data: ChartData;
  title: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({ data, title }) => {
  const { theme } = useTheme();

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${theme.isDark ? '251, 146, 60' : '249, 115, 22'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${theme.isDark ? '148, 163, 184' : '107, 114, 128'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
    },
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    chartContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    noDataText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 40,
    },
  });

  const hasData = data.datasets[0].data.some(value => value > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        {hasData ? (
          <BarChart
            data={data}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars
            fromZero
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text style={styles.noDataText}>
            No data available for the last 7 days.{'\n'}
            Complete some Pomodoro sessions to see your progress!
          </Text>
        )}
      </View>
    </View>
  );
};