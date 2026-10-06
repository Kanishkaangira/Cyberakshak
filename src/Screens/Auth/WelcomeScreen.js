import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';
import { AUTH_STRINGS } from '../../constants/authStrings';

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brand} />
      
      <View style={styles.topHero}>
        <View style={styles.shieldBadge}>
          <Icon name="shield-checkmark" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.brandTitle}>{AUTH_STRINGS.appName}</Text>
        <Text style={styles.brandTagline}>{AUTH_STRINGS.appTagline}</Text>
      </View>

      <ScrollView
        bounces={false}
        contentContainerStyle={[
          styles.bottomSheet,
          { paddingBottom: Math.max(insets.bottom + 20, 36) },
        ]}
      >
        <Text style={styles.welcomeTitle}>{AUTH_STRINGS.welcomeTitle}</Text>
        <Text style={styles.welcomeSubtitle}>{AUTH_STRINGS.welcomeSubtitle}</Text>

        <View style={styles.btnStack}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <Icon name="log-in-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>{AUTH_STRINGS.login}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Icon name="person-add-outline" size={19} color={COLORS.brand} />
            <Text style={styles.secondaryBtnText}>{AUTH_STRINGS.signUp}</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand,
  },
  topHero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  shieldBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 4,
  },
  bottomSheet: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
    lineHeight: 28,
  },
  welcomeSubtitle: {
    fontSize: 13.5,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
    marginBottom: 28,
  },
  btnStack: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.brand,
    minHeight: 52,
    borderRadius: SIZES.radiusMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brand,
    minHeight: 52,
    borderRadius: SIZES.radiusMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: COLORS.brand,
    fontSize: 15,
    fontWeight: '700',
  },
});
