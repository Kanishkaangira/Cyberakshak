import React, { useCallback, useRef } from 'react';
import { Animated, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import Stacknavigation from './src/Navigation/Stacknavigation';
import PushNotificationManager from './src/components/PushNotificationManager';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import i18n from './src/i18n';

function AppContent() {
  const { theme, isDark, transitionOpacity } = useTheme();
  const navigationRef = useNavigationContainerRef();
  const navigationReady = useRef(false);
  const pendingEventNavigation = useRef(false);
  const openEvents = useCallback(() => {
    const mainTabsAvailable = navigationRef
      .getRootState()
      ?.routeNames.includes('MainTabs');

    if (!navigationReady.current || !mainTabsAvailable) {
      pendingEventNavigation.current = true;
      return;
    }

    pendingEventNavigation.current = false;
    navigationRef.navigate('MainTabs', { screen: 'Events' });
  }, [navigationRef]);
  const handleNavigationReady = useCallback(() => {
    navigationReady.current = true;
    if (pendingEventNavigation.current) openEvents();
  }, [openEvents]);
  const handleNavigationStateChange = useCallback(() => {
    if (pendingEventNavigation.current) openEvents();
  }, [openEvents]);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.brand,
      background: theme.bg,
      card: theme.surface,
      text: theme.ink,
      border: theme.line,
    },
  };

  return (
    <Animated.View style={[styles.root, { opacity: transitionOpacity }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
        translucent={false}
      />
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        onReady={handleNavigationReady}
        onStateChange={handleNavigationStateChange}
      >
        <Stacknavigation />
      </NavigationContainer>
      <PushNotificationManager onEventNotificationOpened={openEvents} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
