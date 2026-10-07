import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../../constants/theme';
import { getSeverityColors } from '../../constants/data';
import { Chevron, SeverityPill } from './FraudUI';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

/** One row in the fraud list. */
export default function FraudCard({ item, onPress }) {
  const { t } = useTranslation();
  const { theme: COLORS } = useTheme();
  const styles = useThemeStyles(createStyles);
  const severityColors = getSeverityColors(COLORS);
  const tone = severityColors[item.severity] || severityColors.Medium;
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.accent, { backgroundColor: tone.fg }]} />
      <View style={styles.body}>
        <Text style={styles.group}>{t(`fraud.${item.group}`).toUpperCase()}</Text>
        <Text style={styles.title}>{t(`fraud.categories.${item.id}.title`, { defaultValue: item.title })}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {t(`fraud.categories.${item.id}.summary`, { defaultValue: item.summary })}
        </Text>
        <View style={styles.footer}>
          <SeverityPill severity={item.severity} />
        </View>
      </View>
      <View style={styles.chev}>
        <Chevron />
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  accent: { width: 4, alignSelf: 'stretch' },
  body: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
  group: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.8, color: COLORS.muted },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.ink, marginTop: 4 },
  summary: { fontSize: 13, lineHeight: 18, color: COLORS.muted, marginTop: 4 },
  footer: { marginTop: 10 },
  chev: { paddingRight: 16 },
});
