import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Stacknavigation from './src/Navigation/Stacknavigation';
import { COLORS } from './src/constants/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.bg}
        translucent={false}
      />
      <NavigationContainer>
        <Stacknavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
