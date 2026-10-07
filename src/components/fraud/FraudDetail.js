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
        <Text style={styles.group}>{t(`fraud.${fraud.group}`).toUpperCase()}</Text>
        <Text style={styles.title}>{t(`fraud.categories.${fraud.id}.title`, { defaultValue: fraud.title })}</Text>
        <SeverityPill severity={fraud.severity} />
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
  wrap: { paddingHorizontal: 16, gap: 24 },
  hero: { gap: 10 },
  group: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: COLORS.brand },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '800', color: COLORS.ink },
  overview: { fontSize: 15, lineHeight: 23, color: COLORS.muted, marginTop: 4 },
  section: { gap: 12 },
  sectionLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1, color: COLORS.muted },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  rowText: { flex: 1, fontSize: 14.5, lineHeight: 21, color: COLORS.ink },
  num: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  numText: { fontSize: 12, fontWeight: '700' },
  bullet: { width: 7, height: 7, borderRadius: 4, marginTop: 8, marginLeft: 8 },
  quote: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.orange,
    borderRadius: SIZES.radiusSm,
    padding: 14,
  },
  quoteText: { fontSize: 14.5, lineHeight: 22, color: COLORS.ink, fontStyle: 'italic' },
  victim: { backgroundColor: COLORS.redSoft, borderRadius: SIZES.radiusMd, padding: 16, gap: 12 },
  victimTitle: { fontSize: 16, fontWeight: '700', color: COLORS.red },
  victimActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btn: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: SIZES.radiusPill },
  btnRed: { backgroundColor: COLORS.red },
  btnRedText: { color: COLORS.onRed, fontWeight: '700', fontSize: 14 },
  btnOutline: { borderWidth: 1.5, borderColor: COLORS.red },
  btnOutlineText: { color: COLORS.red, fontWeight: '700', fontSize: 14 },
  assistant: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    gap: 12,
  },
  assistantText: { flex: 1 },
  assistantTitle: { color: COLORS.onBrand, fontSize: 15, fontWeight: '700' },
  assistantSub: {
    color: COLORS.mode === 'dark' ? COLORS.onBrand : 'rgba(255,255,255,0.85)',
    fontSize: 12.5,
    marginTop: 2,
  },
  note: { fontSize: 12, color: COLORS.muted, textAlign: 'center' },
});
