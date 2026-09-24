import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { FRAUD_CATEGORIES, getFraudById } from '../constants/data';
import { Chevron } from '../components/fraud/FraudUI';
import FraudListHeader from '../components/fraud/FraudListHeader';
import FraudCard from '../components/fraud/FraudCard';
import FraudDetail from '../components/fraud/FraudDetail';

export default function FraudEducationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  // Opened from a Home card -> straight to that guide.
  const fromHome = !!route.params?.selectedId;
  const [selectedId, setSelectedId] = useState(route.params?.selectedId || null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (route.params?.selectedId) setSelectedId(route.params.selectedId);
  }, [route.params?.selectedId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedId]);

  const goBack = useCallback(() => {
    if (selectedId && !fromHome) setSelectedId(null);
    else navigation.goBack();
  }, [selectedId, fromHome, navigation]);

  // Android back button: from a guide, return to the list first.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (selectedId && !fromHome) {
          setSelectedId(null);
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [selectedId, fromHome])
  );

  const items = useMemo(
    () =>
      filter === 'all' ? FRAUD_CATEGORIES : FRAUD_CATEGORIES.filter((f) => f.group === filter),
    [filter]
  );
  const fraud = selectedId ? getFraudById(selectedId) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={goBack}>
          <Chevron direction="left" color={COLORS.ink} size={10} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{fraud ? 'Fraud guide' : 'Fraud awareness'}</Text>
          {!fraud && (
            <Text style={styles.headerSubtitle}>
              {FRAUD_CATEGORIES.length} common scams and how to stay safe
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {fraud ? (
          <FraudDetail
            fraud={fraud}
            onCheckMessage={() =>
              navigation.navigate('Chatbot', { initialQuery: `Is this a scam? ${fraud.example}` })
            }
          />
        ) : (
          <>
            <FraudListHeader filter={filter} onFilterChange={setFilter} />
            <View style={styles.list}>
              {items.map((item) => (
                <FraudCard key={item.id} item={item} onPress={() => setSelectedId(item.id)} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.ink },
  headerSubtitle: { fontSize: 12.5, color: COLORS.muted, marginTop: 1 },
  content: { paddingTop: 16 },
  list: { paddingHorizontal: 16, gap: 12 },
});
