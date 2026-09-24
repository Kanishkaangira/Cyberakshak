import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { FRAUD_GROUPS, HELPLINE } from '../../constants/data';
import Icon from 'react-native-vector-icons/Ionicons';

const FILTERS = [{ id: 'all', label: 'All' }, ...FRAUD_GROUPS];

/** Emergency banner (call 1930) + group filter chips shown above the fraud list. */
export default function FraudListHeader({ filter, onFilterChange }) {
  return (
    <>
      <View style={styles.banner}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Lost money to a fraud?</Text>
          <Text style={styles.bannerSub}>
            Report within the first hour to improve the chance of freezing the funds.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bannerBtn}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(`tel:${HELPLINE.number}`).catch(() => {})}
        >
          <View style={styles.bannerBtnContent}>
            <Icon name="call-outline" size={15} color={COLORS.ink} />
            <Text style={styles.bannerBtnText}>Call {HELPLINE.number}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <TouchableOpacity
              key={f.id}
              activeOpacity={0.8}
              onPress={() => onFilterChange(f.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    backgroundColor: COLORS.ink,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerText: { flex: 1 },
  bannerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  bannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12.5, lineHeight: 17, marginTop: 3 },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bannerBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bannerBtnText: { color: COLORS.ink, fontSize: 13, fontWeight: '700' },
  filters: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  chipActive: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  chipTextActive: { color: '#FFFFFF' },
});
