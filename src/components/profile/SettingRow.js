import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/theme';

/** One row inside a settings card. Pass `onPress` for a tappable row, or `right` for a custom control (e.g. Switch). */
export default function SettingRow({ icon, title, value, onPress, right, last }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[styles.row, last && styles.rowLast]}
      {...(onPress ? { onPress, activeOpacity: 0.75 } : {})}
    >
      <View style={styles.icon}>
        <Icon name={icon} size={19} color={COLORS.brand} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {right || (onPress ? <Icon name="chevron-forward" size={18} color={COLORS.muted} /> : null)}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  rowLast: { borderBottomWidth: 0 },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandSoft,
  },
  title: { flex: 1, color: COLORS.ink, fontSize: 14.5, fontWeight: '600' },
  value: { color: COLORS.muted, fontSize: 13 },
});
