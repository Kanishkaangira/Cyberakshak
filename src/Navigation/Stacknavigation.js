import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeBottomNav from './HomeBottomNav';
import ChatbotScreen from '../Screens/ChatbotScreen';
import FraudEducationScreen from '../Screens/FraudEducationScreen';

const Stack = createNativeStackNavigator();

export default function Stacknavigation() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={HomeBottomNav} />
      <Stack.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="FraudEducation"
        component={FraudEducationScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
