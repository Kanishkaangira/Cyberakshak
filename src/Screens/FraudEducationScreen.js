import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { FRAUD_CATEGORIES } from '../constants/data';

export default function FraudEducationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState(
    route.params?.selectedId || FRAUD_CATEGORIES[0].id
  );

  useEffect(() => {
    if (route.params?.selectedId) {
      setSelectedId(route.params.selectedId);
    }
  }, [route.params?.selectedId]);

  const selectedFraud =
    FRAUD_CATEGORIES.find((f) => f.id === selectedId) || FRAUD_CATEGORIES[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Fraud Awareness Hub</Text>
          <Text style={styles.headerSubtitle}>
            Learn modus operandi & prevention rules
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontal Category Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorScroll}
        >
          {FRAUD_CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedId;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.tabChip,
                  isSelected && styles.tabChipActive,
                  { borderColor: isSelected ? COLORS.brand : COLORS.line },
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedId(cat.id)}
              >
                <Text style={styles.tabIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.tabTitle,
                    isSelected && styles.tabTitleActive,
                  ]}
                >
                  {cat.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Fraud Detailed View */}
        <View style={styles.detailCard}>
          {/* Header Row */}
          <View style={styles.detailHeader}>
            <View
              style={[
                styles.detailIconBox,
                { backgroundColor: selectedFraud.bg },
              ]}
            >
              <Text style={styles.detailIcon}>{selectedFraud.icon}</Text>
            </View>

            <View style={styles.detailMeta}>
              <View style={styles.severityRow}>
                <View
                  style={[
                    styles.severityBadge,
                    {
                      backgroundColor:
                        selectedFraud.severity === 'Critical'
                          ? COLORS.redSoft
                          : COLORS.orangeSoft,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.severityText,
                      {
                        color:
                          selectedFraud.severity === 'Critical'
                            ? COLORS.red
                            : COLORS.orange,
                      },
                    ]}
                  >
                    {selectedFraud.severity} Risk
                  </Text>
                </View>
                <Text style={styles.lessonCountText}>{selectedFraud.lessons}</Text>
              </View>

              <Text style={styles.detailTitle}>{selectedFraud.title}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.overviewText}>{selectedFraud.desc}</Text>

          {/* How Scammers Execute It */}
          <View style={styles.sectionBlock}>
            <Text style={styles.blockHeading}>⚠️ How It Works (Modus Operandi)</Text>
            <Text style={styles.blockBody}>{selectedFraud.howItWorks}</Text>
          </View>

          {/* Real-World Example */}
          <View style={styles.exampleBox}>
            <Text style={styles.exampleLabel}>💬 Typical Scam Script</Text>
            <Text style={styles.exampleText}>{selectedFraud.example}</Text>
          </View>

          {/* Red Flags Checklist */}
          <View style={styles.sectionBlock}>
            <Text style={styles.blockHeading}>🚩 Warning Signs & Red Flags</Text>
            {selectedFraud.redFlags.map((flag, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.redDot}>•</Text>
                <Text style={styles.listText}>{flag}</Text>
              </View>
            ))}
          </View>

          {/* Prevention Guidelines */}
          <View style={styles.sectionBlock}>
            <Text style={styles.blockHeading}>🛡️ How to Protect Yourself</Text>
            {selectedFraud.prevention.map((item, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.greenCheck}>✓</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Test With AI Chatbot Button */}
          <TouchableOpacity
            style={styles.testAiBtn}
            activeOpacity={0.85}
            onPress={() => {
              navigation.navigate('Chatbot', {
                initialQuery: `Can you check this ${selectedFraud.title} message: ${selectedFraud.example}`,
              });
            }}
          >
            <Text style={styles.testAiBtnIcon}>🤖</Text>
            <View>
              <Text style={styles.testAiBtnTitle}>Test with Cyberakshak AI</Text>
              <Text style={styles.testAiBtnSub}>
                Simulate how the assistant analyzes this fraud
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    backgroundColor: COLORS.surface,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 26,
    color: COLORS.ink,
    lineHeight: 30,
    marginTop: -2,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  selectorScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderRadius: SIZES.radiusPill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  tabChipActive: {
    backgroundColor: COLORS.brandSoft,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },
  tabTitleActive: {
    color: COLORS.brand,
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    gap: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  detailIconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 30,
  },
  detailMeta: {
    flex: 1,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.radiusPill,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lessonCountText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  detailTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.ink,
  },
  overviewText: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
  },
  sectionBlock: {
    gap: 8,
  },
  blockHeading: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.ink,
  },
  blockBody: {
    fontSize: 13.5,
    color: COLORS.ink,
    lineHeight: 20,
  },
  exampleBox: {
    backgroundColor: '#FFF9ED',
    borderWidth: 1,
    borderColor: '#FFE8B8',
    borderRadius: SIZES.radiusSm,
    padding: 12,
    gap: 6,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.orange,
  },
  exampleText: {
    fontSize: 13,
    color: COLORS.ink,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 2,
  },
  redDot: {
    fontSize: 18,
    lineHeight: 18,
    color: COLORS.red,
  },
  greenCheck: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.green,
    lineHeight: 18,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.ink,
    lineHeight: 18,
  },
  testAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    gap: 12,
    marginTop: 8,
  },
  testAiBtnIcon: {
    fontSize: 24,
  },
  testAiBtnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  testAiBtnSub: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
});
