import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Cyberakshak?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => Alert.alert('Logged Out', 'Session reset successfully.'),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>K</Text>
          </View>
          <Text style={styles.profileName}>Kanishka</Text>
          <Text style={styles.profileEmail}>kanishka@cyberakshak.in</Text>
        </View>

        {/* Cyber Safety Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTop}>
            <View>
              <Text style={styles.scoreSubtitle}>Personal Safety Health</Text>
              <Text style={styles.scoreTitle}>Security Score: 88/100</Text>
            </View>
            <View style={styles.shieldBadge}>
              <Text style={styles.shieldBadgeText}>🛡️ High</Text>
            </View>
          </View>

          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '88%' }]} />
          </View>

          <Text style={styles.scoreTip}>
            ✓ 2FA enabled • App lock active • 4 scam modules completed
          </Text>
        </View>

        {/* Menu Items Card */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('News')}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuEmoji}>📰</Text>
              <Text style={styles.menuTitle}>Saved news</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Events')}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuEmoji}>📅</Text>
              <Text style={styles.menuTitle}>My events</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuEmoji}>💬</Text>
              <Text style={styles.menuTitle}>Chat history</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                '📞 National Cyber Helpline (1930)',
                'Dedicated 24x7 Citizen Cyber Financial Fraud reporting platform.\n\nHelpline: 1930\nWeb: https://cybercrime.gov.in',
                [
                  { text: 'Close', style: 'cancel' },
                  {
                    text: 'Call 1930',
                    onPress: () => Linking.openURL('tel:1930').catch(() => {}),
                  },
                ]
              )
            }
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuEmoji}>🚨</Text>
              <Text style={styles.menuTitle}>Emergency helpline (1930)</Text>
            </View>
            <Text style={[styles.menuArrow, { color: COLORS.red }]}>Call ›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('Language', 'Cyberakshak is available in English and Hindi (हिन्दी).')
            }
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuEmoji}>🌐</Text>
              <Text style={styles.menuTitle}>Language</Text>
            </View>
            <Text style={styles.menuValue}>English ›</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuEmoji}>🔔</Text>
              <Text style={styles.menuTitle}>Security alerts & tips</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.line, true: COLORS.brand }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'About Cyberakshak',
                'Cyberakshak v1.0.0\nAn AI-powered cybersecurity defense & incident awareness companion.\n\nProtecting citizens from cyber scams, phishing, and online fraud.'
              )
            }
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuEmoji}>ℹ️</Text>
              <Text style={styles.menuTitle}>Help and feedback</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.brand,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  scoreCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  scoreTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreSubtitle: {
    fontSize: 11.5,
    color: COLORS.muted,
    fontWeight: '600',
  },
  scoreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 2,
  },
  shieldBadge: {
    backgroundColor: COLORS.greenSoft,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: SIZES.radiusPill,
  },
  shieldBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.green,
  },
  progressBarTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.line,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 4,
  },
  scoreTip: {
    fontSize: 11.5,
    color: COLORS.muted,
    marginTop: 6,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuEmoji: {
    fontSize: 18,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  menuArrow: {
    fontSize: 18,
    color: COLORS.muted,
    fontWeight: '600',
  },
  menuValue: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusPill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FCDADA',
  },
  logoutText: {
    color: COLORS.red,
    fontWeight: '700',
    fontSize: 14,
  },
});
