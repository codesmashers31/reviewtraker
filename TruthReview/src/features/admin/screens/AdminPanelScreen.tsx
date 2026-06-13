import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
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
        <View className="flex-row justify-between items-center mt-6 mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-800">Admin Dashboard</Text>
            <Text className="text-xs font-semibold text-slate-400 mt-1">Moderate platform content and verify stay details</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
          >
            <Ionicons name="close" size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Analytics counts quick tiles */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Stay Verifications</Text>
            <Text className="text-slate-800 text-3xl font-black mt-1">{counts.verifications}</Text>
          </View>
          <View className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flaged Reports</Text>
            <Text className="text-slate-800 text-3xl font-black mt-1">{counts.reports}</Text>
          </View>
        </View>

        {/* Navigation list */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Moderation Tasks</Text>
        <View className="space-y-3 gap-3 mb-8">
          {items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row justify-between items-center bg-slate-50 border border-slate-150/60 p-4.5 rounded-3xl active:bg-slate-100/80"
              onPress={item.onPress}
            >
              <View className="flex-row items-center flex-1 mr-3">
                <View className={`h-11 w-11 ${item.color} rounded-2xl justify-center items-center shadow-sm`}>
                  <Ionicons name={item.icon as any} size={20} color="#ffffff" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-slate-800 text-sm font-extrabold">{item.label}</Text>
                  <Text className="text-slate-400 text-xs font-semibold mt-0.5">{item.description}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                {item.badge > 0 && (
                  <View className="bg-red-500 px-2 py-0.5 rounded-full mr-2">
                    <Text className="text-[9px] text-white font-extrabold">{item.badge}</Text>
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
