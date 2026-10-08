import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeBottomNav from './HomeBottomNav';
import AuthStack from './AuthStack';
import ChatbotScreen from '../Screens/ChatbotScreen';
import FraudEducationScreen from '../Screens/FraudEducationScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';
import ProfileSetupScreen from '../Screens/Auth/ProfileSetupScreen';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { REQUIRE_AUTH } from '../config/secrets';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';

const Stack = createNativeStackNavigator();

export default function Stacknavigation() {
  const { theme: COLORS } = useTheme();
  const styles = useThemeStyles(createStyles);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const isPasswordRecovery = useRef(false);

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
      (event, currentSession) => {
        if (event === 'PASSWORD_RECOVERY') {
          isPasswordRecovery.current = true;
          return;
        }
        if (isPasswordRecovery.current && event !== 'SIGNED_OUT') return;
        if (event === 'SIGNED_OUT') isPasswordRecovery.current = false;

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
  const requiresProfileSetup =
    !!session?.user?.user_metadata?.profile_setup_required;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {showAuth ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : requiresProfileSetup ? (
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
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
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
