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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';
import { AUTH_STRINGS } from '../../constants/authStrings';
import { updatePassword } from '../../services/authService';

export default function ResetPasswordScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetPassword = async () => {
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg(AUTH_STRINGS.errPasswordMinLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(AUTH_STRINGS.errPasswordMismatch);
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ newPassword });
      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated. Please sign in with your new password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      setErrorMsg(err.message || AUTH_STRINGS.errGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.topNav}>
        <View style={styles.navSpacer} />
        <Text style={styles.topNavTitle}>{AUTH_STRINGS.resetTitle}</Text>
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
          <Text style={styles.title}>{AUTH_STRINGS.resetTitle}</Text>
          <Text style={styles.subtitle}>{AUTH_STRINGS.resetSubtitle}</Text>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* New Password */}
          <Text style={styles.label}>{AUTH_STRINGS.newPasswordLabel}</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" size={18} color={COLORS.muted} />
            <TextInput
              style={styles.input}
              placeholder={AUTH_STRINGS.newPasswordPlaceholder}
              placeholderTextColor={COLORS.muted}
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
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
          <Text style={styles.label}>{AUTH_STRINGS.confirmPasswordLabel}</Text>
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
            onPress={handleResetPassword}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>{AUTH_STRINGS.submit}</Text>
            )}
          </TouchableOpacity>
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
});
