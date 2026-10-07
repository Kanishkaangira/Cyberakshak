import React, { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { SIZES } from '../constants/theme';
import { FRAUD_CATEGORIES, QUICK_ACTIONS } from '../constants/data';
import { SeverityPill } from '../components/fraud/FraudUI';
import { getCurrentUserProfile } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    let isMounted = true;
    getCurrentUserProfile().then((profile) => {
      if (isMounted && profile?.full_name) {
        setUserName(profile.full_name);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const firstLetter = userName.trim() ? userName.trim()[0].toUpperCase() : 'U';

  const handleQuickAction = (action) => {
    if (action === 'check_link') {
      navigation.navigate('Chatbot', { initialQuery: t('home.checkLinkQuestion') });
    } else if (action === 'report_fraud') {
      Alert.alert(
        t('home.reportTitle'),
        t('home.reportMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('home.call1930'),
            onPress: () => Linking.openURL('tel:1930').catch(() => {}),
          },
          {
            text: t('home.askChatbot'),
            onPress: () => navigation.navigate('Chatbot', { initialQuery: t('home.lostMoney') }),
          },
        ]
      );
    } else if (action === 'call_helpline') {
      Alert.alert(
        t('home.helplineTitle'),
        t('home.helplineMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('home.dial1930'), onPress: () => Linking.openURL('tel:1930').catch(() => {}) },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Icon name="shield-checkmark" size={20} color={COLORS.onBrand} />
            </View>
            <Text style={styles.brandTitle}>Cyberakshak</Text>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  t('home.alertsTitle'),
                  t('home.alertsMessage')
                )
              }
            >
              <Icon name="notifications-outline" size={19} color={COLORS.ink} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.avatarLetter}>{firstLetter}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.welcomeText}>{t('home.welcomeBack')}</Text>
          <Text style={styles.userName}>{t('home.hello', { name: userName || t('home.user') })}</Text>
        </View>

        {/* Hero Card: AI Safety Assistant */}
        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{t('home.assistant')}</Text>
            </View>
            <View style={styles.sparkleIcon}>
              <Icon name="sparkles-outline" size={19} color={COLORS.onBrand} />
            </View>
          </View>

          <Text style={styles.heroTitle}>{t('home.gotSuspicious')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('home.askCyberakshak')}
          </Text>

          <View style={styles.fakeInput}>
            <Text style={styles.fakeInputPlaceholder}>{t('home.messagePlaceholder')}</Text>
            <View style={styles.fakeInputArrow}>
              <Icon name="arrow-forward" size={16} color={COLORS.onBrand} />
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
              <View
                style={[
                  styles.actionIconContainer,
                  {
                    backgroundColor:
                      item.id === 'link'
                        ? COLORS.orangeSoft
                        : item.id === 'report'
                          ? COLORS.redSoft
                          : COLORS.greenSoft,
                  },
                ]}
              >
                <Icon name={item.icon} size={21} color={COLORS.ink} />
              </View>
              <Text style={styles.actionLabel}>{t(item.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Learn About Frauds Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.learnFrauds')}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('FraudEducation')}
          >
            <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
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
              style={styles.fraudCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('FraudEducation', { selectedId: item.id })
              }
            >
              <SeverityPill severity={item.severity} />
              <Text style={styles.fraudTitle} numberOfLines={2}>
                {t(`fraud.categories.${item.id}.title`, item.title)}
              </Text>
              <Text style={styles.fraudLessons}>{t('home.readGuide')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tip of the Day */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconBadge}>
            <Icon name="bulb-outline" size={20} color={COLORS.green} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>{t('home.tipTitle')}</Text>
            <Text style={styles.tipText}>
              {t('home.tipMessage')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 104,
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
    color: COLORS.onBrand,
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
    color: COLORS.onBrand,
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
    color: COLORS.onBrand,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: COLORS.onBrand,
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  fakeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
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
    color: COLORS.onBrand,
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
    width: 150,
    minHeight: 112,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 12,
    justifyContent: 'space-between',
  },
  fraudTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 10,
    marginBottom: 6,
  },
  fraudLessons: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brand,
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
    backgroundColor: COLORS.surface,
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
