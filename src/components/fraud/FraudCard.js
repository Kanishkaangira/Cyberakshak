import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { SEVERITY, getGroupLabel } from '../../constants/data';
import { Chevron, SeverityPill } from './FraudUI';

/** One row in the fraud list. */
export default function FraudCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.accent, { backgroundColor: SEVERITY[item.severity].fg }]} />
      <View style={styles.body}>
        <Text style={styles.group}>{getGroupLabel(item.group).toUpperCase()}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
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

const styles = StyleSheet.create({
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
