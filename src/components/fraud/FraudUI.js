import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SIZES } from '../../constants/theme';
import { getSeverityColors } from '../../constants/data';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

/** Shared Ionicons chevron used by fraud cards and detail actions. */
export function Chevron({ direction = 'right', size = 9, color, thickness = 2 }) {
  const { theme } = useTheme();
  const iconName = {
    right: 'chevron-forward',
    left: 'chevron-back',
    down: 'chevron-down',
  }[direction] || 'chevron-forward';
  return <Icon name={iconName} size={Math.max(size * 2, 16)} color={color || theme.muted} />;
}

/** Coloured pill: Critical / High / Medium risk. */
export function SeverityPill({ severity }) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const tones = getSeverityColors(theme);
  const tone = tones[severity] || tones.Medium;
  return (
    <View style={[styles.pill, { backgroundColor: tone.bg }]}>
      <View style={[styles.dot, { backgroundColor: tone.fg }]} />
      <Text style={[styles.text, { color: tone.fg }]}>{severity} risk</Text>
    </View>
  );
}

const createStyles = () => StyleSheet.create({
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
