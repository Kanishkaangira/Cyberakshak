import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import ProfileHeader from '../components/profile/ProfileHeader';
import SettingRow from '../components/profile/SettingRow';
import EditNameSheet from '../components/profile/EditNameSheet';
import { AUTH_STRINGS } from '../constants/authStrings';
import {
  getCurrentUserProfile,
  updateUserProfile,
  signOut,
  deleteUserAccount,
} from '../services/authService';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [language, setLanguage] = useState('English');
  const [darkTheme, setDarkTheme] = useState(false);
  const [editingName, setEditingName] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getCurrentUserProfile();
      setProfile(data);
      if (data?.preferred_language) setLanguage(data.preferred_language);
    } catch (err) {
      console.warn('[ProfileScreen] Error loading profile:', err);
      setErrorMsg('Could not load profile. Pull to refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaveName = async (newName) => {
    setEditingName(false);
    setSaving(true);
    try {
      const updated = await updateUserProfile({ full_name: newName });
      setProfile(updated || { ...profile, full_name: newName });
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not update name.');
    } finally {
      setSaving(false);
    }
  };

  const chooseLanguage = () =>
    Alert.alert('Language', 'Choose your app language', [
      {
        text: 'English',
        onPress: () => {
          setLanguage('English');
          updateUserProfile({ preferred_language: 'English' }).catch(() => {});
        },
      },
      {
        text: 'Hindi',
        onPress: () => {
          setLanguage('Hindi');
          updateUserProfile({ preferred_language: 'Hindi' }).catch(() => {});
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const confirmLogout = () =>
    Alert.alert(AUTH_STRINGS.logout, AUTH_STRINGS.confirmLogout, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: AUTH_STRINGS.logout,
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (e) {
            Alert.alert('Sign Out Error', e.message);
          }
        },
      },
    ]);

  const confirmDeleteAccount = () =>
    Alert.alert(
      AUTH_STRINGS.deleteAccount,
      AUTH_STRINGS.confirmDeleteAccount,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserAccount();
            } catch (e) {
              Alert.alert('Account Deletion Failed', e.message);
            }
          },
        },
      ]
    );

  const userName = profile?.full_name || 'CyberAkshak User';
  const userEmail = profile?.email || 'user@cyberakshak.in';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brand} />

      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        {loading ? (
          <View style={[styles.loadingHeader, { paddingTop: insets.top + 30 }]}>
            <ActivityIndicator color="#FFFFFF" size="large" />
            <Text style={styles.loadingText}>Loading Profile...</Text>
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
              <Text style={styles.savingText}>Saving profile changes...</Text>
            </View>
          )}

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="alert-circle-outline" size={16} color={COLORS.red} />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingRow
              icon="globe-outline"
              title="Language"
              value={language}
              onPress={chooseLanguage}
            />
            <SettingRow
              icon={darkTheme ? 'moon-outline' : 'sunny-outline'}
              title="Dark theme"
              last
              right={
                <Switch
                  value={darkTheme}
                  onValueChange={setDarkTheme}
                  trackColor={{ false: COLORS.line, true: COLORS.brand }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>

          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.card}>
            <SettingRow
              icon="information-circle-outline"
              title="About app"
              last
              onPress={() =>
                Alert.alert(
                  'About Cyberakshak',
                  'Cyberakshak helps people recognize online fraud and stay safer. Version 1.0.0.'
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

          <Text style={styles.version}>Cyberakshak · Version 1.0.0</Text>
        </View>
      </ScrollView>

      <EditNameSheet
        visible={editingName}
        initialName={userName}
        onClose={() => setEditingName(false)}
        onSave={handleSaveName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingHeader: {
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  loadingText: {
    color: '#FFFFFF',
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
});
