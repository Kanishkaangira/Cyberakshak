import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UPCOMING_EVENTS } from '../constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'CYBERAKSHAK_EVENTS_CACHE';
const EVENTS_STORAGE_BUCKET = 'Events';
let cachedEvents = null;

/** Resolve a direct image URL or an object path from the Events storage bucket. */
export function resolveEventImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  let imageUrl = value.trim();
  imageUrl = imageUrl.replace(
    /^https?:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/([^/]+)\/(.+)$/i,
    'https://raw.githubusercontent.com/$1/$2/$3'
  );

  // Keep existing external URLs working. Plain values are treated as Storage paths.
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (!isSupabaseConfigured()) return '';

  let objectPath = imageUrl.replace(/^\/+/, '');
  const bucketPrefix = `${EVENTS_STORAGE_BUCKET}/`;
  if (objectPath.toLowerCase().startsWith(bucketPrefix.toLowerCase())) {
    objectPath = objectPath.slice(bucketPrefix.length);
  }
  if (!objectPath) return '';

  const { data } = supabase.storage
    .from(EVENTS_STORAGE_BUCKET)
    .getPublicUrl(objectPath);
  return data?.publicUrl || '';
}

/** Convert a Supabase event row or Firestore object into normalized event shape. */
export function normalizeEventDoc(row) {
  const title = row.title ?? row.Title ?? '';
  const description = row.description ?? row.Description ?? '';
  const startsAt = row.starts_at ?? row.startsAt ?? row.date ?? row.Date;
  const location = row.location ?? row.venue ?? row.Venue ?? row.mode ?? '';
  const category = row.category ?? row.Category ?? row.type ?? 'Webinar';
  const imageUrl = row.image_url ?? row.imageUrl ?? row.ImageUrl ?? '';

  const dateValue = startsAt ? new Date(startsAt) : null;
  const validDate = dateValue && !Number.isNaN(dateValue.getTime());

  const normalizedImageUrl = resolveEventImageUrl(imageUrl);

  return {
    id: String(row.id || Math.random()),
    title: typeof title === 'string' ? title : '',
    description: typeof description === 'string' ? description : '',
    date: validDate ? dateValue.toLocaleDateString() : '',
    day: validDate ? String(dateValue.getDate()).padStart(2, '0') : (row.day || '--'),
    month: validDate
      ? dateValue.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      : (row.month || '---'),
    time: row.time || (validDate ? dateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
    venue: typeof location === 'string' ? location : '',
    category: typeof category === 'string' ? category : '',
    imageUrl: normalizedImageUrl,
    registrationUrl: row.registration_url || '',
  };
}

/** Subscribe to live changes or poll Supabase events table. */
export function subscribeToEvents(onEventsUpdate, onError) {
  fetchEventsOnce()
    .then(onEventsUpdate)
    .catch((err) => {
      if (onError) onError(err);
      onEventsUpdate(getFallbackEvents());
    });

  if (!isSupabaseConfigured()) {
    return () => {};
  }

  // Subscribe to real-time changes on published events
  const channel = supabase
    .channel('public:events')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'events', filter: 'status=eq.published' },
      () => {
        fetchEventsOnce().then(onEventsUpdate).catch(() => {});
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Fetch published events once from Supabase DB, with cache fallback. */
export async function fetchEventsOnce() {
  if (!isSupabaseConfigured()) {
    return getFallbackEvents();
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('starts_at', { ascending: true });

    if (error) throw error;

    if (Array.isArray(data) && data.length > 0) {
      const normalized = data.map(normalizeEventDoc);
      cachedEvents = normalized;
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(normalized)).catch(() => {});
      return normalized;
    }

    return getFallbackEvents();
  } catch (err) {
    console.warn('[EventsService] Fetch failed, returning cached/fallback events:', err.message);
    return getFallbackEvents();
  }
}

/** Helper to get cached events or bundled static UPCOMING_EVENTS fallback */
function getFallbackEvents() {
  if (cachedEvents && cachedEvents.length > 0) {
    return cachedEvents;
  }
  return UPCOMING_EVENTS.map(normalizeEventDoc);
}
