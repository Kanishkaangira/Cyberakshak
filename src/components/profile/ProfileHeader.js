import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';

const getInitials = (fullName) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

/** Purple header: initials avatar, name + Edit button, read-only email. */
export default function ProfileHeader({ name, email, onEdit }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.hero, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.avatarRing}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <TouchableOpacity style={styles.editPill} activeOpacity={0.8} onPress={onEdit}>
          <Icon name="create-outline" size={14} color="#FFFFFF" />
          <Text style={styles.editPillText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emailRow}>
        <Icon name="mail-outline" size={14} color="rgba(255,255,255,0.8)" />
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginBottom: 20 },
  avatarRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.brand, fontSize: 32, fontWeight: '800' },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  name: { flexShrink: 1, color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: SIZES.radiusPill,
  },
  editPillText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  email: { color: 'rgba(255,255,255,0.85)', fontSize: 13.5 },
});
