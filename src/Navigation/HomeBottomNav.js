import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import NewsScreen from '../Screens/NewsScreen';
import EventsScreen from '../Screens/EventsScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ focused, name }) {
  let emoji = '🏠';
  if (name === 'News') emoji = '📰';
  if (name === 'Events') emoji = '📅';
  if (name === 'Profile') emoji = '👤';

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
        {emoji}
      </Text>
    </View>
  );
}

export default function HomeBottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} name={route.name} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
    elevation: 8,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: COLORS.brandSoft,
  },
  iconText: {
    fontSize: 18,
    opacity: 0.65,
  },
  iconTextFocused: {
    opacity: 1,
  },
});
