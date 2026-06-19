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
import { useTheme } from '../features/theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

const BADGES = [
  { id: 1, title: 'First Review', sub: 'Wrote your first review', icon: 'star', color: '#f59e0b', bg: '#fef3c7', earned: true },
  { id: 2, title: 'Local Guide', sub: 'Reviewed 5+ places', icon: 'location', color: '#3b82f6', bg: '#dbeafe', earned: false },
  { id: 3, title: 'Trust Builder', sub: 'Got 10 helpful votes', icon: 'shield-checkmark', color: '#10b981', bg: '#d1fae5', earned: false },
  { id: 4, title: 'Explorer', sub: 'Visited 3 cities', icon: 'compass', color: '#8b5cf6', bg: '#ede9fe', earned: false },
];

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
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

  const handleToggleRole = async (targetRole: 'user' | 'owner' | 'admin') => {
    if (!user) return;
    const updatedUser = {
      ...user,
      role: targetRole,
      name: targetRole === 'admin' ? 'Admin Tester' : targetRole === 'owner' ? 'Owner Tester' : 'Demo Account',
      email: `${targetRole}@truthreview.com`,
    };
    await storage.setItem(STORAGE_KEYS.USER_INFO, updatedUser);
    dispatch(setCredentials({ user: updatedUser, token: 'mock_jwt_token' }));
    Toast.show({ type: 'success', text1: 'Role Switched', text2: `You are now ${targetRole.toUpperCase()}`, position: 'bottom' });
  };

  const getPropName = (id: string) => properties.find((p) => p.id === id)?.name || 'Unknown Property';

  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const textDark = isDark ? 'text-white' : 'text-[#0f172a]';
  const bgStyles = isDark ? 'bg-[#0f172a]' : 'bg-[#f8faff]';

  return (
    <SafeAreaView className={`flex-1 ${bgStyles}`} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── HEADER ── */}
        <View className={`${isDark ? 'bg-slate-900' : 'bg-white'} px-5 pt-6 pb-6 border-b border-slate-100`}>
          <View className="flex-row justify-end mb-4">
            <TouchableOpacity
              onPress={() => Toast.show({ type: 'info', text1: 'Settings', text2: 'Coming soon!' })}
              className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="settings" size={20} color="#1d4ed8" />
            </TouchableOpacity>
          </View>

          {/* Avatar + Role Badge */}
          <View className="items-center mb-4">
            <View className="relative">
              <Image
                source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg shadow-blue-100"
              />
              <View className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#1d4ed8] px-3 py-0.5 rounded-full shadow-md">
                <Text className="text-[9px] text-white font-black uppercase tracking-wider">{user?.role || 'user'}</Text>
              </View>
            </View>

            <Text className={`text-[20px] font-black mt-4 tracking-tight ${textDark}`}>{user?.name || 'Demo Account'}</Text>
            <Text className="text-[12px] text-slate-400 font-medium mt-0.5">{user?.email || 'demo@truthreview.com'}</Text>
          </View>

          {/* Profile Stats */}
          <View className={`flex-row rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#f0f9ff] border-blue-100'} p-4 mt-2`}>
            {[
              { label: 'Reviews', value: myReviews.length.toString(), icon: 'star' },
              { label: 'Helpful Votes', value: '24', icon: 'thumbs-up' },
              { label: 'Level', value: 'Lv. 1', icon: 'ribbon' },
            ].map((stat, i) => (
              <View key={i} className="flex-1 items-center">
                {i > 0 && <View className="absolute left-0 top-1 bottom-1 w-px bg-blue-100" />}
                <Ionicons name={stat.icon as any} size={16} color="#1d4ed8" />
                <Text className={`text-[16px] font-black mt-1 ${textDark}`}>{stat.value}</Text>
                <Text className="text-[9px] text-slate-400 font-bold uppercase">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── BADGES / ACHIEVEMENTS ── */}
        <View className="py-5">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-[11px] font-black uppercase tracking-widest text-slate-400">Achievements</Text>
            <TouchableOpacity>
              <Text className="text-[#1d4ed8] text-[11px] font-bold">View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {BADGES.map((badge) => (
              <View
                key={badge.id}
                className={`w-[130px] rounded-2xl border p-4 ${badge.earned
                  ? isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'
                  : isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center mb-3`} style={{ backgroundColor: badge.earned ? badge.bg : '#f1f5f9' }}>
                  <Ionicons name={badge.icon as any} size={18} color={badge.earned ? badge.color : '#94a3b8'} />
                </View>
                <Text className={`text-[11px] font-black mb-0.5 ${badge.earned ? textDark : 'text-slate-400'}`}>{badge.title}</Text>
                <Text className="text-[9px] text-slate-400 font-medium leading-3">{badge.sub}</Text>
                {!badge.earned && (
                  <View className="mt-2 bg-slate-100 rounded-full px-2 py-0.5">
                    <Text className="text-[8px] text-slate-400 font-black uppercase text-center">Locked</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── ROLE SWITCHER ── */}
        <View className="px-5 mb-5">
          <View className={`border rounded-2xl p-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-sm`}>
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-3">
              🧪 Tester Role Switcher
            </Text>
            <View className="flex-row gap-2">
              {(['user', 'owner', 'admin'] as const).map((role) => {
                const isActive = user?.role === role;
                return (
                  <TouchableOpacity
                    key={role}
                    onPress={() => handleToggleRole(role)}
                    className={`flex-1 py-2.5 rounded-xl border ${isActive
                      ? 'bg-[#1d4ed8] border-[#1d4ed8]'
                      : isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className={`text-[10px] font-black text-center uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── NAVIGATION MENU ── */}
        <View className="px-5 mb-5">
          <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Navigation Menu</Text>

          <View className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-sm`}>
            {[
              { label: 'Personal Information', sub: 'Edit your name, photo and bio', icon: 'person-outline', color: '#3b82f6', bg: 'bg-blue-50', onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon!' }) },
              { label: 'Notification Preferences', sub: 'Manage alerts and updates', icon: 'notifications-outline', color: '#6366f1', bg: 'bg-indigo-50', onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon!' }) },
              { label: 'Privacy Settings', sub: 'Control your data & visibility', icon: 'lock-closed-outline', color: '#0ea5e9', bg: 'bg-sky-50', onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon!' }) },
              { label: 'Suggest New Property', sub: 'Help others by adding verified places', icon: 'add-circle-outline', color: '#10b981', bg: 'bg-emerald-50', onPress: () => navigation.navigate('AddProperty') },
            ].map((item, idx, arr) => (
              <TouchableOpacity
                key={idx}
                onPress={item.onPress}
                activeOpacity={0.7}
                className={`flex-row items-center justify-between px-4 py-4 ${idx < arr.length - 1 ? `border-b ${isDark ? 'border-slate-800' : 'border-slate-50'}` : ''}`}
              >
                <View className="flex-row items-center flex-1">
                  <View className={`w-9 h-9 rounded-xl ${item.bg} items-center justify-center`}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className={`text-[13px] font-black ${textDark}`}>{item.label}</Text>
                    <Text className="text-[10px] text-slate-400 font-medium mt-0.5">{item.sub}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Owner/Admin Links */}
          {user?.role === 'owner' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('OwnerPanel')}
              className="flex-row items-center justify-between px-4 py-4 mt-3 border border-indigo-100 rounded-2xl bg-indigo-50 shadow-sm"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-xl bg-indigo-100 items-center justify-center">
                  <Ionicons name="business" size={18} color="#4f46e5" />
                </View>
                <View className="ml-3">
                  <Text className="text-[13px] font-black text-indigo-700">Owner Control Panel</Text>
                  <Text className="text-[10px] text-indigo-400 font-medium mt-0.5">Manage your listed properties</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#4f46e5" />
            </TouchableOpacity>
          )}

          {user?.role === 'admin' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminPanel')}
              className="flex-row items-center justify-between px-4 py-4 mt-3 border border-teal-100 rounded-2xl bg-teal-50 shadow-sm"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-xl bg-teal-100 items-center justify-center">
                  <Ionicons name="settings-outline" size={18} color="#14B8A6" />
                </View>
                <View className="ml-3">
                  <Text className="text-[13px] font-black text-teal-700">Admin Moderation Dashboard</Text>
                  <Text className="text-[10px] text-teal-400 font-medium mt-0.5">Review flags and manage content</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#14B8A6" />
            </TouchableOpacity>
          )}

          {/* Sign Out */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center px-4 py-4 mt-3 border border-red-100 rounded-2xl bg-red-50 shadow-sm"
          >
            <View className="w-9 h-9 rounded-xl bg-red-100 items-center justify-center">
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-black text-red-500">Sign Out</Text>
              <Text className="text-[10px] text-red-300 font-medium mt-0.5">Logout from your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#fca5a5" />
          </TouchableOpacity>
        </View>

        {/* ── MY SUBMITTED REVIEWS ── */}
        <View className="px-5 mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              My Submitted Reviews ({myReviews.length})
            </Text>
            {myReviews.length > 0 && (
              <TouchableOpacity>
                <Text className="text-[#1d4ed8] text-[11px] font-bold">View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {myReviews.length === 0 ? (
            <View className={`border rounded-2xl p-6 items-center ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-sm`}>
              {/* Illustration */}
              <View className="relative w-20 h-16 items-center justify-center mb-4">
                <View className="absolute inset-0 items-center justify-center opacity-20">
                  <Ionicons name="star" size={12} color="#1d4ed8" style={{ position: 'absolute', top: 0, left: 10 }} />
                  <Ionicons name="star" size={8} color="#1d4ed8" style={{ position: 'absolute', top: 4, right: 8 }} />
                  <Ionicons name="add" size={10} color="#1d4ed8" style={{ position: 'absolute', bottom: 0, left: 4 }} />
                </View>
                <View className={`w-14 h-16 rounded-lg border-2 items-center justify-center ${isDark ? 'border-slate-600 bg-slate-800' : 'border-blue-200 bg-blue-50'}`}>
                  <Ionicons name="document-text-outline" size={28} color="#93c5fd" />
                </View>
                <View className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 items-center justify-center ${isDark ? 'border-slate-900 bg-blue-900' : 'border-white bg-[#1d4ed8]'}`}>
                  <Ionicons name="pencil" size={12} color="#ffffff" />
                </View>
              </View>

              <Text className={`text-[15px] font-black mb-1.5 ${textDark}`}>No Reviews Yet!</Text>
              <Text className="text-[11px] text-slate-400 font-medium text-center leading-4 mb-5 max-w-[220px]">
                You haven't written any reviews yet.{'\n'}Share your experience and help others.
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('ReviewStack', { screen: 'AddReviewLanding' } as any)}
                className="bg-[#1d4ed8] px-6 py-3 rounded-full flex-row items-center shadow-md shadow-blue-500/30"
              >
                <Ionicons name="pencil" size={14} color="#ffffff" />
                <Text className="text-white text-[13px] font-black ml-1.5">Write a Review</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myReviews.map((item) => (
              <View key={item.id} className={`p-4 rounded-2xl mb-3 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-sm`}>
                <View className="flex-row justify-between items-start mb-2">
                  <Text className={`font-black text-[13px] flex-1 mr-2 ${textDark}`} numberOfLines={1}>{getPropName(item.propertyId)}</Text>
                  <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-lg">
                    <Ionicons name="star" size={10} color="#1d4ed8" />
                    <Text className="text-[11px] font-black text-[#1d4ed8] ml-1">{item.ratings.overall}/5</Text>
                  </View>
                </View>
                {item.verified ? (
                  <View className="flex-row items-center mb-2">
                    <View className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <Text className="text-[8px] text-emerald-600 font-black uppercase tracking-wide">✓ Verified Stay</Text>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center mb-2">
                    <View className="bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <Text className="text-[8px] text-amber-600 font-black uppercase tracking-wide">⏳ Pending Verify</Text>
                    </View>
                  </View>
                )}
                <Text className={`text-[11px] font-medium leading-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>"{item.comment}"</Text>
                <Text className="text-slate-300 text-[9px] font-bold mt-2 text-right">{item.date}</Text>
              </View>
            ))
          )}
        </View>

        {/* ── TRUST BANNER ── */}
        <View className="px-5 mb-6">
          <View className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-blue-950/20 border-blue-900/30' : 'bg-[#eff6ff] border-blue-100'} p-5`}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center mb-2">
                  <View className="bg-[#1d4ed8] w-8 h-8 rounded-full items-center justify-center mr-2">
                    <Ionicons name="shield-checkmark" size={16} color="#ffffff" />
                  </View>
                  <Text className="text-[14px] font-black text-[#1e3a8a]">Your voice matters!</Text>
                </View>
                <Text className="text-[10px] text-[#3b82f6] font-bold mb-0.5">Real reviews. Real impact.</Text>
                <Text className="text-[10px] text-slate-400 font-medium">Thank you for being part of our community.</Text>
              </View>
              {/* Mocked city illustration */}
              <View className="w-20 items-end">
                <View className="flex-row items-end mb-1">
                  <Ionicons name="star" size={8} color="#1d4ed8" />
                  <Ionicons name="star" size={8} color="#1d4ed8" />
                  <Ionicons name="star" size={8} color="#1d4ed8" />
                  <Ionicons name="star" size={8} color="#1d4ed8" />
                  <Ionicons name="star" size={8} color="#1d4ed8" />
                </View>
                <View className="flex-row items-end justify-end">
                  <View className="w-4 h-8 bg-blue-200 rounded-t-sm mx-0.5 border border-blue-300" />
                  <View className="w-3 h-6 bg-blue-300 rounded-t-sm mx-0.5 border border-blue-400" />
                  <View className="w-5 h-10 bg-blue-200 rounded-t-sm mx-0.5 border border-blue-300" />
                  <View className="w-4 h-7 bg-blue-100 rounded-t-sm mx-0.5 border border-blue-200" />
                </View>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
