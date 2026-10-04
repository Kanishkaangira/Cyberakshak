import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';
import { AUTH_STRINGS } from '../../constants/authStrings';
import { verifyOTP, resendOTP } from '../../services/authService';

export default function VerifyOTPScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const email = route.params?.email || '';
  const otpType = route.params?.type || 'signup';

  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 60-second cooldown timer logic
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

    if (cleanToken.length < 6) {
      setErrorMsg(AUTH_STRINGS.errOtpLength);
      return;
    }

    setLoading(true);
    try {
      if (otpType === 'recovery') {
        await verifyOTP({ email, token: cleanToken, type: 'recovery' });
        // Navigate to set new password
        navigation.navigate('ResetPassword', { email });
      } else {
        await verifyOTP({ email, token: cleanToken, type: 'signup' });
        // Verified! Main tab stack will render automatically once auth state updates
      }
    } catch (err) {
      setErrorMsg(err.message || AUTH_STRINGS.otpExpired);
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
      await resendOTP({ email, type: otpType });
      setSuccessMsg(AUTH_STRINGS.otpSentSuccess);
      setCooldown(60);
    } catch (err) {
      setErrorMsg(err.message || AUTH_STRINGS.errGeneric);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={COLORS.ink} />
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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 36) },
          ]}
        >
          <View style={styles.iconRing}>
            <Icon name="key-outline" size={32} color={COLORS.brand} />
          </View>

          <Text style={styles.title}>{AUTH_STRINGS.otpTitle}</Text>
          <Text style={styles.subtitle}>{AUTH_STRINGS.otpSubtitle(email)}</Text>

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

          {/* OTP Code Input */}
          <Text style={styles.label}>{AUTH_STRINGS.enterOtpLabel}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.otpInput}
              placeholder={AUTH_STRINGS.otpPlaceholder}
              placeholderTextColor={COLORS.muted}
              keyboardType="number-pad"
              maxLength={6}
              value={otpToken}
              onChangeText={setOtpToken}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleVerify}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>{AUTH_STRINGS.verify}</Text>
            )}
          </TouchableOpacity>

          {/* Resend Code Section */}
          <View style={styles.resendWrapper}>
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
                  ? 'Sending...'
                  : cooldown > 0
                  ? AUTH_STRINGS.resendCooldown(cooldown)
                  : AUTH_STRINGS.resendCode}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.greenSoft,
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 16,
    width: '100%',
  },
  successBannerText: {
    flex: 1,
    color: COLORS.green,
    fontSize: 12.5,
    fontWeight: '600',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 8,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  otpInput: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 10,
    textAlign: 'center',
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  resendWrapper: {
    marginTop: 20,
  },
  resendText: {
    color: COLORS.brand,
    fontSize: 13.5,
    fontWeight: '700',
  },
  resendDisabled: {
    color: COLORS.muted,
    fontWeight: '600',
  },
});
