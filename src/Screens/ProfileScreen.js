import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SIZES } from '../constants/theme';
import ProfileHeader from '../components/profile/ProfileHeader';
import SettingRow from '../components/profile/SettingRow';
import EditNameSheet from '../components/profile/EditNameSheet';
import { getAuthStrings } from '../constants/authStrings';
import {
  APP_LANGUAGES,
  getLanguageCode,
  SUPPORTED_LANGUAGE_CODES,
} from '../constants/languages';
import i18n from '../i18n';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';
import {
  getCurrentUserProfile,
  updateUserProfile,
  signOut,
  deleteUserAccount,
} from '../services/authService';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const AUTH_STRINGS = getAuthStrings(t);
  const { theme: COLORS, isDark, isThemeReady, toggleTheme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(
    getLanguageCode(i18n.resolvedLanguage || i18n.language)
  );
  const availableLanguages = APP_LANGUAGES.filter(({ code }) =>
    SUPPORTED_LANGUAGE_CODES.includes(code)
  );
  const hasLoadedProfile = useRef(false);
  const selectedLanguage = availableLanguages.find(
    ({ code }) => code === selectedLanguageCode
  ) || availableLanguages[0];
  const language = selectedLanguageCode === 'hi'
    ? t('profile.hindi')
    : selectedLanguageCode === 'en'
      ? t('profile.english')
      : selectedLanguage.name;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getCurrentUserProfile();
      setProfile(data);
      if (data?.preferred_language) {
        const savedLanguageCode = getLanguageCode(data.preferred_language);
        setSelectedLanguageCode(savedLanguageCode);
        await i18n.changeLanguage(savedLanguageCode);
      }
    } catch (err) {
      console.warn('[ProfileScreen] Error loading profile:', err);
      setErrorMsg(t('profile.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (hasLoadedProfile.current) return;
    hasLoadedProfile.current = true;
    loadProfile();
  }, [loadProfile]);

  const handleSaveName = async (newName) => {
    setEditingName(false);
    setSaving(true);
    try {
      const updated = await updateUserProfile({ full_name: newName });
      setProfile(updated || { ...profile, full_name: newName });
    } catch (err) {
      Alert.alert(t('profile.updateFailed'), err.message || t('profile.updateNameFailed'));
    } finally {
      setSaving(false);
    }
  };

  const chooseLanguage = async (selectedLanguageOption) => {
    setSelectedLanguageCode(selectedLanguageOption.code);
    setLanguagePickerVisible(false);
    await i18n.changeLanguage(selectedLanguageOption.code);

    try {
      const updatedProfile = await updateUserProfile({
        preferred_language: selectedLanguageOption.code,
      });
      setProfile((currentProfile) => ({
        ...currentProfile,
        ...updatedProfile,
        preferred_language: selectedLanguageOption.code,
      }));
    } catch (error) {
      console.error('[ProfileScreen] Could not save language preference:', error);
      Alert.alert(t('profile.updateFailed'), error.message);
    }
  };

  const confirmLogout = () =>
    Alert.alert(AUTH_STRINGS.logout, AUTH_STRINGS.confirmLogout, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: AUTH_STRINGS.logout,
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (e) {
            Alert.alert(t('profile.signOutError'), e.message);
          }
        },
      },
    ]);

  const confirmDeleteAccount = () =>
    Alert.alert(
      AUTH_STRINGS.deleteAccount,
      AUTH_STRINGS.confirmDeleteAccount,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.deletePermanently'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserAccount();
            } catch (e) {
              Alert.alert(t('profile.deleteFailed'), e.message);
            }
          },
        },
      ]
    );

  const userName = profile?.full_name || t('profile.defaultName');
  const userEmail = profile?.email || 'user@cyberakshak.in';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'dark-content' : 'light-content'} backgroundColor={COLORS.brand} />

      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        {loading ? (
          <View style={[styles.loadingHeader, { paddingTop: insets.top + 30 }]}>
            <ActivityIndicator color={COLORS.onBrand} size="large" />
            <Text style={styles.loadingText}>{t('profile.loading')}</Text>
          </View>
        ) : (
          <ProfileHeader
            name={userName}
            email={userEmail}
            onEdit={() => setEditingName(true)}
          />
        )}

        <View style={styles.body}>
          {saving && (
            <View style={styles.savingBanner}>
              <ActivityIndicator color={COLORS.brand} size="small" />
              <Text style={styles.savingText}>{t('profile.saving')}</Text>
            </View>
          )}

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>
          <View style={styles.card}>
            <SettingRow
              icon="notifications-outline"
              title={t('notifications.title')}
              onPress={() => navigation.navigate('Notifications')}
            />
            <SettingRow
              icon="globe-outline"
              title={t('profile.language')}
              value={language}
              onPress={() => setLanguagePickerVisible(true)}
            />
            <SettingRow
              icon={isDark ? 'moon-outline' : 'sunny-outline'}
              title={t('profile.darkTheme')}
              onPress={toggleTheme}
              last
              right={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  disabled={!isThemeReady}
                  trackColor={{ false: COLORS.line, true: COLORS.brand }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>

          <Text style={styles.sectionTitle}>{t('profile.more')}</Text>
          <View style={styles.card}>
            <SettingRow
              icon="information-circle-outline"
              title={t('profile.aboutApp')}
              last
              onPress={() =>
                Alert.alert(
                  t('profile.aboutTitle'),
                  t('profile.aboutMessage')
                )
              }
            />
          </View>

          {/* Log Out Button */}
          <TouchableOpacity
            style={styles.logout}
            activeOpacity={0.8}
            onPress={confirmLogout}
          >
            <Icon name="log-out-outline" size={19} color={COLORS.red} />
            <Text style={styles.logoutText}>{AUTH_STRINGS.logout}</Text>
          </TouchableOpacity>

          {/* Delete My Account Button (Red Outlined below Log out) */}
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={confirmDeleteAccount}
          >
            <Icon name="trash-outline" size={18} color={COLORS.red} />
            <Text style={styles.deleteBtnText}>{AUTH_STRINGS.deleteAccount}</Text>
          </TouchableOpacity>

          <Text style={styles.version}>{t('profile.version')}</Text>
        </View>
      </ScrollView>

      <EditNameSheet
        visible={editingName}
        initialName={userName}
        onClose={() => setEditingName(false)}
        onSave={handleSaveName}
      />
      <Modal
        visible={languagePickerVisible}
        animationType="slide"
        onRequestClose={() => setLanguagePickerVisible(false)}
      >
        <View style={[styles.languagePicker, { paddingTop: insets.top }]}>
          <View style={styles.languagePickerHeader}>
            <View style={styles.languagePickerHeading}>
              <Text style={styles.languagePickerTitle}>{t('profile.language')}</Text>
              <Text style={styles.languagePickerSubtitle}>{t('profile.chooseLanguage')}</Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('common.cancel')}
              onPress={() => setLanguagePickerVisible(false)}
              style={styles.languagePickerClose}
            >
              <Icon name="close" size={23} color={COLORS.ink} />
            </TouchableOpacity>
          </View>
          <Text style={styles.languageFallbackNotice}>
            {t('profile.languageFallback')}
          </Text>
          <FlatList
            data={availableLanguages}
            keyExtractor={({ code }) => code}
            renderItem={({ item }) => {
              const isSelected = item.code === selectedLanguageCode;
              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => chooseLanguage(item)}
                  style={styles.languageOption}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      isSelected && styles.languageOptionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {isSelected && (
                    <Icon name="checkmark" size={21} color={COLORS.brand} />
                  )}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={[
              styles.languageOptions,
              { paddingBottom: insets.bottom + 20 },
            ]}
          />
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingHeader: {
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  loadingText: {
    color: COLORS.onBrand,
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
  body: { paddingHorizontal: 20, paddingTop: 8 },
  savingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.brandSoft,
    padding: 10,
    borderRadius: SIZES.radiusMd,
    marginTop: 12,
  },
  savingText: {
    color: COLORS.brand,
    fontSize: 12.5,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.redSoft,
    padding: 10,
    borderRadius: SIZES.radiusMd,
    marginTop: 12,
  },
  errorBannerText: {
    color: COLORS.red,
    fontSize: 12.5,
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.muted,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  logout: {
    minHeight: 52,
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.redSoft,
  },
  logoutText: { color: COLORS.red, fontSize: 14.5, fontWeight: '700' },
  deleteBtn: {
    minHeight: 50,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: COLORS.red,
  },
  deleteBtnText: { color: COLORS.red, fontSize: 14, fontWeight: '700' },
  version: { textAlign: 'center', color: COLORS.muted, fontSize: 12, marginTop: 18 },
  languagePicker: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  languagePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  languagePickerHeading: {
    flex: 1,
  },
  languagePickerTitle: {
    color: COLORS.ink,
    fontSize: 21,
    fontWeight: '800',
  },
  languagePickerSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
  languagePickerClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  languageFallbackNotice: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginHorizontal: 20,
    marginVertical: 14,
  },
  languageOptions: {
    paddingHorizontal: 20,
  },
  languageOption: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 8,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  languageOptionText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '500',
  },
  languageOptionTextSelected: {
    color: COLORS.brand,
    fontWeight: '700',
  },
});
