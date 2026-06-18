import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { RootState } from '../store';
import { logout, setCredentials } from '../features/auth/authSlice';
import { storage, STORAGE_KEYS } from '../services/storage';
import { ProfileStackParamList } from '../navigation/types';
import { MockDb, Review, Property } from '../services/mockDb';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const loadProfileData = async () => {
    if (!user) return;
    const revs = await MockDb.getReviews();
    setMyReviews(revs.filter((r) => r.reviewerId === user.id));

    const props = await MockDb.getProperties();
    setProperties(props);
  };

  useEffect(() => {
    if (isFocused && user) {
      loadProfileData();
    }
  }, [user, isFocused]);

  const handleLogout = async () => {
    try {
      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER_INFO);
      dispatch(logout());
      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'You have been successfully logged out.',
        position: 'bottom',
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Developer/Evaluation quick switcher
  const handleToggleRole = async (targetRole: 'user' | 'owner' | 'admin') => {
    if (!user) return;
    
    // Simulate updating user profile
    const updatedUser = {
      ...user,
      role: targetRole,
      name: targetRole === 'admin' ? 'Admin Tester' : targetRole === 'owner' ? 'Owner Tester' : 'Resident Tester',
      email: `${targetRole}@truthreview.com`,
    };

    await storage.setItem(STORAGE_KEYS.USER_INFO, updatedUser);
    dispatch(setCredentials({ user: updatedUser, token: 'mock_jwt_token' }));
    
    Toast.show({
      type: 'success',
      text1: 'Role Switched',
      text2: `You are now logged in as ${targetRole.toUpperCase()}`,
      position: 'bottom',
    });
  };

  const getPropName = (id: string) => {
    return properties.find((p) => p.id === id)?.name || 'Unknown Property';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* User Card */}
        <View className="items-center mt-8 mb-6 px-6">
          <View className="relative">
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              }}
              className="h-20 w-20 rounded-full bg-surface border border-borderSubtle"
            />
            <View className="absolute bottom-0 right-0 bg-accent-500 border-2 border-background px-2 py-0.5 rounded-full shadow-premium-sm">
              <Text className="text-[9px] text-background font-extrabold uppercase">{user?.role || 'Guest'}</Text>
            </View>
          </View>

          <Text className="text-lg font-extrabold text-text mt-3">{user?.name || 'Guest User'}</Text>
          <Text className="text-xs text-textMuted font-semibold mt-0.5">{user?.email || 'email@example.com'}</Text>
        </View>

        {/* Developer Quick Switch Panel */}
        <View className="px-6 mb-6">
          <View className="bg-card border border-borderSubtle rounded-4xl p-5 shadow-premium">
            <Text className="text-[10px] font-black text-textMuted uppercase tracking-widest text-center mb-3">
              🧪 Tester Role Switcher
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleToggleRole('user')}
                className={`flex-1 py-2 rounded-xl border ${
                  user?.role === 'user' ? 'bg-secondary-500 border-secondary-500' : 'bg-surface border-borderSubtle'
                }`}
              >
                <Text className={`text-[10px] font-black text-center ${user?.role === 'user' ? 'text-white' : 'text-textMuted'}`}>
                  USER
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleToggleRole('owner')}
                className={`flex-1 py-2 rounded-xl border ${
                  user?.role === 'owner' ? 'bg-secondary-500 border-secondary-500' : 'bg-surface border-borderSubtle'
                }`}
              >
                <Text className={`text-[10px] font-black text-center ${user?.role === 'owner' ? 'text-white' : 'text-textMuted'}`}>
                  OWNER
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleToggleRole('admin')}
                className={`flex-1 py-2 rounded-xl border ${
                  user?.role === 'admin' ? 'bg-secondary-500 border-secondary-500' : 'bg-surface border-borderSubtle'
                }`}
              >
                <Text className={`text-[10px] font-black text-center ${user?.role === 'admin' ? 'text-white' : 'text-textMuted'}`}>
                  ADMIN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Dynamic Dashboards & Navigation */}
        <View className="px-6 space-y-3 gap-3">
          <Text className="text-xs font-black text-textMuted uppercase tracking-widest mb-1">Navigation Menu</Text>

          {/* Suggest Property */}
          <TouchableOpacity
            className="flex-row justify-between items-center bg-card border border-borderSubtle p-4 rounded-3xl shadow-premium active:opacity-90"
            onPress={() => navigation.navigate('AddProperty')}
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 bg-surface rounded-xl justify-center items-center border border-borderSubtle">
                <Ionicons name="add" size={18} color="#D4A5A5" />
              </View>
              <Text className="text-textBody text-xs font-bold ml-3.5">Suggest New Property</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
          </TouchableOpacity>

          {/* Owner Dashboard link */}
          {user?.role === 'owner' && (
            <TouchableOpacity
              className="flex-row justify-between items-center bg-card border border-borderSubtle p-4 rounded-3xl shadow-premium active:opacity-90"
              onPress={() => navigation.navigate('OwnerPanel')}
            >
              <View className="flex-row items-center">
                <View className="h-9 w-9 bg-surface rounded-xl justify-center items-center border border-borderSubtle">
                  <Ionicons name="business" size={18} color="#D4A5A5" />
                </View>
                <Text className="text-textBody text-xs font-bold ml-3.5">Owner Control Panel</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {/* Admin Dashboard link */}
          {user?.role === 'admin' && (
            <TouchableOpacity
              className="flex-row justify-between items-center bg-card border border-borderSubtle p-4 rounded-3xl shadow-premium active:opacity-90"
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <View className="flex-row items-center">
                <View className="h-9 w-9 bg-surface rounded-xl justify-center items-center border border-borderSubtle">
                  <Ionicons name="settings-outline" size={18} color="#D4A5A5" />
                </View>
                <Text className="text-textBody text-xs font-bold ml-3.5">Admin Moderation Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row justify-between items-center bg-red-950/20 border border-red-900/35 p-4 rounded-3xl shadow-premium active:opacity-90"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 bg-red-950/40 rounded-xl justify-center items-center border border-red-900/25">
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              </View>
              <Text className="text-red-400 text-xs font-bold ml-3.5">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* User own Review History */}
        <View className="px-6 mt-8 mb-10">
          <Text className="text-xs font-black text-textMuted uppercase tracking-widest mb-4">My Submitted Reviews ({myReviews.length})</Text>
          {myReviews.length === 0 ? (
            <View className="bg-card border border-borderSubtle p-6 rounded-3xl items-center shadow-premium">
              <Ionicons name="star-outline" size={32} color="#94A3B8" />
              <Text className="text-textMuted text-xs font-bold mt-2">You haven't written any reviews yet.</Text>
            </View>
          ) : (
            myReviews.map((item) => (
              <View key={item.id} className="bg-card border border-borderSubtle p-5 rounded-3xl mb-4 shadow-premium">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-text font-extrabold text-xs flex-1 mr-2" numberOfLines={1}>
                    {getPropName(item.propertyId)}
                  </Text>
                  
                  <View className="flex-row items-center">
                    {item.verified ? (
                      <View className="bg-accent-500/10 px-2 py-0.5 rounded-md border border-accent-500/20 mr-2">
                        <Text className="text-[8px] text-accent-500 font-black uppercase">Verified Stay</Text>
                      </View>
                    ) : (
                      <View className="bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-900/20 mr-2">
                        <Text className="text-[8px] text-amber-400 font-black uppercase">Pending Stay Verify</Text>
                      </View>
                    )}
                    <Ionicons name="star" size={10} color="#D4A5A5" />
                    <Text className="text-[10px] font-black text-text ml-1">{item.ratings.overall}/5</Text>
                  </View>
                </View>

                <Text className="text-textBody text-xs font-semibold leading-5">"{item.comment}"</Text>
                <Text className="text-textMuted text-[9px] font-bold mt-2 text-right">Written: {item.date}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
}
