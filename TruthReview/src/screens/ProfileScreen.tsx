import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { storage, STORAGE_KEYS } from '../services/storage';
import { ProfileStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';

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

  const menuItems = [
    {
      label: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      label: 'My Reviews',
      icon: 'star-outline',
      onPress: () => navigation.navigate('MyReviews'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* User Card */}
        <View className="items-center mt-10 mb-8 px-6">
          <View className="relative">
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              }}
              className="h-24 w-24 rounded-full bg-slate-100"
            />
            {isAdmin && (
              <View className="absolute bottom-0 right-0 bg-primary-500 border-2 border-white px-2 py-0.5 rounded-full shadow-sm">
                <Text className="text-[10px] text-white font-extrabold uppercase">Admin</Text>
              </View>
            )}
          </View>

          <Text className="text-xl font-extrabold text-slate-800 mt-4">{user?.name || 'Guest User'}</Text>
          <Text className="text-sm text-slate-400 font-semibold mt-1">{user?.email || 'email@example.com'}</Text>
        </View>

        {/* Options list */}
        <View className="px-6 space-y-3 gap-3">
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row justify-between items-center bg-slate-50 border border-slate-100 p-4.5 rounded-2xl active:bg-slate-100"
              onPress={item.onPress}
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 bg-slate-100/60 rounded-xl justify-center items-center">
                  <Ionicons name={item.icon as any} size={20} color="#475569" />
                </View>
                <Text className="text-slate-800 text-sm font-bold ml-4">{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          ))}

          {/* Admin Control Panel (Conditional) */}
          {isAdmin && (
            <TouchableOpacity
              className="flex-row justify-between items-center bg-primary-50/20 border border-primary-100/30 p-4.5 rounded-2xl active:bg-primary-50/40"
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 bg-primary-50 rounded-xl justify-center items-center">
                  <Ionicons name="settings-outline" size={20} color="#0ea5e9" />
                </View>
                <Text className="text-primary-600 text-sm font-bold ml-4">Admin Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#0ea5e9" />
            </TouchableOpacity>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row justify-between items-center bg-red-50/20 border border-red-100/30 p-4.5 rounded-2xl active:bg-red-50/40 mt-4"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 bg-red-50 rounded-xl justify-center items-center">
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              </View>
              <Text className="text-red-500 text-sm font-bold ml-4">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
