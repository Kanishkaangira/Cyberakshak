import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeBottomNav from './HomeBottomNav';
import AuthStack from './AuthStack';
import ChatbotScreen from '../Screens/ChatbotScreen';
import FraudEducationScreen from '../Screens/FraudEducationScreen';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { REQUIRE_AUTH } from '../config/secrets';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function Stacknavigation() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Restore initial session from AsyncStorage
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setLoading(false);
    }).catch((e) => {
      console.warn('[Navigation] Session restore warning:', e);
      setLoading(false);
    });

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  const showAuth = REQUIRE_AUTH && !session;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {showAuth ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
