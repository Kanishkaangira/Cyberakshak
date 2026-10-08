import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';
import { REPORT_REASONS } from '../services/reportService';

export default function ReportModal({
  visible,
  onCancel,
  onSubmit,
  onReportByEmail,
}) {
  const { theme: COLORS } = useTheme();
  const styles = useThemeStyles(createStyles);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submitLock = useRef(false);

  useEffect(() => {
    if (visible) {
      setReason('');
      setDetails('');
      setError('');
      setIsSubmitting(false);
      submitLock.current = false;
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!reason || submitLock.current) return;

    submitLock.current = true;
    setIsSubmitting(true);
    setError('');
    try {
      const submitted = await onSubmit({ reason, details });
      if (!submitted) {
        setError('Could not send report.');
      }
    } catch (submitError) {
      console.warn('[ReportModal] Could not submit report:', submitError);
      setError('Could not send report.');
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  };

  const handleEmailReport = async () => {
    try {
      await onReportByEmail({ reason, details });
    } catch (emailError) {
      console.warn('[ReportModal] Could not open the email app:', emailError);
      setError('Could not open the email app.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Report this answer</Text>
          <Text style={styles.label}>What is the issue?</Text>
          {REPORT_REASONS.map(option => (
            <Pressable
              key={option}
              style={styles.reasonRow}
              onPress={() => setReason(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: reason === option }}
            >
              <View style={styles.radio}>
                {reason === option && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.reasonText}>{option}</Text>
            </Pressable>
          ))}

          <Text style={styles.label}>Additional details (optional)</Text>
          <TextInput
            style={styles.detailsInput}
            value={details}
            onChangeText={setDetails}
            placeholder="Add details to help us review"
            placeholderTextColor={COLORS.muted}
            maxLength={300}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Additional report details"
          />
          <Text style={styles.characterCount}>{details.length}/300</Text>

          {!!error && (
            <View>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                onPress={handleEmailReport}
                disabled={!reason || isSubmitting}
                accessibilityRole="button"
              >
                <Text style={styles.emailLink}>Report by email</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.submitButton,
                (!reason || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!reason || isSubmitting}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.onBrand} />
              ) : (
                <Text style={styles.submitText}>Submit</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = COLORS =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: '#00000066',
    },
    modal: {
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radiusMd,
      padding: 20,
    },
    title: {
      color: COLORS.ink,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16,
    },
    label: {
      color: COLORS.ink,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
    },
    reasonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 36,
      gap: 10,
    },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: COLORS.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: COLORS.brand,
    },
    reasonText: {
      color: COLORS.ink,
      fontSize: 13,
    },
    detailsInput: {
      minHeight: 76,
      borderWidth: 1,
      borderColor: COLORS.line,
      borderRadius: SIZES.radiusSm,
      padding: 10,
      color: COLORS.ink,
      fontSize: 13,
    },
    characterCount: {
      color: COLORS.muted,
      fontSize: 11,
      textAlign: 'right',
      marginTop: 4,
      marginBottom: 8,
    },
    errorText: {
      color: COLORS.red,
      fontSize: 13,
      marginBottom: 6,
    },
    emailLink: {
      color: COLORS.brand,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 12,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      marginTop: 8,
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    cancelText: {
      color: COLORS.muted,
      fontSize: 14,
      fontWeight: '600',
    },
    submitButton: {
      minWidth: 90,
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: SIZES.radiusPill,
      backgroundColor: COLORS.brand,
      paddingHorizontal: 16,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitText: {
      color: COLORS.onBrand,
      fontSize: 14,
      fontWeight: '600',
    },
  });
