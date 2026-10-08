import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../Screens/HomeScreen';
import NewsScreen from '../Screens/NewsScreen';
import EventsScreen from '../Screens/EventsScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import useThemeStyles from '../hooks/useThemeStyles';

const Tab = createBottomTabNavigator();

function renderTabIcon({ focused, name, theme, styles }) {
  const icons = {
    Home: focused ? 'home' : 'home-outline',
    News: focused ? 'newspaper' : 'newspaper-outline',
    Events: focused ? 'calendar' : 'calendar-outline',
    Profile: focused ? 'person' : 'person-outline',
  };

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Icon
        name={icons[name] || 'ellipse-outline'}
        size={20}
        color={focused ? theme.brand : theme.muted}
      />
    </View>
  );
}

export default function HomeBottomNav() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.brand,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [styles.tabBar, { bottom: insets.bottom + 8 }],
        tabBarIcon: ({ focused }) =>
          renderTabIcon({ focused, name: route.name, theme, styles }),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="News" component={NewsScreen} options={{ tabBarLabel: t('tabs.news') }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ tabBarLabel: t('tabs.events') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 26,
    height: 72,
    paddingBottom: 9,
    paddingTop: 8,
    elevation: 14,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  iconContainer: {
    width: 42,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: COLORS.brandSoft,
  },
});
