import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TimerState, PomodoroSession } from '@/types';
import { saveSession, getTodaySession } from '@/utils/storage';

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export const usePomodoro = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    timeLeft: POMODORO_TIME,
    isBreak: false,
    currentSession: 1,
    completedPomodoros: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTodaySession();
  }, []);

  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            handleTimerComplete(prev);
            return {
              ...prev,
              timeLeft: 0,
              isRunning: false,
              isPaused: false,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused]);

  const loadTodaySession = async () => {
    const todaySession = await getTodaySession();
    if (todaySession) {
      setTimerState(prev => ({
        ...prev,
        completedPomodoros: todaySession.completedPomodoros,
      }));
    }
  };

  const handleTimerComplete = (currentState: TimerState) => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (!currentState.isBreak) {
      // Completed a Pomodoro
      const newCompletedCount = currentState.completedPomodoros + 1;
      saveTodaySession(newCompletedCount, currentState.currentSession);
      
      setTimerState(prev => ({
        ...prev,
        completedPomodoros: newCompletedCount,
        isBreak: true,
        timeLeft: BREAK_TIME,
        currentSession: prev.currentSession + 1,
      }));
    } else {
      // Completed a break
      setTimerState(prev => ({
        ...prev,
        isBreak: false,
        timeLeft: POMODORO_TIME,
      }));
    }
  };

  const saveTodaySession = async (completedPomodoros: number, totalSessions: number) => {
    const today = new Date().toISOString().split('T')[0];
    const session: PomodoroSession = {
      id: `${today}-session`,
      date: today,
      completedPomodoros,
      totalSessions,
    };
    await saveSession(session);
  };

  const startTimer = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimerState(prev => ({ ...prev, isRunning: true, isPaused: false }));
  };

  const pauseTimer = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimerState(prev => ({ ...prev, isRunning: false, isPaused: true }));
  };

  const resetTimer = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      timeLeft: prev.isBreak ? BREAK_TIME : POMODORO_TIME,
    }));
  };

  const skipSession = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      isBreak: !prev.isBreak,
      timeLeft: prev.isBreak ? POMODORO_TIME : BREAK_TIME,
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    formatTime,
  };
};