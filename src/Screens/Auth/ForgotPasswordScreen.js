import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { SIZES } from '../../constants/theme';
import { getAuthStrings } from '../../constants/authStrings';
import {
  getPendingPasswordReset,
  savePendingPasswordReset,
  sendPasswordReset,
} from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function ForgotPasswordScreen({ route, navigation }) {
  const { t } = useTranslation();
  const AUTH_STRINGS = getAuthStrings(t);
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(route.params?.email || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendCode = async () => {
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg(AUTH_STRINGS.errEmailRequired);
      return;
    }

    setLoading(true);
    try {
      const pendingRequest = await getPendingPasswordReset();
      if (pendingRequest?.email === cleanEmail) {
        navigation.navigate('VerifyOTP', {
          email: cleanEmail,
          type: 'recovery',
        });
        return;
      }

      await sendPasswordReset({ email: cleanEmail });
      await savePendingPasswordReset({ email: cleanEmail });
      // Always navigate to OTP screen without revealing email existence
      navigation.navigate('VerifyOTP', {
        email: cleanEmail,
        type: 'recovery',
      });
    } catch (err) {
      setErrorMsg(err.message || AUTH_STRINGS.errGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.bg} />

      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>{AUTH_STRINGS.forgotTitle}</Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 36) },
          ]}
        >
          <View style={styles.iconRing}>
            <Icon name="lock-open-outline" size={32} color={COLORS.brand} />
          </View>

          <Text style={styles.title}>{AUTH_STRINGS.forgotTitle}</Text>
          <Text style={styles.subtitle}>{AUTH_STRINGS.forgotSubtitle}</Text>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <Text style={styles.label}>{AUTH_STRINGS.emailLabel}</Text>
          <View style={styles.inputWrapper}>
            <Icon name="mail-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.emailPlaceholder}
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleSendCode}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.onBrand} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>{AUTH_STRINGS.continue}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flexContainer: {
    flex: 1,
  },
  navSpacer: {
    width: 36,
  },
  topNav: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  iconRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.redSoft,
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 16,
    width: '100%',
  },
  errorBannerText: {
    flex: 1,
    color: COLORS.red,
    fontSize: 12.5,
    fontWeight: '600',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 6,
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 14,
    minHeight: 50,
    gap: 10,
  },
  input: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 14,
    paddingVertical: 10,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: COLORS.brand,
    minHeight: 52,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: COLORS.onBrand,
    fontSize: 15,
    fontWeight: '700',
  },
});
