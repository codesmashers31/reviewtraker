import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

import { ProfileStackParamList } from '../../../navigation/types';
import { MockDb } from '../../../services/mockDb';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AdminPanel'>;

export default function AdminPanelScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const [counts, setCounts] = useState({
    verifications: 0,
    claims: 0,
    reports: 0,
    reviews: 0,
    properties: 0,
    users: 0,
  });

  const loadStats = async () => {
    const veris = await MockDb.getVerifications();
    const clms = await MockDb.getClaims();
    const rpts = await MockDb.getReports();
    const revs = await MockDb.getReviews();
    const props = await MockDb.getProperties();
    const usrs = await MockDb.getUsers();

    setCounts({
      verifications: veris.filter((v) => v.status === 'pending').length,
      claims: clms.filter((c) => c.status === 'pending').length,
      reports: rpts.filter((r) => r.status === 'pending').length,
      reviews: revs.length,
      properties: props.length,
      users: usrs.length,
    });
  };

  useEffect(() => {
    if (isFocused) {
      loadStats();
    }
  }, [isFocused]);

  const items = [
    {
      label: 'Residency Verifications',
      description: 'Approve Rent Receipts & IDs',
      badge: counts.verifications,
      icon: 'shield-checkmark-outline',
      color: 'bg-green-500',
      onPress: () => navigation.navigate('ManageVerifications'),
    },
    {
      label: 'Property Claims',
      description: 'Verify Owner certificates',
      badge: counts.claims,
      icon: 'business-outline',
      color: 'bg-indigo-500',
      onPress: () => navigation.navigate('ManagePGs'), // Handled in Manage PGs / Properties
    },
    {
      label: 'Content Reports',
      description: 'Flagged Fake & Abusive reviews',
      badge: counts.reports,
      icon: 'flag-outline',
      color: 'bg-rose-500',
      onPress: () => navigation.navigate('ManageReports'),
    },
    {
      label: 'All Properties & Merging',
      description: 'Merge duplicate listings & edit PGs',
      badge: counts.properties,
      icon: 'git-merge-outline',
      color: 'bg-blue-500',
      onPress: () => navigation.navigate('ManagePGs'),
    },
    {
      label: 'All Reviews',
      description: 'Search & delete user ratings',
      badge: counts.reviews,
      icon: 'star-outline',
      color: 'bg-amber-500',
      onPress: () => navigation.navigate('ManageReviews'),
    },
    {
      label: 'User Accounts',
      description: 'Search & suspend profiles',
      badge: counts.users,
      icon: 'people-outline',
      color: 'bg-purple-500',
      onPress: () => navigation.navigate('ManageUsers'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <View className="flex-row justify-between items-center mt-2 mb-6">
          <View className="h-10 w-10 rounded-full bg-[#002D74] justify-center items-center">
            <View className="h-4 w-4 rounded-full bg-blue-500" />
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 bg-white border border-slate-200 rounded-full justify-center items-center active:bg-slate-50"
          >
            <Ionicons name="close" size={20} color="#002D74" />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-3xl font-black text-[#002D74] mb-1 tracking-tight">Admin Dashboard</Text>
          <Text className="text-sm font-bold text-blue-600 mb-1">Truth Review Moderation</Text>
          <Text className="text-xs font-medium text-slate-500">Moderate platform content and verify stay details</Text>
        </View>

        {/* Analytics counts quick tiles */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1 bg-[#e4edff] rounded-3xl p-5 border border-[#d6e2ff]">
            <Text className="text-[10px] text-[#002D74] font-black uppercase tracking-widest leading-4 opacity-80 h-8">Pending Stay Verifications</Text>
            <Text className="text-[#002D74] text-[40px] font-black mt-2 leading-tight">{counts.verifications}</Text>
          </View>
          <View className="flex-1 bg-[#e4edff] rounded-3xl p-5 border border-[#d6e2ff]">
            <Text className="text-[10px] text-[#002D74] font-black uppercase tracking-widest leading-4 opacity-80 h-8">Flagged Reports</Text>
            <Text className="text-[#002D74] text-[40px] font-black mt-2 leading-tight">{counts.reports}</Text>
          </View>
        </View>

        {/* Navigation list */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xs font-black text-slate-500 uppercase tracking-widest">Moderation Tasks</Text>
          <TouchableOpacity className="bg-slate-50 p-1.5 rounded-full border border-slate-200">
            <Ionicons name="settings-outline" size={16} color="#002D74" />
          </TouchableOpacity>
        </View>
        <View className="space-y-3 gap-3 mb-8">
          {items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl active:bg-slate-50 mb-3"
              onPress={item.onPress}
            >
              <View className="flex-row items-center flex-1 mr-3">
                <View className="h-12 w-12 bg-[#002D74] rounded-xl justify-center items-center shadow-sm">
                  <Ionicons name={item.icon as any} size={22} color="#ffffff" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-[#002D74] text-[15px] font-black tracking-tight">{item.label}</Text>
                  <Text className="text-slate-600 text-[11px] font-medium mt-0.5">{item.description}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                {item.badge > 0 && (
                  <View className="bg-[#d32f2f] h-6 min-w-[24px] px-1.5 rounded-full justify-center items-center mr-2">
                    <Text className="text-[11px] text-white font-black">{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
