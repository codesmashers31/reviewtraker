import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';

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

// Admin Screens
import AdminPanelScreen from '../features/admin/screens/AdminPanelScreen';
import ManagePGsScreen from '../features/admin/screens/ManagePGsScreen';
import ManageReviewsScreen from '../features/admin/screens/ManageReviewsScreen';
import ManageUsersScreen from '../features/admin/screens/ManageUsersScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// 1. Home Stack Navigator
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="PGDetails" component={PGDetailsScreen} />
      <HomeStack.Screen name="PGReviews" component={PGReviewsScreen} />
      <HomeStack.Screen name="AddReview" component={AddReviewScreen} />
    </HomeStack.Navigator>
  );
}

// 2. Search Stack Navigator
function SearchNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="Filters" component={FiltersScreen} />
      <SearchStack.Screen name="PGDetails" component={PGDetailsScreen} />
    </SearchStack.Navigator>
  );
}

// 3. Favorites Stack Navigator
function FavoritesNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="Favorites" component={FavoritesScreen} />
      <FavoritesStack.Screen name="PGDetails" component={PGDetailsScreen} />
    </FavoritesStack.Navigator>
  );
}

// 4. Profile Stack Navigator (contains Admin check)
function ProfileNavigator() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="MyReviews" component={MyReviewsScreen} />
      {isAdmin && (
        <>
          <ProfileStack.Screen name="AdminPanel" component={AdminPanelScreen} />
          <ProfileStack.Screen name="ManagePGs" component={ManagePGsScreen} />
          <ProfileStack.Screen name="ManageReviews" component={ManageReviewsScreen} />
          <ProfileStack.Screen name="ManageUsers" component={ManageUsersScreen} />
        </>
      )}
    </ProfileStack.Navigator>
  );
}

// 5. Main Tab Navigator
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchStack') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'FavoritesStack') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9', // primary sky-500
        tabBarInactiveTintColor: '#64748b', // slate-500
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeNavigator}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchNavigator}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="FavoritesStack"
        component={FavoritesNavigator}
        options={{ tabBarLabel: 'Favorites' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
