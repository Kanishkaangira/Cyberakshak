import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import {
  isEventNotification,
  PENDING_EVENT_NOTIFICATION_KEY,
  registerDeviceForPushNotifications,
  saveDeviceToken,
  showForegroundPushNotification,
} from '../services/pushNotificationService';
import { notifyInboxUpdated } from '../services/notificationsService';

export default function PushNotificationManager({
  onEventNotificationOpened,
}) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'android' || !isSupabaseConfigured()) return undefined;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') return;
      setUserId(session?.user?.id || null);
    });

    const messagingInstance = getMessaging();
    const unsubscribeMessage = onMessage(messagingInstance, (message) => {
      showForegroundPushNotification(message).catch((error) => {
        console.error('[PushNotifications] Could not display notification:', error);
      });
      notifyInboxUpdated();
    });

    const openEventIfNeeded = (message) => {
      if (isEventNotification(message)) onEventNotificationOpened();
    };

    const unsubscribeOpened = onNotificationOpenedApp(
      messagingInstance,
      openEventIfNeeded
    );
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        openEventIfNeeded({ data: detail.notification?.data });
      }
    });

    getInitialNotification(messagingInstance)
      .then(openEventIfNeeded)
      .catch((error) => {
        console.error('[PushNotifications] Could not read initial notification:', error);
      });

    notifee
      .getInitialNotification()
      .then((initialNotification) => {
        if (initialNotification) {
          openEventIfNeeded({ data: initialNotification.notification.data });
        }
      })
      .catch((error) => {
        console.error('[PushNotifications] Could not read initial notification:', error);
      });

    AsyncStorage.getItem(PENDING_EVENT_NOTIFICATION_KEY)
      .then(async (pendingEventNotification) => {
        if (pendingEventNotification !== 'true') return;
        await AsyncStorage.removeItem(PENDING_EVENT_NOTIFICATION_KEY);
        onEventNotificationOpened();
      })
      .catch((error) => {
        console.error('[PushNotifications] Could not restore notification navigation:', error);
      });

    return () => {
      subscription.unsubscribe();
      unsubscribeMessage();
      unsubscribeOpened();
      unsubscribeNotifee();
    };
  }, [onEventNotificationOpened]);

  useEffect(() => {
    if (!userId || Platform.OS !== 'android') return undefined;
    let isActive = true;
    const messagingInstance = getMessaging();

    registerDeviceForPushNotifications(userId).catch((error) => {
      console.error('[PushNotifications] Device registration failed:', error);
    });

    const unsubscribeTokenRefresh = onTokenRefresh(messagingInstance, (token) => {
      if (!isActive) return;
      saveDeviceToken(userId, token).catch((error) => {
        console.error('[PushNotifications] Token refresh registration failed:', error);
      });
    });

    return () => {
      isActive = false;
      unsubscribeTokenRefresh();
    };
  }, [userId]);

  return null;
}
