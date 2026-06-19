import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../features/theme/ThemeContext';

import {
  MainTabParamList,
  HomeStackParamList,
  SearchStackParamList,
  FavoritesStackParamList,
  ProfileStackParamList,
} from './types';
import { RootState } from '../store';

// Core Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Feature Screens
import PGDetailsScreen from '../features/pg/screens/PGDetailsScreen';
import PGReviewsScreen from '../features/review/screens/PGReviewsScreen';
import AddReviewScreen from '../features/review/screens/AddReviewScreen';
import FiltersScreen from '../features/search/screens/FiltersScreen';
import EditProfileScreen from '../features/auth/screens/EditProfileScreen';
import MyReviewsScreen from '../features/review/screens/MyReviewsScreen';
import AddPropertyScreen from '../features/pg/screens/AddPropertyScreen';
import VerifyResidencyScreen from '../features/review/screens/VerifyResidencyScreen';
import AddReviewLandingScreen from '../features/review/screens/AddReviewLandingScreen';

// Owner Screens
import ClaimPropertyScreen from '../features/owner/screens/ClaimPropertyScreen';
import OwnerPanelScreen from '../features/owner/screens/OwnerPanelScreen';

// Admin Screens
import AdminPanelScreen from '../features/admin/screens/AdminPanelScreen';
import ManagePGsScreen from '../features/admin/screens/ManagePGsScreen';
import ManageReviewsScreen from '../features/admin/screens/ManageReviewsScreen';
import ManageUsersScreen from '../features/admin/screens/ManageUsersScreen';
import ManageVerificationsScreen from '../features/admin/screens/ManageVerificationsScreen';
import ManageReportsScreen from '../features/admin/screens/ManageReportsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// 1. Home Navigator Stack
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="PGDetails" component={PGDetailsScreen} />
      <HomeStack.Screen name="PGReviews" component={PGReviewsScreen} />
      <HomeStack.Screen name="AddReview" component={AddReviewScreen} />
      <HomeStack.Screen name="AddProperty" component={AddPropertyScreen} />
      <HomeStack.Screen name="VerifyResidency" component={VerifyResidencyScreen} />
      <HomeStack.Screen name="ClaimProperty" component={ClaimPropertyScreen} />
    </HomeStack.Navigator>
  );
}

// 2. Search Navigator Stack
function SearchNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="Filters" component={FiltersScreen} />
      <SearchStack.Screen name="PGDetails" component={PGDetailsScreen} />
    </SearchStack.Navigator>
  );
}

// 3. Favorites Navigator Stack
function FavoritesNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="Favorites" component={FavoritesScreen} />
      <FavoritesStack.Screen name="PGDetails" component={PGDetailsScreen} />
    </FavoritesStack.Navigator>
  );
}

// 4. Profile Navigator Stack
function ProfileNavigator() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="MyReviews" component={MyReviewsScreen} />
      <ProfileStack.Screen name="AddProperty" component={AddPropertyScreen} />

      {isOwner && (
        <ProfileStack.Screen name="OwnerPanel" component={OwnerPanelScreen} />
      )}

      {isAdmin && (
        <>
          <ProfileStack.Screen name="AdminPanel" component={AdminPanelScreen} />
          <ProfileStack.Screen name="ManagePGs" component={ManagePGsScreen} />
          <ProfileStack.Screen name="ManageReviews" component={ManageReviewsScreen} />
          <ProfileStack.Screen name="ManageUsers" component={ManageUsersScreen} />
          <ProfileStack.Screen name="ManageVerifications" component={ManageVerificationsScreen} />
          <ProfileStack.Screen name="ManageReports" component={ManageReportsScreen} />
        </>
      )}
    </ProfileStack.Navigator>
  );
}

// Interactive Tab Item
function TabBarItem({
  route,
  isFocused,
  onPress,
  isDark
}: {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  isDark: boolean;
}) {
  let iconName = 'home-outline';
  let label = 'Home';

  if (route.name === 'HomeStack') {
    iconName = isFocused ? 'home' : 'home-outline';
    label = 'Home';
  } else if (route.name === 'SearchStack') {
    iconName = isFocused ? 'search' : 'search-outline';
    label = 'Explore';
  } else if (route.name === 'FavoritesStack') {
    iconName = isFocused ? 'heart' : 'heart-outline';
    label = 'Saved';
  } else if (route.name === 'ProfileStack') {
    iconName = isFocused ? 'person' : 'person-outline';
    label = 'Profile';
  }

  const color = isFocused ? '#2563eb' : isDark ? '#94a3b8' : '#64748b'; // blue-600 when focused

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabItem}
    >
      <Ionicons
        name={iconName as any}
        size={24}
        color={color}
      />
      <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '500' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Center Action Button for Adding Review
function CenterActionButton({ onPress, isFocused, isDark }: { onPress: () => void, isFocused: boolean, isDark: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.tabItem}
    >
      <View style={styles.centerButton}>
        <Ionicons name="add" size={24} color="#ffffff" />
      </View>
      <Text style={[styles.tabLabel, { color: isDark ? '#f8fafc' : '#0f172a', fontWeight: '700', marginTop: 4 }]}>
        Add Review
      </Text>
    </TouchableOpacity>
  );
}

// Custom Flat Tab Bar
function FlatTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.tabContainer,
        {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
        }
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'AddReviewTab') {
          return (
            <CenterActionButton
              key={route.key}
              onPress={onPress}
              isFocused={isFocused}
              isDark={isDark}
            />
          );
        }

        return (
          <TabBarItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            isDark={isDark}
          />
        );
      })}
    </View>
  );
}

// Main Navigator Configuration
export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FlatTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeStack" component={HomeNavigator} />
      <Tab.Screen name="SearchStack" component={SearchNavigator} />

      {/* Center Add Review Tab */}
      <Tab.Screen name="AddReviewTab" component={AddReviewLandingScreen} />

      <Tab.Screen name="FavoritesStack" component={FavoritesNavigator} />
      <Tab.Screen name="ProfileStack" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    borderTopWidth: 1,
    alignItems: 'flex-start',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  centerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6', // blue-500
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8, // slight offset upwards
  }
});
