import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../constants/theme';

const THEME_KEY = 'CYBERAKSHAK_DARK_THEME';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const hasUserChangedTheme = useRef(false);
  const isDarkRef = useRef(false);
  const transitionOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(THEME_KEY)
      .then((value) => {
        if (isMounted && !hasUserChangedTheme.current) {
          const restoredIsDark = value === 'true';
          isDarkRef.current = restoredIsDark;
          setIsDark(restoredIsDark);
        }
      })
      .catch((error) => {
        console.warn('[ThemeProvider] Could not restore theme preference:', error);
      })
      .finally(() => {
        if (isMounted) setIsThemeReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = useCallback((requestedValue) => {
    Animated.timing(transitionOpacity, {
      toValue: 0.72,
      duration: 120,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      hasUserChangedTheme.current = true;
      const next =
        typeof requestedValue === 'boolean'
          ? requestedValue
          : !isDarkRef.current;
      isDarkRef.current = next;
      setIsDark(next);
      AsyncStorage.setItem(THEME_KEY, String(next)).catch((error) => {
        console.warn('[ThemeProvider] Could not save theme preference:', error);
      });
      Animated.timing(transitionOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  }, [transitionOpacity]);

  const value = useMemo(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDark,
      isThemeReady,
      toggleTheme,
      transitionOpacity,
    }),
    [isDark, isThemeReady, toggleTheme, transitionOpacity]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
