import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const READ_NOTIFICATIONS_KEY = 'CYBERAKSHAK_READ_NOTIFICATIONS';
export const NOTIFICATIONS_UPDATED_EVENT = 'cyberakshak:notifications-updated';

export async function fetchNotifications() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, data, sent_at, created_at')
    .eq('audience', 'all')
    .not('sent_at', 'is', null)
    .order('sent_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user?.id || null;
}

async function getReadNotificationIds(userId) {
  const storedIds = await AsyncStorage.getItem(`${READ_NOTIFICATIONS_KEY}:${userId}`);
  if (!storedIds) return [];

  try {
    const parsedIds = JSON.parse(storedIds);
    return Array.isArray(parsedIds) ? parsedIds.filter((id) => typeof id === 'string') : [];
  } catch (error) {
    console.warn('[NotificationsService] Could not parse read notification IDs:', error);
    return [];
  }
}

export async function getUnreadNotificationCount() {
  const userId = await getCurrentUserId();
  if (!userId) return 0;

  const [notifications, readIds] = await Promise.all([
    fetchNotifications(),
    getReadNotificationIds(userId),
  ]);
  const readIdSet = new Set(readIds);
  return notifications.filter((notification) => !readIdSet.has(notification.id)).length;
}

export async function markNotificationsAsSeen(notificationIds) {
  const userId = await getCurrentUserId();
  if (!userId || !notificationIds.length) return;

  const storageKey = `${READ_NOTIFICATIONS_KEY}:${userId}`;
  const existingIds = await getReadNotificationIds(userId);
  const updatedIds = new Set([...existingIds, ...notificationIds]);
  await AsyncStorage.setItem(storageKey, JSON.stringify([...updatedIds]));
}

export function notifyInboxUpdated() {
  DeviceEventEmitter.emit(NOTIFICATIONS_UPDATED_EVENT);
}
