import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';

/**
 * Bottom sheet for editing the user's name.
 * The parent only controls `visible`; the slide animation is handled here.
 */
export default function EditNameSheet({ visible, initialName, onSave, onClose }) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState(initialName);
  const slide = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setDraft(initialName);
      setMounted(true);
      Animated.timing(slide, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => inputRef.current?.focus());
    } else if (mounted) {
      Keyboard.dismiss();
      Animated.timing(slide, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => finished && setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0 && trimmed !== initialName;
  const save = () => canSave && onSave(trimmed);

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.backdrop, { opacity: slide }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: insets.bottom + 20,
              transform: [
                { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [340, 0] }) },
              ],
            },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Edit name</Text>
          <Text style={styles.subtitle}>This is how your name appears in the app.</Text>

          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="Your name"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
            maxLength={40}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={save}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.saveBtn, !canSave && styles.saveBtnOff]}
              activeOpacity={0.85}
              disabled={!canSave}
              onPress={save}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(29,33,64,0.45)' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.line,
    marginBottom: 18,
  },
  title: { color: COLORS.ink, fontSize: 20, fontWeight: '800' },
  subtitle: { color: COLORS.muted, fontSize: 13.5, marginTop: 4, marginBottom: 20 },
  label: {
    color: COLORS.muted,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    color: COLORS.ink,
    fontSize: 16,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 22 },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: SIZES.radiusPill },
  cancelBtn: { backgroundColor: COLORS.bg },
  cancelText: { color: COLORS.ink, fontSize: 14.5, fontWeight: '700' },
  saveBtn: { backgroundColor: COLORS.brand },
  saveBtnOff: { opacity: 0.4 },
  saveText: { color: '#FFFFFF', fontSize: 14.5, fontWeight: '700' },
});
