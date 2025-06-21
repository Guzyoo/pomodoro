import AsyncStorage from '@react-native-async-storage/async-storage';
import { PomodoroSession } from '@/types';

const STORAGE_KEY = 'pomodoro_sessions';

export const getStoredSessions = async (): Promise<PomodoroSession[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
};

export const saveSession = async (session: PomodoroSession): Promise<void> => {
  try {
    const sessions = await getStoredSessions();
    const existingIndex = sessions.findIndex(s => s.date === session.date);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredSessions = sessions.filter(s => 
      new Date(s.date) >= thirtyDaysAgo
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

export const getTodaySession = async (): Promise<PomodoroSession | null> => {
  try {
    const sessions = await getStoredSessions();
    const today = new Date().toISOString().split('T')[0];
    return sessions.find(s => s.date === today) || null;
  } catch (error) {
    console.error('Failed to get today session:', error);
    return null;
  }
};

export const getLast7DaysSessions = async (): Promise<PomodoroSession[]> => {
  try {
    const sessions = await getStoredSessions();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return sessions.filter(s => 
      new Date(s.date) >= sevenDaysAgo
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Failed to get last 7 days sessions:', error);
    return [];
  }
};