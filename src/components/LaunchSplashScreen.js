import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LaunchSplashScreen({
  color,
  surfaceColor,
  contrastColor,
  onFinish,
}) {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.88)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]);

    entrance.start();
    const finishTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, 3200);

    return () => {
      clearTimeout(finishTimer);
      entrance.stop();
      screenOpacity.stopAnimation();
    };
  }, [contentOpacity, contentScale, onFinish, screenOpacity]);

  return (
    <Animated.View
      accessibilityLabel="Cyberakshak"
      accessibilityRole="image"
      style={[
        styles.container,
        { backgroundColor: color, opacity: screenOpacity },
      ]}
    >
      <Animated.View
        style={[
          styles.logoGroup,
          {
            opacity: contentOpacity,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        <View style={[styles.logoBadge, { backgroundColor: surfaceColor }]}>
          <Icon name="shield-checkmark" size={76} color={color} />
        </View>
        <Text style={[styles.appName, { color: contrastColor }]}>
          Cyberakshak
        </Text>
        <Text style={[styles.welcomeText, { color: contrastColor }]}>
          Welcome to your digital safety companion
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 156,
    height: 156,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 10,
    shadowColor: '#11133D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.88,
    marginTop: 10,
    textAlign: 'center',
  },
});
