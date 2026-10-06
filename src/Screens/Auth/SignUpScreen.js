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
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';
import { AUTH_STRINGS } from '../../constants/authStrings';
import { signUpWithEmail } from '../../services/authService';

export default function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async () => {
    setErrorMsg('');
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMsg(AUTH_STRINGS.errFullNameRequired);
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg(AUTH_STRINGS.errEmailRequired);
      return;
    }
    if (password.length < 8) {
      setErrorMsg(AUTH_STRINGS.errPasswordMinLength);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(AUTH_STRINGS.errPasswordMismatch);
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail({
        fullName: cleanName,
        email: cleanEmail,
        password,
        phone: phone.trim(),
        city: city.trim(),
      });

      // Navigate to 6-digit OTP verification screen
      navigation.navigate('VerifyOTP', {
        email: cleanEmail,
        type: 'signup',
      });
    } catch (err) {
      if (__DEV__) {
        console.warn('[Auth] Sign-up failed', {
          name: err?.name,
          code: err?.code,
          status: err?.status,
          message: err?.message,
        });
      }

      const isServerFailure =
        err?.status >= 500 ||
        err?.code === 'unexpected_failure' ||
        String(err?.message || '').includes('"status":500');

      setErrorMsg(
        isServerFailure
          ? 'Account creation is temporarily unavailable. Please try again shortly.'
          : err?.message || AUTH_STRINGS.errGeneric
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>{AUTH_STRINGS.signUp}</Text>
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
          <Text style={styles.title}>{AUTH_STRINGS.signUpTitle}</Text>
          <Text style={styles.subtitle}>{AUTH_STRINGS.signUpSubtitle}</Text>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Full Name */}
          <Text style={styles.label}>{AUTH_STRINGS.fullNameLabel} *</Text>
          <View style={styles.inputWrapper}>
            <Icon name="person-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.fullNamePlaceholder}
              placeholderTextColor={COLORS.muted}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>{AUTH_STRINGS.emailLabel} *</Text>
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

          {/* Phone */}
          <Text style={styles.label}>{AUTH_STRINGS.phoneLabel}</Text>
          <View style={styles.inputWrapper}>
            <Icon name="call-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.phonePlaceholder}
              placeholderTextColor={COLORS.muted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* City */}
          <Text style={styles.label}>{AUTH_STRINGS.cityLabel}</Text>
          <View style={styles.inputWrapper}>
            <Icon name="location-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.cityPlaceholder}
              placeholderTextColor={COLORS.muted}
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>{AUTH_STRINGS.passwordLabel} *</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.passwordPlaceholder}
              placeholderTextColor={COLORS.muted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>{AUTH_STRINGS.confirmPasswordLabel} *</Text>
          <View style={styles.inputWrapper}>
            <Icon name="shield-checkmark-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.confirmPasswordPlaceholder}
              placeholderTextColor={COLORS.muted}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleSignUp}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>{AUTH_STRINGS.signUp}</Text>
            )}
          </TouchableOpacity>

          {/* Login Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>{AUTH_STRINGS.alreadyHaveAccount}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>{AUTH_STRINGS.login}</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.ink,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.muted,
    marginTop: 4,
    marginBottom: 20,
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
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  footerPrompt: {
    color: COLORS.muted,
    fontSize: 13.5,
  },
  footerLink: {
    color: COLORS.brand,
    fontSize: 13.5,
    fontWeight: '700',
  },
});
