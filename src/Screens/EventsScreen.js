import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { subscribeToEvents, fetchEventsOnce } from '../services/eventsService';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [expandedMap, setExpandedMap] = useState({});
  const [imageErrorMap, setImageErrorMap] = useState({});

  // Real-time Firestore subscription to 'events' collection
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToEvents(
      (eventsList) => {
        setEvents(eventsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching Firestore events:', err);
        setError(err?.message || 'Failed to load events from Firebase');
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Manual pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const refreshedEvents = await fetchEventsOnce();
      setEvents(refreshedEvents);
    } catch (err) {
      console.error('Pull-to-refresh failed:', err);
      setError(err?.message || 'Failed to refresh events');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Toggle description expand/collapse
  const toggleExpand = (eventId) => {
    setExpandedMap((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Dynamically compute unique category filter pills from Firestore data
  const dynamicCategories = Array.from(
    new Set(events.map((e) => e.category).filter(Boolean))
  );
  const filters = ['All', ...dynamicCategories];

  // Filter events based on active pill
  const filteredEvents = events.filter((ev) => {
    if (selectedFilter === 'All') return true;
    return ev.category?.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.screenTitle}>Upcoming events</Text>
          <View style={styles.liveIndicatorBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveIndicatorText}>Live Feed</Text>
          </View>
        </View>
        <Text style={styles.screenSubtitle}>
          Verified cyber safety seminars, webinars & expert workshops
        </Text>
      </View>

      {/* Dynamic Filter Pills */}
      {events.length > 0 && (
        <View style={styles.pillsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsScroll}
          >
            {filters.map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.pill, isSelected && styles.pillActive]}
                  activeOpacity={0.75}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.brand]}
            tintColor={COLORS.brand}
          />
        }
      >
        {/* Loading State */}
        {loading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={COLORS.brand} />
            <Text style={styles.stateTitle}>Loading events...</Text>
            <Text style={styles.stateSubtitle}>
              Connecting to Firestore events collection
            </Text>
          </View>
        )}

        {/* Error State */}
        {!loading && error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Could not load events</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            {error.includes('permissions') && (
              <View style={styles.permissionTipBox}>
                <Text style={styles.permissionTipTitle}>Firebase Security Rules Notice:</Text>
                <Text style={styles.permissionTipText}>
                  Ensure your Cloud Firestore Security Rules allow read access to the 'events' collection (e.g., allow read: if true; in test mode).
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.retryBtn}
              activeOpacity={0.8}
              onPress={onRefresh}
            >
              <Text style={styles.retryBtnText}>🔄 Retry Connection</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <View style={styles.stateContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.stateTitle}>
              No events found
            </Text>
            <Text style={styles.stateSubtitle}>
              There are currently no events matching your criteria in Firestore. Pull down to refresh or check back soon!
            </Text>
            {selectedFilter !== 'All' && (
              <TouchableOpacity
                style={styles.resetFilterBtn}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter('All')}
              >
                <Text style={styles.resetFilterText}>Show All Events</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Dynamic Event Cards */}
        {!loading &&
          !error &&
          filteredEvents.map((ev) => {
            const isExpanded = Boolean(expandedMap[ev.id]);
            const hasImage = Boolean(ev.imageUrl) && !imageErrorMap[ev.id];

            return (
              <View key={ev.id} style={styles.eventCard}>
                {/* Event Image Banner */}
                {hasImage ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: ev.imageUrl }}
                      style={styles.eventImage}
                      resizeMode="cover"
                      onError={() =>
                        setImageErrorMap((prev) => ({ ...prev, [ev.id]: true }))
                      }
                    />
                    <View style={styles.categoryBadgeFloat}>
                      <Text style={styles.categoryBadgeText}>{ev.category}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.fallbackBanner}>
                    <View style={styles.fallbackPatternCircle} />
                    <View style={styles.categoryBadgeStatic}>
                      <Text style={styles.categoryBadgeText}>{ev.category}</Text>
                    </View>
                    <Text style={styles.fallbackIcon}>🛡️</Text>
                  </View>
                )}

                {/* Card Details */}
                <View style={styles.cardContent}>
                  {/* Title */}
                  <Text style={styles.eventTitle}>{ev.title}</Text>

                  {/* Date & Time Row */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>📅</Text>
                      <Text style={styles.metaText}>{ev.date}</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>⏰</Text>
                      <Text style={styles.metaText}>{ev.time}</Text>
                    </View>
                  </View>

                  {/* Venue / Location */}
                  <View style={styles.venueRow}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={styles.venueText} numberOfLines={1}>
                      {ev.venue}
                    </Text>
                  </View>

                  {/* Description */}
                  {Boolean(ev.description) && (
                    <View style={styles.descContainer}>
                      <Text
                        style={styles.descText}
                        numberOfLines={isExpanded ? undefined : 3}
                      >
                        {ev.description}
                      </Text>
                      {ev.description.length > 120 && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => toggleExpand(ev.id)}
                          style={styles.expandBtn}
                        >
                          <Text style={styles.expandBtnText}>
                            {isExpanded ? 'Show less' : 'Read more'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                </View>
              </View>
            );
          })}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusPill,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.green,
  },
  liveIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.green,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  pillsWrap: {
    paddingVertical: 10,
  },
  pillsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  pillActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 170,
    position: 'relative',
    backgroundColor: COLORS.brandSoft,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadgeFloat: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryBadgeStatic: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fallbackBanner: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.brandSoft,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  fallbackPatternCircle: {
    position: 'absolute',
    right: -20,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(75, 79, 224, 0.08)',
  },
  fallbackIcon: {
    position: 'absolute',
    right: 18,
    bottom: 12,
    fontSize: 42,
    opacity: 0.8,
  },
  cardContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
    lineHeight: 23,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaIcon: {
    fontSize: 13,
  },
  metaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.ink,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.muted,
    opacity: 0.5,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  venueText: {
    fontSize: 12.5,
    color: COLORS.muted,
    fontWeight: '500',
    flex: 1,
  },
  descContainer: {
    marginTop: 4,
    marginBottom: 12,
  },
  descText: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 18,
  },
  expandBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand,
  },
  stateContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 18,
  },
  resetFilterBtn: {
    marginTop: 12,
    backgroundColor: COLORS.brandSoft,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusPill,
  },
  resetFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand,
  },
  errorCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: SIZES.radiusMd,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FED7D7',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8,
  },
  errorIcon: {
    fontSize: 32,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.red,
  },
  errorMsg: {
    fontSize: 12.5,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 17,
  },
  permissionTipBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  permissionTipTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.red,
    marginBottom: 3,
  },
  permissionTipText: {
    fontSize: 11,
    color: COLORS.ink,
    lineHeight: 15,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: COLORS.brand,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusPill,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12.5,
  },
});
