import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Image,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchCyberSecurityNews } from '../services/newsApi';
import BubbleBackground from '../components/BubbleBackground';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';

function NewsCard({ article, onOpenModal, onReadMore }) {
  const { t } = useTranslation();
  const styles = useThemeStyles(createStyles);
  const [imageError, setImageError] = useState(false);
  const fallbackImg =
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => onOpenModal(article)}
    >
      {/* Top Image with overlaid Source Badge */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageError ? fallbackImg : article.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        {/* Source Badge (top right over image) */}
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceBadgeText} numberOfLines={1}>
            {article.sourceName}
          </Text>
        </View>
      </View>

      {/* Card Content Area */}
      <View style={styles.cardBody}>
        {/* Bold Title */}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {article.title}
        </Text>

        {/* Gray Description */}
        <Text style={styles.cardDescription} numberOfLines={3}>
          {article.description}
        </Text>

        {/* Author and Date/Time row */}
        <View style={styles.metaRow}>
          <Text style={styles.authorText} numberOfLines={1}>
            {article.author}
          </Text>
          <Text style={styles.dateText}>{article.formattedDate}</Text>
        </View>

        {/* Blue Read More Button */}
        <TouchableOpacity
          style={styles.readMoreBtn}
          activeOpacity={0.8}
          onPress={() => onReadMore(article)}
        >
          <Text style={styles.readMoreBtnText}>{t('news.readMore')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function NewsScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme: COLORS, isDark } = useTheme();
  const styles = useThemeStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Asynchronous function to fetch strictly cybersecurity news
  const loadNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMsg(null);

    try {
      const data = await fetchCyberSecurityNews();
      setArticles(data);
    } catch (err) {
      console.warn('Error fetching cyber news:', err);
      setErrorMsg(t('news.fetchError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const onRefresh = useCallback(() => {
    loadNews(true);
  }, [loadNews]);

  const handleReadMore = async (article) => {
    if (article.url && article.url.startsWith('http')) {
      try {
        const canOpen = await Linking.canOpenURL(article.url);
        if (canOpen) {
          await Linking.openURL(article.url);
          return;
        }
      } catch (e) {
        console.warn('Unable to open URL via Linking:', e);
      }
    }
    setActiveArticle(article);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BubbleBackground theme={COLORS} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.bg} />

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIcon}>
            <Icon name="newspaper-outline" size={18} color={COLORS.brand} />
          </View>
          <Text style={styles.screenTitle} numberOfLines={1}>
            {t('news.title')}
          </Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{t('common.live')}</Text>
          </View>
        </View>
        <Text style={styles.screenSubtitle}>
          {t('news.subtitle')}
        </Text>
      </View>

      {/* Main Content Area */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.brand} />
          <Text style={styles.loadingText}>{t('news.fetching')}</Text>
        </View>
      ) : (
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
          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Icon name="warning-outline" size={15} color={COLORS.orange} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onOpenModal={setActiveArticle}
              onReadMore={handleReadMore}
            />
          ))}

          {articles.length === 0 && !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="shield-checkmark-outline" size={42} color={COLORS.brand} />
              <Text style={styles.emptyTitle}>{t('news.noAlerts')}</Text>
              <Text style={styles.emptySubtitle}>
                {t('news.empty')}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Article Detail Modal with AI & Source Link */}
      <Modal
        visible={!!activeArticle}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveArticle(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalSourceBadge}>
                <Text style={styles.modalSourceText}>
                  {activeArticle?.sourceName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setActiveArticle(null)}
              >
                <Icon name="close" size={17} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {activeArticle && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalBody}
              >
                <View style={styles.modalImageWrapper}>
                  <Image
                    source={{ uri: activeArticle.imageUrl }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalAuthorText}>
                    {activeArticle.author}
                  </Text>
                  <Text style={styles.modalDateText}>
                    {activeArticle.formattedDate}
                  </Text>
                </View>

                <Text style={styles.modalTitle}>{activeArticle.title}</Text>

                <Text style={styles.modalContentText}>
                  {activeArticle.content || activeArticle.description}
                </Text>

                {/* Open Full Article on Website */}
                {activeArticle.url ? (
                  <TouchableOpacity
                    style={styles.openWebBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      Linking.openURL(activeArticle.url).catch(() => {});
                    }}
                  >
                    <View style={styles.openWebBtnContent}><Icon name="globe-outline" size={16} color={isDark ? COLORS.ink : '#1E293B'} /><Text style={styles.openWebBtnText}>{t('news.fullArticle')}</Text></View>
                  </TouchableOpacity>
                ) : null}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 13,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    flex: 1,
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.redSoft,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.red,
  },
  liveText: {
    color: COLORS.red,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 19,
    marginTop: 8,
    paddingLeft: 46,
  },
  listContainer: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 104,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor:
      COLORS.mode === 'dark' ? COLORS.orangeSoft : '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.mode === 'dark' ? COLORS.orange : '#92400E',
    fontSize: 12,
    fontWeight: '500',
  },

  /* Card Styles - Exact Match to User Screenshot */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.mode === 'dark' ? COLORS.line : '#E8EDF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 185,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor:
      COLORS.mode === 'dark' ? COLORS.brandSoft : '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  sourceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.mode === 'dark' ? COLORS.red : '#DE4343',
    paddingVertical: 3.5,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  sourceBadgeText: {
    color: COLORS.mode === 'dark' ? COLORS.onRed : '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardBody: {
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.mode === 'dark' ? COLORS.ink : '#111827',
    lineHeight: 22,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.mode === 'dark' ? COLORS.muted : '#6B7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mode === 'dark' ? COLORS.ink : '#374151',
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mode === 'dark' ? COLORS.ink : '#374151',
  },
  readMoreBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.mode === 'dark' ? COLORS.brand : '#2563EB',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  readMoreBtnText: {
    color: COLORS.mode === 'dark' ? COLORS.onBrand : '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Empty state */
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Modal Details */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.line,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  modalSourceBadge: {
    backgroundColor: COLORS.mode === 'dark' ? COLORS.red : '#DE4343',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  modalSourceText: {
    color: COLORS.mode === 'dark' ? COLORS.onRed : '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: '700',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalImageWrapper: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor:
      COLORS.mode === 'dark' ? COLORS.brandSoft : '#F1F5F9',
    marginVertical: 12,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalAuthorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.mode === 'dark' ? COLORS.ink : '#374151',
    flex: 1,
    marginRight: 8,
  },
  modalDateText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.mode === 'dark' ? COLORS.ink : '#374151',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.ink,
    lineHeight: 25,
    marginBottom: 12,
  },
  modalContentText: {
    fontSize: 14,
    color: COLORS.mode === 'dark' ? COLORS.ink : '#334155',
    lineHeight: 22,
    marginBottom: 16,
  },
  openWebBtn: {
    backgroundColor:
      COLORS.mode === 'dark' ? COLORS.brandSoft : '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.mode === 'dark' ? COLORS.line : '#E2E8F0',
  },
  openWebBtnText: {
    color: COLORS.mode === 'dark' ? COLORS.ink : '#1E293B',
    fontWeight: '700',
    fontSize: 13.5,
  },
  openWebBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
});
