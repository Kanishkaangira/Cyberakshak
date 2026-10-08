import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { EventType } from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import {
  isEventNotification,
  PENDING_EVENT_NOTIFICATION_KEY,
} from './src/services/pushNotificationService';
import { name as appName } from './app.json';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (
    type !== EventType.PRESS ||
    !isEventNotification({ data: detail.notification?.data })
  ) {
    return;
  }

  try {
    await AsyncStorage.setItem(PENDING_EVENT_NOTIFICATION_KEY, 'true');
  } catch (error) {
    console.error('[PushNotifications] Could not save notification navigation:', error);
  }
});

AppRegistry.registerComponent(appName, () => App);
