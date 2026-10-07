import React from 'react';
import { Animated, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Stacknavigation from './src/Navigation/Stacknavigation';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function AppContent() {
  const { theme, isDark, transitionOpacity } = useTheme();
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
      <NavigationContainer theme={navigationTheme}>
        <Stacknavigation />
      </NavigationContainer>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
