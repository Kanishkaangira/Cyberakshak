import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';

const PRIVACY_POLICY_URL = 'https://cyberakshak.vercel.app/privacy/';
const TERMS_URL = 'https://cyberakshak.vercel.app/terms/';
const DISCLAIMER_URL = 'https://cyberakshak.vercel.app/disclaimer/';
const FEEDBACK_URL = 'https://cyberakshak.vercel.app/contact/#form';
const WEBSITE_URL = 'https://cyberakshak.vercel.app/';
const TEAM_URL = 'https://cyberakshak.vercel.app/#team';
const FAQ_URL = 'https://cyberakshak.vercel.app/#faq';
const CYBERCRIME_PORTAL_URL = 'https://cybercrime.gov.in';

function openExternalLink(url, errorMessage) {
  Linking.openURL(url).catch((error) => {
    console.error('[AboutAppScreen] Could not open external link:', error);
    Alert.alert('Unable to open link', errorMessage);
  });
}

function HighlightLink({ icon, label, onPress }) {
  const styles = useThemeStyles(createStyles);
  const { theme: COLORS } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="link"
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.linkRow}
    >
      <View style={styles.linkIcon}>
        <Icon name={icon} size={18} color={COLORS.brand} />
      </View>
      <Text style={styles.linkLabel}>{label}</Text>
      <Icon name="open-outline" size={17} color={COLORS.brand} />
    </TouchableOpacity>
  );
}

export default function AboutAppScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const linkErrorMessage = t('profile.aboutLinkError', {
    defaultValue: 'Please try opening this link again.',
  });
  const externalLinks = [
    {
      icon: 'lock-closed-outline',
      label: t('profile.aboutPrivacyLink', {
        defaultValue: 'Read the Privacy Policy',
      }),
      url: PRIVACY_POLICY_URL,
    },
    {
      icon: 'document-text-outline',
      label: t('profile.aboutTermsLink', {
        defaultValue: 'Read the Terms & Conditions',
      }),
      url: TERMS_URL,
    },
    {
      icon: 'alert-circle-outline',
      label: t('profile.aboutDisclaimerLink', {
        defaultValue: 'Read the Disclaimer',
      }),
      url: DISCLAIMER_URL,
    },
    {
      icon: 'chatbubble-ellipses-outline',
      label: t('profile.aboutFeedbackLink', {
        defaultValue: 'Send feedback or report a problem',
      }),
      url: FEEDBACK_URL,
    },
    {
      icon: 'people-outline',
      label: t('profile.aboutTeamLink', {
        defaultValue: 'Meet the Cyberakshak team',
      }),
      url: TEAM_URL,
    },
    {
      icon: 'help-circle-outline',
      label: t('profile.aboutFaqLink', {
        defaultValue: 'Frequently asked questions',
      }),
      url: FAQ_URL,
    },
    {
      icon: 'globe-outline',
      label: t('profile.aboutWebsiteLink', {
        defaultValue: 'Explore the Cyberakshak website',
      }),
      url: WEBSITE_URL,
    },
  ];
  const contactLinks = [
    {
      icon: 'call-outline',
      label: t('profile.aboutCyberHelpline', {
        defaultValue: 'Call the National Cyber Helpline · 1930',
      }),
      url: 'tel:1930',
    },
    {
      icon: 'alert-outline',
      label: t('profile.aboutEmergencyNumber', {
        defaultValue: 'Emergency services · 112',
      }),
      url: 'tel:112',
    },
    {
      icon: 'shield-checkmark-outline',
      label: t('profile.aboutCybercrimePortal', {
        defaultValue: 'Open the National Cyber Crime Reporting Portal',
      }),
      url: CYBERCRIME_PORTAL_URL,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('common.back', { defaultValue: 'Go back' })}
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={21} color={COLORS.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('profile.aboutApp', { defaultValue: 'About app' })}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeDot} />
            <Text style={styles.heroBadgeText}>
              {t('profile.aboutHeroEyebrow', {
                defaultValue: 'CYBER SAFETY, MADE CLEAR',
              })}
            </Text>
          </View>
          <View style={styles.heroLogo}>
            <Icon name="shield-checkmark" size={38} color={COLORS.onBrand} />
          </View>
          <Text style={styles.heroTitle}>Cyberakshak</Text>
          <Text style={styles.heroSubtitle}>
            {t('profile.aboutTagline', {
              defaultValue: 'Your companion for safer digital life',
            })}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            {t('profile.aboutWhatTitle', { defaultValue: 'About the app' })}
          </Text>
          <Text style={styles.bodyText}>
            {t('profile.aboutWhatBody', {
              defaultValue:
                'Started by students to help close the gap between growing online fraud and public awareness, Cyberakshak makes cyber safety clearer and easier to access. Explore practical scam guides, safety news, events, and an AI assistant for general awareness.',
            })}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>13</Text>
              <Text style={styles.statLabel}>
                {t('profile.aboutGuides', { defaultValue: 'Fraud guides' })}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>
                {t('profile.aboutLanguages', { defaultValue: 'Languages' })}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>1930</Text>
              <Text style={styles.statLabel}>
                {t('profile.aboutHelpline', { defaultValue: 'Cyber helpline' })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactHeading}>
            <View style={styles.contactHeadingIcon}>
              <Icon name="call-outline" size={19} color={COLORS.brand} />
            </View>
            <View style={styles.contactHeadingText}>
              <Text style={styles.sectionTitle}>
                {t('profile.aboutOfficialHelpTitle', {
                  defaultValue: 'Official help when you need it',
                })}
              </Text>
              <Text style={styles.contactIntro}>
                {t('profile.aboutOfficialHelpBody', {
                  defaultValue:
                    'If you have lost money to cyber fraud, report it promptly through official channels.',
                })}
              </Text>
            </View>
          </View>
          {contactLinks.map((link, index) => (
            <React.Fragment key={link.url}>
              {index > 0 && <View style={styles.linkDivider} />}
              <HighlightLink
                icon={link.icon}
                label={link.label}
                onPress={() => openExternalLink(link.url, linkErrorMessage)}
              />
            </React.Fragment>
          ))}
        </View>

        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Icon name="information-circle" size={22} color={COLORS.orange} />
          </View>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>
              {t('profile.aboutIndependentTitle', {
                defaultValue: 'Independent safety guidance',
              })}
            </Text>
            <Text style={styles.noticeText}>
              {t('profile.aboutIndependentBody', {
                defaultValue:
                  'Cyberakshak is an independent app, not a government or law-enforcement service. The assistant does not replace official reporting. If you lose money, contact 1930 and cybercrime.gov.in immediately.',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.linksCard}>
          <Text style={styles.sectionTitle}>
            {t('profile.aboutStayConnected', {
              defaultValue: 'Information and support',
            })}
          </Text>
          <Text style={styles.bodyText}>
            {t('profile.aboutPrivacySummary', {
              defaultValue:
                'We explain what information the app uses and how it is handled in our privacy policy.',
            })}
          </Text>
          {externalLinks.map((link, index) => (
            <React.Fragment key={link.url}>
              {index > 0 && <View style={styles.linkDivider} />}
              <HighlightLink
                icon={link.icon}
                label={link.label}
                onPress={() => openExternalLink(link.url, linkErrorMessage)}
              />
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.footerText}>
          {t('profile.aboutFooter', {
            defaultValue: 'Built with care in India to help everyone stay safer online.',
          })}
        </Text>
      </ScrollView>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  headerTitle: {
    color: COLORS.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 14,
  },
  hero: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 28,
    backgroundColor: COLORS.brand,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 13,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.onBrand,
  },
  heroBadgeText: {
    color: COLORS.onBrand,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    opacity: 0.92,
  },
  heroLogo: {
    width: 72,
    height: 72,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginBottom: 11,
  },
  heroTitle: {
    color: COLORS.onBrand,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    color: COLORS.onBrand,
    opacity: 0.86,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
  },
  infoCard: {
    padding: 19,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    color: COLORS.ink,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  bodyText: {
    color: COLORS.muted,
    fontSize: 13.5,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 17,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 62,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: COLORS.brandSoft,
  },
  statValue: {
    color: COLORS.brand,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 11,
    borderRadius: 22,
    backgroundColor: COLORS.orangeSoft,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  noticeIcon: {
    paddingTop: 1,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  noticeText: {
    color: COLORS.ink,
    opacity: 0.82,
    fontSize: 12.5,
    lineHeight: 19,
  },
  linksCard: {
    padding: 19,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  contactCard: {
    padding: 18,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  contactHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginBottom: 13,
  },
  contactHeadingIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.brandSoft,
  },
  contactHeadingText: {
    flex: 1,
  },
  contactIntro: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -3,
  },
  linkRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: COLORS.brandSoft,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  linkIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  linkLabel: {
    flex: 1,
    color: COLORS.brand,
    fontSize: 13,
    fontWeight: '700',
  },
  linkDivider: {
    height: 10,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});
