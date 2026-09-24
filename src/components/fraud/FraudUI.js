import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';
import { SEVERITY } from '../../constants/data';

/** Shared Ionicons chevron used by fraud cards and detail actions. */
export function Chevron({ direction = 'right', size = 9, color = COLORS.muted, thickness = 2 }) {
  const iconName = {
    right: 'chevron-forward',
    left: 'chevron-back',
    down: 'chevron-down',
  }[direction] || 'chevron-forward';
  return <Icon name={iconName} size={Math.max(size * 2, 16)} color={color} />;
}

/** Coloured pill: Critical / High / Medium risk. */
export function SeverityPill({ severity }) {
  const tone = SEVERITY[severity] || SEVERITY.Medium;
  return (
    <View style={[styles.pill, { backgroundColor: tone.bg }]}>
      <View style={[styles.dot, { backgroundColor: tone.fg }]} />
      <Text style={[styles.text, { color: tone.fg }]}>{severity} risk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: SIZES.radiusPill,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: '700' },
});
