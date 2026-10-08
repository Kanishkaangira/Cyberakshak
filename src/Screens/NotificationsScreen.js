import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { SIZES } from '../constants/theme';
import {
  fetchNotifications,
  markNotificationsAsSeen,
} from '../services/notificationsService';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';

export default function NotificationsScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    setError('');
    try {
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
      await markNotificationsAsSeen(fetchedNotifications.map(({ id }) => id));
    } catch (loadError) {
      console.error('[NotificationsScreen] Could not load notifications:', loadError);
      setError(loadError.message || t('notifications.loadFailed'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  const openNotification = (item) => {
    if (item.data?.type === 'event' || item.data?.event_id) {
      navigation.navigate('MainTabs', { screen: 'Events' });
    }
  };

  const renderNotification = ({ item }) => {
    const date = item.sent_at || item.created_at;
    const formattedDate = date
      ? new Date(date).toLocaleString()
      : '';

    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.8}
        onPress={() => openNotification(item)}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <Icon name="calendar-outline" size={20} color={COLORS.brand} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
          {!!formattedDate && <Text style={styles.cardDate}>{formattedDate}</Text>}
        </View>
        <Icon name="chevron-forward" size={18} color={COLORS.muted} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={21} color={COLORS.ink} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>{t('notifications.title')}</Text>
          <Text style={styles.subtitle}>{t('notifications.subtitle')}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={COLORS.brand} />
          <Text style={styles.stateText}>{t('notifications.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Icon name="cloud-offline-outline" size={34} color={COLORS.muted} />
          <Text style={styles.stateTitle}>{t('notifications.loadFailed')}</Text>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadNotifications}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={[
            styles.list,
            notifications.length === 0 && styles.emptyList,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.brand]}
              tintColor={COLORS.brand}
            />
          }
          ListEmptyComponent={
            <View style={styles.state}>
              <Icon name="notifications-off-outline" size={38} color={COLORS.muted} />
              <Text style={styles.stateTitle}>{t('notifications.emptyTitle')}</Text>
              <Text style={styles.stateText}>{t('notifications.emptyMessage')}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 3,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    color: COLORS.ink,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  cardBody: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  cardDate: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 8,
  },
  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 28,
  },
  stateTitle: {
    color: COLORS.ink,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  stateText: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.brand,
  },
  retryText: {
    color: COLORS.onBrand,
    fontSize: 14,
    fontWeight: '700',
  },
});
