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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* User Card */}
        <View className="items-center mt-8 mb-6 px-6">
          <View className="relative">
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              }}
              className="h-20 w-20 rounded-full bg-slate-100"
            />
            <View className="absolute bottom-0 right-0 bg-primary-500 border-2 border-white px-2 py-0.5 rounded-full shadow-sm">
              <Text className="text-[9px] text-white font-extrabold uppercase">{user?.role || 'Guest'}</Text>
            </View>
          </View>

          <Text className="text-lg font-extrabold text-slate-800 mt-3">{user?.name || 'Guest User'}</Text>
          <Text className="text-xs text-slate-400 font-semibold mt-0.5">{user?.email || 'email@example.com'}</Text>
        </View>

        {/* Developer Quick Switch Panel */}
        <View className="px-6 mb-6">
          <View className="bg-slate-50 border border-slate-150 rounded-3xl p-4.5">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-3">
              🧪 Tester Role Switcher
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleToggleRole('user')}
                className={`flex-1 py-2 rounded-xl border ${
                  user?.role === 'user' ? 'bg-primary-500 border-primary-500' : 'bg-white border-slate-200'
                }`}
              >
                <Text className={`text-[10px] font-black text-center ${user?.role === 'user' ? 'text-white' : 'text-slate-600'}`}>
                  USER
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleToggleRole('owner')}
                className={`flex-1 py-2 rounded-xl border ${
                  user?.role === 'owner' ? 'bg-primary-500 border-primary-500' : 'bg-white border-slate-200'
                }`}
              >
                <Text className={`text-[10px] font-black text-center ${user?.role === 'owner' ? 'text-white' : 'text-slate-600'}`}>
                  OWNER
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleToggleRole('admin')}
                className={`flex-1 py-2 rounded-xl border ${
                  user?.role === 'admin' ? 'bg-primary-500 border-primary-500' : 'bg-white border-slate-200'
                }`}
              >
                <Text className={`text-[10px] font-black text-center ${user?.role === 'admin' ? 'text-white' : 'text-slate-600'}`}>
                  ADMIN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Dynamic Dashboards & Navigation */}
        <View className="px-6 space-y-3 gap-3">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Navigation Menu</Text>

          {/* Suggest Property */}
          <TouchableOpacity
            className="flex-row justify-between items-center bg-slate-50 border border-slate-150 p-4 rounded-2xl active:bg-slate-100"
            onPress={() => navigation.navigate('AddProperty')}
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 bg-slate-200/50 rounded-xl justify-center items-center">
                <Ionicons name="add" size={18} color="#475569" />
              </View>
              <Text className="text-slate-800 text-xs font-bold ml-3.5">Suggest New Property</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Owner Dashboard link */}
          {user?.role === 'owner' && (
            <TouchableOpacity
              className="flex-row justify-between items-center bg-indigo-50/20 border border-indigo-100/30 p-4 rounded-2xl active:bg-indigo-50/40"
              onPress={() => navigation.navigate('OwnerPanel')}
            >
              <View className="flex-row items-center">
                <View className="h-9 w-9 bg-indigo-50 rounded-xl justify-center items-center">
                  <Ionicons name="business" size={18} color="#4f46e5" />
                </View>
                <Text className="text-indigo-700 text-xs font-bold ml-3.5">Owner Control Panel</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#4f46e5" />
            </TouchableOpacity>
          )}

          {/* Admin Dashboard link */}
          {user?.role === 'admin' && (
            <TouchableOpacity
              className="flex-row justify-between items-center bg-teal-50/20 border border-teal-100/30 p-4 rounded-2xl active:bg-teal-50/40"
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <View className="flex-row items-center">
                <View className="h-9 w-9 bg-teal-50 rounded-xl justify-center items-center">
                  <Ionicons name="settings-outline" size={18} color="#14B8A6" />
                </View>
                <Text className="text-teal-600 text-xs font-bold ml-3.5">Admin Moderation Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#14B8A6" />
            </TouchableOpacity>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row justify-between items-center bg-red-50/25 border border-red-100/30 p-4 rounded-2xl active:bg-red-50/50"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 bg-red-50 rounded-xl justify-center items-center">
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              </View>
              <Text className="text-red-500 text-xs font-bold ml-3.5">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* User own Review History */}
        <View className="px-6 mt-8 mb-10">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">My Submitted Reviews ({myReviews.length})</Text>
          {myReviews.length === 0 ? (
            <View className="bg-slate-50 border border-slate-100 p-6 rounded-2xl items-center">
              <Ionicons name="star-outline" size={32} color="#cbd5e1" />
              <Text className="text-slate-400 text-xs font-bold mt-2">You haven't written any reviews yet.</Text>
            </View>
          ) : (
            myReviews.map((item) => (
              <View key={item.id} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-slate-800 font-extrabold text-xs flex-1 mr-2" numberOfLines={1}>
                    {getPropName(item.propertyId)}
                  </Text>
                  
                  <View className="flex-row items-center">
                    {item.verified ? (
                      <View className="bg-green-50 px-2 py-0.5 rounded-md border border-green-100 mr-2">
                        <Text className="text-[8px] text-green-600 font-black uppercase">Verified Stay</Text>
                      </View>
                    ) : (
                      <View className="bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 mr-2">
                        <Text className="text-[8px] text-amber-600 font-black uppercase">Pending Stay Verify</Text>
                      </View>
                    )}
                    <Ionicons name="star" size={10} color="#f59e0b" />
                    <Text className="text-[10px] font-black text-slate-700 ml-1">{item.ratings.overall}/5</Text>
                  </View>
                </View>

                <Text className="text-slate-500 text-xs font-semibold leading-5">"{item.comment}"</Text>
                <Text className="text-slate-400 text-[9px] font-bold mt-2 text-right">Written: {item.date}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
