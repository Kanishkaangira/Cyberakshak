import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZES } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

/**
 * Bottom sheet for editing the user's name.
 * Stays floating cleanly above soft keyboard.
 */
export default function EditNameSheet({ visible, initialName, onSave, onClose }) {
  const { theme: COLORS } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(initialName || '');
  const slide = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setDraft(initialName || '');
      Animated.timing(slide, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Keyboard.dismiss();
      slide.setValue(0);
    }
  }, [visible, initialName, slide]);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0 && trimmed !== initialName;
  const save = () => canSave && onSave(trimmed);

  return (
    <Modal
      transparent
      visible={!!visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'android' ? -20 : 0}
      >
        {/* Backdrop (dismisses keyboard/modal when explicitly tapped) */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: slide }]} />
        </TouchableWithoutFeedback>

        {/* Sheet Content */}
        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom + 20, 24),
              transform: [
                {
                  translateY: slide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [360, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Edit name</Text>
          <Text style={styles.subtitle}>
            This is how your name appears in CyberAkshak.
          </Text>

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

const createStyles = (COLORS) => StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(29,33,64,0.45)' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 24,
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
  saveText: { color: COLORS.onBrand, fontSize: 14.5, fontWeight: '700' },
});
