import { Platform } from 'react-native';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AuthorizationStatus,
} from '@notifee/react-native';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const EVENT_NOTIFICATION_CHANNEL_ID = 'event-updates-v2';
export const PENDING_EVENT_NOTIFICATION_KEY =
  'CYBERAKSHAK_PENDING_EVENT_NOTIFICATION';
const NOTIFICATION_COLOR = '#4B4FE0';

export async function registerDeviceForPushNotifications(userId) {
  if (Platform.OS !== 'android' || !isSupabaseConfigured() || !userId) {
    return null;
  }

  const permission = await notifee.requestPermission();
  if (permission.authorizationStatus === AuthorizationStatus.DENIED) {
    return null;
  }

  await notifee.createChannel({
    id: EVENT_NOTIFICATION_CHANNEL_ID,
    name: 'Cyberakshak event updates',
    description: 'Announcements about upcoming cyber safety events.',
    importance: AndroidImportance.HIGH,
  });

  const token = await getToken(getMessaging());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (user?.id !== userId) return null;

  await saveDeviceToken(userId, token);
  return token;
}

export async function saveDeviceToken(userId, token) {
  const { error } = await supabase
    .from('device_tokens')
    .upsert(
      {
        user_id: userId,
        fcm_token: token,
        platform: Platform.OS,
        last_seen: new Date().toISOString(),
      },
      { onConflict: 'user_id,fcm_token' }
    );

  if (error) throw error;
}

export async function removeCurrentDeviceToken() {
  if (Platform.OS !== 'android' || !isSupabaseConfigured()) return;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return;

  const token = await getToken(getMessaging());
  const { error } = await supabase
    .from('device_tokens')
    .delete()
    .eq('user_id', user.id)
    .eq('fcm_token', token);

  if (error) throw error;
}

export async function showForegroundPushNotification(message) {
  const title = message.notification?.title || message.data?.title;
  const body = message.notification?.body || message.data?.body;
  const eventImage =
    message.data?.event_image_url ||
    message.notification?.android?.imageUrl;

  if (!title || !body) {
    console.warn('[PushNotifications] Received a message without a title or body.');
    return;
  }

  await notifee.displayNotification({
    title,
    body,
    data: message.data,
    android: {
      channelId: EVENT_NOTIFICATION_CHANNEL_ID,
      smallIcon: 'ic_notification',
      color: NOTIFICATION_COLOR,
      category: 'event',
      pressAction: { id: 'default' },
      ...(eventImage
        ? {
            style: {
              type: AndroidStyle.BIGPICTURE,
              picture: eventImage,
              title,
              summary: body,
            },
          }
        : {}),
    },
  });
}

export function isEventNotification(message) {
  const data = message?.data || message?.notification?.data;
  return data?.type === 'event' || Boolean(data?.event_id);
}
