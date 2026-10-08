import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function BubbleBackground({ theme }) {
  const isDark = theme.mode === 'dark';
  const outline = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(75,79,224,0.10)';
  const styles = createStyles(theme, isDark, outline);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.largeBubble} />
      <View style={styles.leftBubble} />
      <View style={styles.bottomBubble} />
      <View style={styles.smallBubble} />
      <View style={styles.midRightBubble} />
    </View>
  );
}

const createStyles = (theme, isDark, outline) => {
  const bubble = {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: outline,
  };

  return StyleSheet.create({
    largeBubble: {
      ...bubble,
      width: 290,
      height: 290,
      top: -94,
      right: -136,
      backgroundColor: isDark ? theme.brandSoft : '#D8DAFF',
      opacity: isDark ? 0.24 : 0.9,
    },
    leftBubble: {
      ...bubble,
      width: 196,
      height: 196,
      top: 190,
      left: -126,
      backgroundColor: isDark ? theme.greenSoft : '#CFF3E5',
      opacity: isDark ? 0.2 : 0.88,
    },
    bottomBubble: {
      ...bubble,
      width: 250,
      height: 250,
      right: -128,
      bottom: 84,
      backgroundColor: isDark ? theme.orangeSoft : '#FFE4B8',
      opacity: isDark ? 0.18 : 0.9,
    },
    smallBubble: {
      ...bubble,
      width: 76,
      height: 76,
      top: 140,
      right: 30,
      backgroundColor: isDark ? theme.orangeSoft : '#FFD7C8',
      opacity: isDark ? 0.18 : 0.82,
    },
    midRightBubble: {
      ...bubble,
      width: 112,
      height: 112,
      top: 365,
      right: 8,
      backgroundColor: isDark ? theme.brandSoft : '#E3E0FF',
      opacity: isDark ? 0.18 : 0.84,
    },
  });
};
