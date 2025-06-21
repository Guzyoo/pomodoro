import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';
import { usePomodoro } from '@/hooks/usePomodoro';

const TIMER_SIZE = 280;
const STROKE_WIDTH = 8;

export const Timer: React.FC = () => {
  const { theme } = useTheme();
  const { timerState, startTimer, pauseTimer, resetTimer, skipSession, formatTime } = usePomodoro();
  
  const progress = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const totalTime = timerState.isBreak ? 5 * 60 : 25 * 60;
  const currentProgress = 1 - (timerState.timeLeft / totalTime);

  React.useEffect(() => {
    progress.value = withTiming(currentProgress, { duration: 300 });
  }, [currentProgress]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    const strokeDasharray = 2 * Math.PI * (TIMER_SIZE / 2 - STROKE_WIDTH);
    const strokeDashoffset = strokeDasharray * (1 - progress.value);
    
    return {
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handleStartPause = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 });
    });
    
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    timerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 60,
    },
    timerCircle: {
      width: TIMER_SIZE,
      height: TIMER_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeText: {
      fontSize: 48,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    sessionText: {
      fontSize: 18,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    modeText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: timerState.isBreak ? theme.colors.success : theme.colors.primary,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    mainButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    secondaryButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    statsContainer: {
      position: 'absolute',
      top: 60,
      right: 20,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statsNumber: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
    },
    statsLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsNumber}>{timerState.completedPomodoros}</Text>
        <Text style={styles.statsLabel}>Today</Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius: TIMER_SIZE / 2,
                borderWidth: STROKE_WIDTH,
                borderColor: theme.colors.border,
              },
            ]}
          />
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius: TIMER_SIZE / 2,
                borderWidth: STROKE_WIDTH,
                borderColor: timerState.isBreak ? theme.colors.success : theme.colors.primary,
                transform: [{ rotate: '-90deg' }],
              },
              animatedCircleStyle,
            ]}
          />
          
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.timeText}>{formatTime(timerState.timeLeft)}</Text>
            <Text style={styles.sessionText}>Session #{timerState.currentSession}</Text>
            <Text style={styles.modeText}>
              {timerState.isBreak ? 'Break Time' : 'Focus Time'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetTimer}>
          <RotateCcw size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity onPress={handleStartPause}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.mainButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {timerState.isRunning ? (
                <Pause size={32} color="white" />
              ) : (
                <Play size={32} color="white" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.secondaryButton} onPress={skipSession}>
          <SkipForward size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};