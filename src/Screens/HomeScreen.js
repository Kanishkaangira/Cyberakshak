import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
  DeviceEventEmitter,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { SIZES } from '../constants/theme';
import { FRAUD_CATEGORIES, QUICK_ACTIONS } from '../constants/data';
import { SeverityPill } from '../components/fraud/FraudUI';
import BubbleBackground from '../components/BubbleBackground';
import { getCurrentUserProfile } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';
import {
  getUnreadNotificationCount,
  NOTIFICATIONS_UPDATED_EVENT,
} from '../services/notificationsService';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('');
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const notificationDotOpacity = useRef(new Animated.Value(1)).current;

  const refreshUnreadNotifications = useCallback(async () => {
    try {
      setUnreadNotificationCount(await getUnreadNotificationCount());
    } catch (error) {
      console.error('[HomeScreen] Could not refresh notification count:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshUnreadNotifications();
      const subscription = DeviceEventEmitter.addListener(
        NOTIFICATIONS_UPDATED_EVENT,
        refreshUnreadNotifications
      );
      return () => subscription.remove();
    }, [refreshUnreadNotifications])
  );

  useEffect(() => {
    if (unreadNotificationCount === 0) {
      notificationDotOpacity.setValue(1);
      return undefined;
    }

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(notificationDotOpacity, {
          toValue: 0.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(notificationDotOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, [notificationDotOpacity, unreadNotificationCount]);

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
      <BubbleBackground theme={COLORS} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../assets/cyberakshak-app-icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
                accessibilityLabel="Cyberakshak"
              />
            </View>
            <Text style={styles.brandTitle}>Cyberakshak</Text>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t('notifications.title')}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon name="notifications-outline" size={19} color={COLORS.ink} />
              {unreadNotificationCount > 0 && (
                <Animated.View
                  style={[
                    styles.notificationDot,
                    { opacity: notificationDotOpacity },
                  ]}
                />
              )}
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
          <View pointerEvents="none" style={styles.heroDecorationLarge} />
          <View pointerEvents="none" style={styles.heroDecorationSmall} />
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
                <Icon
                  name={item.icon}
                  size={22}
                  color={
                    item.id === 'link'
                      ? COLORS.orange
                      : item.id === 'report'
                        ? COLORS.red
                        : COLORS.green
                  }
                />
              </View>
              <Text style={styles.actionLabel} numberOfLines={2}>
                {t(item.labelKey)}
              </Text>
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
    paddingHorizontal: 18,
    paddingBottom: 112,
    gap: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.brand,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoIcon: {
    fontSize: 18,
  },
  logoImage: {
    width: 24,
    height: 24,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.red,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  iconText: {
    fontSize: 16,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginTop: 2,
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  userName: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.ink,
    marginTop: 2,
    letterSpacing: -0.4,
  },
  heroCard: {
    backgroundColor: COLORS.brand,
    borderRadius: 26,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.23,
    shadowRadius: 14,
    elevation: 6,
  },
  heroDecorationLarge: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -86,
    right: -50,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  heroDecorationSmall: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    bottom: -48,
    right: 66,
    backgroundColor: 'rgba(255,255,255,0.07)',
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
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 27,
    marginBottom: 5,
  },
  heroSubtitle: {
    color: COLORS.onBrand,
    fontSize: 13,
    marginBottom: 18,
    lineHeight: 18,
  },
  fakeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusPill,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 6,
    minHeight: 48,
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
    width: 34,
    height: 34,
    borderRadius: 17,
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
    gap: 11,
    marginTop: 0,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    minHeight: 104,
    justifyContent: 'center',
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 2,
  },
  actionIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 9,
  },
  actionEmoji: {
    fontSize: 18,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.brand,
  },
  fraudListContainer: {
    gap: 12,
    paddingVertical: 5,
    paddingRight: 8,
  },
  fraudCard: {
    width: 174,
    minHeight: 132,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 15,
    justifyContent: 'space-between',
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    marginTop: 2,
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
