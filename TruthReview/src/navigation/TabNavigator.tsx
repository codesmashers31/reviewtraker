import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  useColorScheme, 
  Platform, 
  StyleSheet, 
  Dimensions, 
  Animated 
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

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

// Interactive Tab Item with Scale Animations
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
  const scaleValue = useRef(new Animated.Value(isFocused ? 1.05 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: isFocused ? 1.05 : 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true
    }).start();
  }, [isFocused]);

  let iconName = 'home-outline';

  if (route.name === 'HomeStack') {
    iconName = isFocused ? 'home' : 'home-outline';
  } else if (route.name === 'SearchStack') {
    iconName = isFocused ? 'compass' : 'compass-outline';
  } else if (route.name === 'FavoritesStack') {
    iconName = isFocused ? 'bookmark' : 'bookmark-outline';
  } else if (route.name === 'ProfileStack') {
    iconName = isFocused ? 'person' : 'person-outline';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabItem}
    >
      <Animated.View 
        style={[
          isFocused ? styles.activePill : styles.inactivePill,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <Ionicons 
          name={iconName as any} 
          size={20} 
          color={isFocused ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

// Center Action Button for Adding Review
function CenterActionButton({ onPress }: { onPress: () => void }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pulseAnim, {
      toValue: 0.9,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pulseAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.centerButtonWrapper}
    >
      <Animated.View 
        style={[
          styles.centerButton,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Animated.View>
    </TouchableOpacity>
  );
}

// Custom Floating Tab Bar
function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === 'dark';

  return (
    <View 
      style={[
        styles.floatingContainer,
        {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
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
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeStack" component={HomeNavigator} />
      <Tab.Screen name="SearchStack" component={SearchNavigator} />
      
      {/* Center highlighted Add Review Tab */}
      <Tab.Screen name="AddReviewTab" component={AddReviewLandingScreen} />

      <Tab.Screen name="FavoritesStack" component={FavoritesNavigator} />
      <Tab.Screen name="ProfileStack" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    width: width * 0.9,
    alignSelf: 'center',
    height: 72,
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activePill: {
    backgroundColor: '#14B8A6', // Teal
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activeText: {
    display: 'none',
  },
  inactivePill: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveText: {
    display: 'none',
  },
  centerButtonWrapper: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 99,
  },
  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FF6B6B', // Coral Accent
    justifyContent: 'center',
    alignItems: 'center',
    top: -16,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  }
});
