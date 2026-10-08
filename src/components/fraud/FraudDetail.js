import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../../constants/theme';
import { HELPLINE } from '../../constants/data';
import Icon from 'react-native-vector-icons/Ionicons';
import { Chevron, SeverityPill } from './FraudUI';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';
import { useTranslation } from 'react-i18next';

function Section({ title, children }) {
  const { t } = useTranslation();
  const styles = useThemeStyles(createStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{t(title).toUpperCase()}</Text>
      {children}
    </View>
  );
}

function NumberedList({ items, tone }) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const textTone = tone || theme.ink;
  return items.map((text, i) => (
    <View key={i} style={styles.row}>
      <View style={[styles.num, { borderColor: textTone }]}>
        <Text style={[styles.numText, { color: textTone }]}>{i + 1}</Text>
      </View>
      <Text style={styles.rowText}>{text}</Text>
    </View>
  ));
}

function BulletList({ items, color }) {
  const styles = useThemeStyles(createStyles);
  return items.map((text, i) => (
    <View key={i} style={styles.row}>
      <View style={[styles.bullet, { backgroundColor: color }]} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  ));
}

/** Full guide for one fraud type. */
export default function FraudDetail({ fraud, onCheckMessage }) {
  const { t } = useTranslation();
  const { theme: COLORS } = useTheme();
  const styles = useThemeStyles(createStyles);
  const call = () => Linking.openURL(`tel:${HELPLINE.number}`).catch(() => {});
  const report = () => Linking.openURL(HELPLINE.portal).catch(() => {});

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.group}>
            {t(`fraud.${fraud.group}`).toUpperCase()}
          </Text>
          <SeverityPill severity={fraud.severity} />
        </View>
        <Text style={styles.title}>
          {t(`fraud.categories.${fraud.id}.title`, {
            defaultValue: fraud.title,
          })}
        </Text>
        <Text style={styles.overview}>{t(`fraud.categories.${fraud.id}.overview`, { defaultValue: fraud.overview })}</Text>
      </View>

      <Section title="fraud.howWorks">
        <NumberedList items={t(`fraud.categories.${fraud.id}.howItWorks`, { returnObjects: true, defaultValue: fraud.howItWorks })} />
      </Section>

      <Section title="fraud.messageLooks">
        <View style={styles.quote}>
          <Text style={styles.quoteText}>“{t(`fraud.categories.${fraud.id}.example`, { defaultValue: fraud.example })}”</Text>
        </View>
      </Section>

      <Section title="fraud.warningSigns">
        <BulletList items={t(`fraud.categories.${fraud.id}.redFlags`, { returnObjects: true, defaultValue: fraud.redFlags })} color={COLORS.red} />
      </Section>

      <Section title="fraud.protect">
        <BulletList items={t(`fraud.categories.${fraud.id}.protect`, { returnObjects: true, defaultValue: fraud.protect })} color={COLORS.green} />
      </Section>

      <View style={styles.victim}>
        <Text style={styles.victimTitle}>{t('fraud.ifHappened')}</Text>
        <NumberedList items={t(`fraud.categories.${fraud.id}.ifVictim`, { returnObjects: true, defaultValue: fraud.ifVictim })} tone={COLORS.red} />
        <View style={styles.victimActions}>
          <TouchableOpacity style={[styles.btn, styles.btnRed]} activeOpacity={0.85} onPress={call}>
            <Icon name="call-outline" size={16} color={COLORS.onRed} />
            <Text style={styles.btnRedText}>{t('fraud.call', { number: HELPLINE.number })}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            activeOpacity={0.85}
            onPress={report}
          >
            <Icon name="globe-outline" size={16} color={COLORS.red} />
            <Text style={styles.btnOutlineText}>{t('fraud.reportOnline')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.assistant} activeOpacity={0.9} onPress={onCheckMessage}>
        <Icon name="chatbubble-ellipses-outline" size={22} color={COLORS.onBrand} />
        <View style={styles.assistantText}>
          <Text style={styles.assistantTitle}>{t('fraud.gotMessage')}</Text>
          <Text style={styles.assistantSub}>{t('fraud.pasteToCheck')}</Text>
        </View>
        <Chevron color={COLORS.onBrand} size={10} />
      </TouchableOpacity>

      <Text style={styles.note}>
        {t('fraud.awarenessNote', { number: HELPLINE.number })}
      </Text>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  wrap: { paddingHorizontal: 16, gap: 16 },
  hero: {
    backgroundColor: COLORS.brandSoft,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 20,
    gap: 12,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  group: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.brand,
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.ink,
  },
  overview: {
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.ink,
    opacity: 0.82,
    marginTop: 1,
  },
  section: {
    gap: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.brand,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  rowText: { flex: 1, fontSize: 14.5, lineHeight: 22, color: COLORS.ink },
  num: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: COLORS.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -2,
  },
  numText: { fontSize: 12, fontWeight: '800' },
  bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 7, marginLeft: 5 },
  quote: {
    backgroundColor: COLORS.orangeSoft,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
    borderRadius: 14,
    padding: 16,
  },
  quoteText: {
    fontSize: 14.5,
    lineHeight: 22,
    color: COLORS.ink,
    fontStyle: 'italic',
  },
  victim: {
    backgroundColor: COLORS.redSoft,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    gap: 14,
  },
  victimTitle: { fontSize: 17, fontWeight: '800', color: COLORS.red },
  victimActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 2 },
  btn: {
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRadius: SIZES.radiusPill,
  },
  btnRed: { backgroundColor: COLORS.red },
  btnRedText: { color: COLORS.onRed, fontWeight: '700', fontSize: 14 },
  btnOutline: { borderWidth: 1.5, borderColor: COLORS.red },
  btnOutlineText: { color: COLORS.red, fontWeight: '700', fontSize: 14 },
  assistant: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    elevation: 3,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  assistantText: { flex: 1 },
  assistantTitle: { color: COLORS.onBrand, fontSize: 15, fontWeight: '700' },
  assistantSub: {
    color: COLORS.mode === 'dark' ? COLORS.onBrand : 'rgba(255,255,255,0.85)',
    fontSize: 12.5,
    marginTop: 2,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.muted,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
});
