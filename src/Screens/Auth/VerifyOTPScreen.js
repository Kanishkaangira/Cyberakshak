import React, { useRef, useState, useEffect } from 'react';
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
  OTP_RESEND_COOLDOWN_SECONDS,
  clearPendingPasswordReset,
  getPendingPasswordReset,
  resendSignupOTP,
  savePendingPasswordReset,
  verifyOTP,
  resendOTP,
} from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function VerifyOTPScreen({ route, navigation }) {
  const { t } = useTranslation();
  const AUTH_STRINGS = getAuthStrings(t);
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const email = route.params?.email || '';
  const otpType = route.params?.type || 'signup';
  const otpInputRef = useRef(null);

  const [otpToken, setOtpToken] = useState('');
  const [otpFocused, setOtpFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(OTP_RESEND_COOLDOWN_SECONDS);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (otpType !== 'recovery') return;

    getPendingPasswordReset()
      .then((pendingRequest) => {
        if (pendingRequest?.email !== email) return;
        const elapsedSeconds = Math.floor(
          (Date.now() - pendingRequest.requestedAt) / 1000
        );
        setCooldown(
          Math.min(
            OTP_RESEND_COOLDOWN_SECONDS,
            Math.max(0, OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds)
          )
        );
      })
      .catch((error) => {
        console.warn('[VerifyOTPScreen] Could not restore the OTP request:', error);
        setErrorMsg(AUTH_STRINGS.errGeneric);
      });
  }, [AUTH_STRINGS.errGeneric, email, otpType]);

  // Match the resend interval configured for Supabase Auth.
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const cleanToken = otpToken.trim();

    if (!/^\d{6}$/.test(cleanToken)) {
      setErrorMsg(AUTH_STRINGS.errOtpLength);
      return;
    }

    setLoading(true);
    try {
      if (otpType === 'recovery') {
        await verifyOTP({ email, token: cleanToken, type: 'recovery' });
        clearPendingPasswordReset().catch((error) => {
          console.warn('[VerifyOTPScreen] Could not clear the verified OTP request:', error);
        });
        // Navigate to set new password
        navigation.navigate('ResetPassword', { email });
      } else if (otpType === 'email') {
        await verifyOTP({ email, token: cleanToken, type: 'email' });
      } else {
        await verifyOTP({ email, token: cleanToken, type: 'signup' });
        // Verified! Main tab stack will render automatically once auth state updates
      }
    } catch (err) {
      const errorMessage = String(err?.message || '');
      const isServerFailure =
        err?.status >= 500 ||
        err?.code === 'unexpected_failure' ||
        /"status"\s*:\s*5\d{2}/.test(errorMessage);
      setErrorMsg(
        isServerFailure ? AUTH_STRINGS.errGeneric : errorMessage || AUTH_STRINGS.otpExpired
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setErrorMsg('');
    setSuccessMsg('');
    setResendLoading(true);
    try {
      if (otpType === 'email') {
        await resendSignupOTP({ email });
      } else {
        await resendOTP({ email, type: otpType });
      }
      if (otpType === 'recovery') {
        await savePendingPasswordReset({ email });
      }
      setSuccessMsg(AUTH_STRINGS.otpSentSuccess);
      setCooldown(OTP_RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      const errorMessage = String(err?.message || '');
      const isServerFailure =
        err?.status >= 500 ||
        err?.code === 'unexpected_failure' ||
        /"status"\s*:\s*5\d{2}/.test(errorMessage);
      setErrorMsg(
        isServerFailure ? AUTH_STRINGS.errGeneric : errorMessage || AUTH_STRINGS.errGeneric
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.brand} />

      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={COLORS.onBrand} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>{AUTH_STRINGS.verify}</Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 36) },
          ]}
        >
          <View style={styles.hero}>
            <View style={styles.iconRing}>
              <Icon name="mail-open-outline" size={29} color={COLORS.onBrand} />
            </View>
            <Text style={styles.heroTitle}>{AUTH_STRINGS.otpTitle}</Text>
            <Text style={styles.heroSubtitle}>{AUTH_STRINGS.otpSubtitle(email)}</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.emailPill}>
              <Icon name="mail-outline" size={16} color={COLORS.brand} />
              <Text style={styles.emailText} numberOfLines={1}>{email}</Text>
              <TouchableOpacity
                style={styles.editEmailButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel={AUTH_STRINGS.emailLabel}
              >
                <Icon name="create-outline" size={17} color={COLORS.brand} />
              </TouchableOpacity>
            </View>

            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}

            {successMsg ? (
              <View style={styles.successBanner}>
                <Icon name="checkmark-circle-outline" size={16} color={COLORS.green} />
                <Text style={styles.successBannerText}>{successMsg}</Text>
              </View>
            ) : null}

            <View style={styles.codeHeading}>
              <Text style={styles.label}>{AUTH_STRINGS.enterOtpLabel}</Text>
              <Icon name="key-outline" size={17} color={COLORS.brand} />
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.otpBoxes, otpFocused && styles.otpBoxesFocused]}
              onPress={() => otpInputRef.current?.focus()}
              accessibilityRole="button"
              accessibilityLabel={AUTH_STRINGS.enterOtpLabel}
            >
              <View style={styles.digitRow} pointerEvents="none">
                {Array.from({ length: 6 }, (_, index) => {
                  const digit = otpToken[index] || '';
                  const isActive = otpFocused && (
                    index === otpToken.length || (otpToken.length === 6 && index === 5)
                  );

                  return (
                    <View
                      key={index}
                      style={[
                        styles.digitBox,
                        digit ? styles.digitBoxFilled : null,
                        isActive ? styles.digitBoxActive : null,
                      ]}
                    >
                      <Text style={[styles.digitText, !digit && styles.digitPlaceholder]}>
                        {digit}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <TextInput
                ref={otpInputRef}
                style={styles.hiddenOtpInput}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={6}
                value={otpToken}
                onFocus={() => setOtpFocused(true)}
                onBlur={() => setOtpFocused(false)}
                onChangeText={(value) => {
                  setOtpToken(value.replace(/\D/g, '').slice(0, 6));
                  setErrorMsg('');
                }}
                accessibilityLabel={AUTH_STRINGS.enterOtpLabel}
                autoFocus
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.btnDisabled]}
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleVerify}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.onBrand} size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>{AUTH_STRINGS.verify}</Text>
                  <Icon name="arrow-forward" size={18} color={COLORS.onBrand} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <TouchableOpacity
                disabled={cooldown > 0 || resendLoading}
                onPress={handleResend}
              >
                <Text
                  style={[
                    styles.resendText,
                    (cooldown > 0 || resendLoading) && styles.resendDisabled,
                  ]}
                >
                  {resendLoading
                    ? t('common.sending')
                    : cooldown > 0
                      ? AUTH_STRINGS.resendCooldown(cooldown)
                      : AUTH_STRINGS.resendCode}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingTop: 26,
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
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.onBrand,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    maxWidth: 320,
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 7,
    textAlign: 'center',
    lineHeight: 20,
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 44,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: SIZES.radiusSm,
  },
  emailText: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 12.5,
    fontWeight: '600',
  },
  editEmailButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.redSoft,
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    color: COLORS.red,
    fontSize: 12.5,
    fontWeight: '600',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.greenSoft,
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 16,
  },
  successBannerText: {
    flex: 1,
    color: COLORS.green,
    fontSize: 12.5,
    fontWeight: '600',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ink,
  },
  codeHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  otpBoxes: {
    position: 'relative',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.bg,
    padding: 10,
  },
  otpBoxesFocused: {
    borderColor: COLORS.brand,
  },
  digitRow: {
    flexDirection: 'row',
    gap: 7,
  },
  digitBox: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.surface,
  },
  digitBoxFilled: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brandSoft,
  },
  digitBoxActive: {
    borderWidth: 2,
    borderColor: COLORS.brand,
  },
  digitText: {
    color: COLORS.ink,
    fontSize: 21,
    fontWeight: '800',
  },
  digitPlaceholder: {
    color: COLORS.line,
  },
  hiddenOtpInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.02,
    color: 'transparent',
    fontSize: 1,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 18,
  },
  resendText: {
    color: COLORS.brand,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resendDisabled: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: COLORS.brand,
    minHeight: 52,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
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
