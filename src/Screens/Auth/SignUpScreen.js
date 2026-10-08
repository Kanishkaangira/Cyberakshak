import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { SIZES } from '../../constants/theme';
import { getAuthStrings } from '../../constants/authStrings';
import { signUpWithEmail } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

const getSafeAuthDiagnostic = (error, email) => {
  let message = String(error?.message || '');

  try {
    const payload = JSON.parse(message);
    message =
      payload.message ||
      payload.msg ||
      payload.error_description ||
      payload.error ||
      '';
  } catch {
    // The Supabase SDK usually provides a plain message; raw JSON is handled above.
  }

  const sanitizedMessage = message
    .split(email)
    .join('[email]')
    .replace(/[\r\n]+/g, ' ')
    .trim();

  if (sanitizedMessage && sanitizedMessage.length <= 200) {
    return sanitizedMessage;
  }

  return error?.code || 'Supabase returned a server error.';
};

export default function SignUpScreen({ navigation }) {
  const { t } = useTranslation();
  const AUTH_STRINGS = getAuthStrings(t);
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendCode = async () => {
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg(AUTH_STRINGS.errEmailRequired);
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail({ email: cleanEmail });
      navigation.navigate('VerifyOTP', { email: cleanEmail, type: 'email' });
    } catch (err) {
      const errorMessage = String(err?.message || '');
      const isServerFailure =
        err?.status >= 500 ||
        err?.code === 'unexpected_failure' ||
        /"status"\s*:\s*5\d{2}/.test(errorMessage);
      const diagnostic = getSafeAuthDiagnostic(err, cleanEmail);

      if (__DEV__) {
        console.warn('[Auth] Signup OTP request failed', {
          code: err?.code,
          status: err?.status,
          message: diagnostic,
        });
      }

      setErrorMsg(
        isServerFailure
          ? `${t('auth.accountCreationUnavailable')}\n${diagnostic}`
          : diagnostic || AUTH_STRINGS.errGeneric
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.brand}
      />

      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Icon name="arrow-back" size={20} color={COLORS.onBrand} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>{AUTH_STRINGS.signUp}</Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.hero}>
            <View style={styles.iconRing}>
              <Icon name="shield-checkmark-outline" size={30} color={COLORS.onBrand} />
            </View>
            <Text style={styles.heroTitle}>{AUTH_STRINGS.signUpTitle}</Text>
            <Text style={styles.heroSubtitle}>{AUTH_STRINGS.signUpSubtitle}</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionIcon}>
                <Icon name="mail-outline" size={18} color={COLORS.brand} />
              </View>
              <View style={styles.sectionCopy}>
                <Text style={styles.title}>{AUTH_STRINGS.emailLabel}</Text>
              </View>
            </View>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.inputWrapper}>
              <Icon name="mail-outline" size={18} color={COLORS.muted} />
              <TextInput
                style={styles.input}
                placeholder={AUTH_STRINGS.emailPlaceholder}
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                accessibilityLabel={AUTH_STRINGS.emailLabel}
                editable={!loading}
                returnKeyType="send"
                onSubmitEditing={handleSendCode}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.btnDisabled]}
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleSendCode}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.onBrand} size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>{AUTH_STRINGS.continue}</Text>
                  <Icon name="arrow-forward" size={18} color={COLORS.onBrand} />
                </>
              )}
            </TouchableOpacity>
            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>{AUTH_STRINGS.alreadyHaveAccount}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>{AUTH_STRINGS.login}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: Math.max(insets.bottom + 18, 28) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand,
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
    backgroundColor: COLORS.brand,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onBrand,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.brand,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 48,
  },
  formCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    marginTop: -26,
  },
  iconRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.onBrand,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    maxWidth: 300,
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 20,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.ink,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.redSoft,
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 14,
  },
  errorBannerText: {
    flex: 1,
    color: COLORS.red,
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
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
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.brand,
    borderRadius: SIZES.radiusMd,
    marginTop: 18,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: COLORS.onBrand,
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  footerPrompt: {
    color: COLORS.muted,
    fontSize: 13,
  },
  footerLink: {
    color: COLORS.brand,
    fontSize: 13,
    fontWeight: '700',
  },
});
