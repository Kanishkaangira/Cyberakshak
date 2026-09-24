import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import ProfileHeader from '../components/profile/ProfileHeader';
import SettingRow from '../components/profile/SettingRow';
import EditNameSheet from '../components/profile/EditNameSheet';

const EMAIL = 'kanishka@cyberakshak.in'; // display only, not editable

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Kanishka');
  const [language, setLanguage] = useState('English');
  const [darkTheme, setDarkTheme] = useState(false);
  const [editingName, setEditingName] = useState(false);

  const chooseLanguage = () =>
    Alert.alert('Language', 'Choose your app language', [
      { text: 'English', onPress: () => setLanguage('English') },
      { text: 'Hindi', onPress: () => setLanguage('Hindi') },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const confirmLogout = () =>
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => Alert.alert('Logged out', 'You have been logged out.'),
      },
    ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brand} />

      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        <ProfileHeader name={name} email={EMAIL} onEdit={() => setEditingName(true)} />

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingRow icon="globe-outline" title="Language" value={language} onPress={chooseLanguage} />
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

          <TouchableOpacity style={styles.logout} activeOpacity={0.8} onPress={confirmLogout}>
            <Icon name="log-out-outline" size={19} color={COLORS.red} />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Cyberakshak · Version 1.0.0</Text>
        </View>
      </ScrollView>

      <EditNameSheet
        visible={editingName}
        initialName={name}
        onClose={() => setEditingName(false)}
        onSave={(newName) => {
          setName(newName);
          setEditingName(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { paddingHorizontal: 20, paddingTop: 8 },
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
  version: { textAlign: 'center', color: COLORS.muted, fontSize: 12, marginTop: 18 },
});
