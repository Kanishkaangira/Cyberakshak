import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { FRAUD_CATEGORIES, QUICK_ACTIONS } from '../constants/data';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleQuickAction = (action) => {
    if (action === 'check_link') {
      navigation.navigate('Chatbot', { initialQuery: 'Is this link safe?' });
    } else if (action === 'report_fraud') {
      Alert.alert(
        '🚨 Report Cyber Fraud',
        'If you suspect or suffered a financial fraud, report immediately to the National Cyber Crime Helpline:\n\n• Dial: 1930\n• Portal: cybercrime.gov.in\n\nReporting within 2 to 24 hours increases the chance to freeze lost funds.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call 1930',
            onPress: () => Linking.openURL('tel:1930').catch(() => {}),
          },
          {
            text: 'Ask AI Chatbot',
            onPress: () => navigation.navigate('Chatbot', { initialQuery: 'I lost money in a scam' }),
          },
        ]
      );
    } else if (action === 'call_helpline') {
      Alert.alert(
        '📞 National Cyber Helpline (1930)',
        '1930 is the official citizen financial cyber fraud reporting helpline managed by the Ministry of Home Affairs (I4C).\n\nWould you like to dial now?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Dial 1930', onPress: () => Linking.openURL('tel:1930').catch(() => {}) },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>🛡️</Text>
            </View>
            <Text style={styles.brandTitle}>Cyberakshak</Text>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  '🔔 Cyber Alerts',
                  'You have 2 new security alerts:\n• New courier SMS phishing detected\n• National UPI advisory issued'
                )
              }
            >
              <Text style={styles.iconText}>🔔</Text>
              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.avatarLetter}>K</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.userName}>Hi, Kanishka 👋</Text>
        </View>

        {/* Hero Card: AI Safety Assistant */}
        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>AI safety assistant</Text>
            </View>
            <View style={styles.sparkleIcon}>
              <Text style={styles.sparkleEmoji}>✨</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Got a suspicious call or message?</Text>
          <Text style={styles.heroSubtitle}>
            Ask Cyberakshak and find out if it is a scam.
          </Text>

          <View style={styles.fakeInput}>
            <Text style={styles.fakeInputPlaceholder}>Type or paste a message</Text>
            <View style={styles.fakeInputArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions (3 columns) */}
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() => handleQuickAction(item.action)}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: item.bg }]}>
                <Text style={styles.actionEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Learn About Frauds Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Learn about frauds</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('FraudEducation')}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Fraud Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.fraudListContainer}
        >
          {FRAUD_CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.fraudCard, { backgroundColor: item.bg }]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('FraudEducation', { selectedId: item.id })
              }
            >
              <Text style={styles.fraudIcon}>{item.icon}</Text>
              <Text style={styles.fraudTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.fraudLessons}>{item.lessons}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tip of the Day */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconBadge}>
            <Text style={styles.tipIcon}>💡</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Tip of the day</Text>
            <Text style={styles.tipText}>
              Your bank never asks for your OTP or UPI PIN to credit funds.
            </Text>
          </View>
        </View>
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
    paddingBottom: 32,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  iconText: {
    fontSize: 16,
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.red,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  greetingSection: {
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 2,
    letterSpacing: -0.4,
  },
  heroCard: {
    backgroundColor: COLORS.brand,
    borderRadius: SIZES.radiusLg,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusPill,
    alignSelf: 'flex-start',
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  sparkleIcon: {
    opacity: 0.8,
  },
  sparkleEmoji: {
    fontSize: 16,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  fakeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radiusPill,
    paddingVertical: 7,
    paddingLeft: 16,
    paddingRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fakeInputPlaceholder: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  fakeInputArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionEmoji: {
    fontSize: 18,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.ink,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.brand,
  },
  fraudListContainer: {
    gap: 10,
    paddingVertical: 4,
    paddingRight: 6,
  },
  fraudCard: {
    width: 120,
    borderRadius: SIZES.radiusMd,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  fraudIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  fraudTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 2,
  },
  fraudLessons: {
    fontSize: 11.5,
    color: COLORS.muted,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.greenSoft,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginTop: 4,
  },
  tipIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipIcon: {
    fontSize: 18,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.green,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 12.5,
    color: COLORS.ink,
    lineHeight: 17,
  },
});
