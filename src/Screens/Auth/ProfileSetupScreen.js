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
import { completeProfileSetup } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

export default function ProfileSetupScreen() {
  const { t } = useTranslation();
  const AUTH_STRINGS = getAuthStrings(t);
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCompleteProfile = async () => {
    setErrorMsg('');
    const cleanName = fullName.trim();

    if (!cleanName) {
      setErrorMsg(AUTH_STRINGS.errFullNameRequired);
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
      await completeProfileSetup({
        fullName: cleanName,
        phone: phone.trim(),
        city: city.trim(),
        password,
      });
    } catch (err) {
      const errorMessage = String(err?.message || '');
      const isServerFailure =
        err?.status >= 500 ||
        err?.code === 'unexpected_failure' ||
        /"status"\s*:\s*5\d{2}/.test(errorMessage);

      if (__DEV__) {
        console.warn('[Auth] Profile setup failed', {
          code: err?.code,
          status: err?.status,
        });
      }
      setErrorMsg(
        isServerFailure ? AUTH_STRINGS.errGeneric : errorMessage || AUTH_STRINGS.errGeneric
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topNav}>
        <View style={styles.navSpacer} />
        <Text style={styles.topNavTitle}>{AUTH_STRINGS.signUpTitle}</Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 36) },
          ]}
        >
          <View style={styles.iconRing}>
            <Icon name="person-add-outline" size={30} color={COLORS.brand} />
          </View>
          <Text style={styles.title}>{AUTH_STRINGS.signUpTitle}</Text>
          <Text style={styles.subtitle}>{AUTH_STRINGS.signUpSubtitle}</Text>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>{AUTH_STRINGS.fullNameLabel} *</Text>
          <View style={styles.inputWrapper}>
            <Icon name="person-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.fullNamePlaceholder}
              placeholderTextColor={COLORS.muted}
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

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
              editable={!loading}
            />
          </View>

          <Text style={styles.label}>{AUTH_STRINGS.cityLabel}</Text>
          <View style={styles.inputWrapper}>
            <Icon name="location-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.cityPlaceholder}
              placeholderTextColor={COLORS.muted}
              value={city}
              onChangeText={setCity}
              editable={!loading}
            />
          </View>

          <Text style={styles.label}>{AUTH_STRINGS.passwordLabel} *</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.newPasswordPlaceholder}
              placeholderTextColor={COLORS.muted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((shown) => !shown)}
              accessibilityRole="button"
              accessibilityLabel={AUTH_STRINGS.passwordLabel}
            >
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

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
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleCompleteProfile}
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
  topNavTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
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
    marginBottom: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.redSoft,
    padding: 12,
    borderRadius: SIZES.radiusMd,
    marginBottom: 12,
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
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: SIZES.radiusMd,
    marginTop: 24,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: COLORS.onBrand,
    fontSize: 15,
    fontWeight: '700',
  },
});
