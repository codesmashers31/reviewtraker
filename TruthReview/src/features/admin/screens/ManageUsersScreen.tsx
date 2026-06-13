import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import { MockDb } from '../../../services/mockDb';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ManageUsers'>;

export default function ManageUsersScreen({ navigation }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const usrs = await MockDb.getUsers();
    setUsers(usrs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSuspend = async (userId: string, isCurrentlySuspended: boolean) => {
    try {
      await MockDb.toggleUserSuspension(userId);
      Toast.show({
        type: 'success',
        text1: isCurrentlySuspended ? 'Account Restored' : 'Account Suspended',
        text2: isCurrentlySuspended ? 'User can now sign in.' : 'User has been blocked from signing in.',
        position: 'bottom',
      });
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Action Failed',
        text2: e.message || 'Something went wrong.',
        position: 'bottom',
      });
    }
  };

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-slate-50">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
        >
          <Ionicons name="arrow-back" size={20} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Manage Users</Text>
      </View>

      <View className="p-5 flex-1">
        {/* Search */}
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 mb-6">
          <Ionicons name="search" size={16} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-xs font-semibold h-9"
            placeholder="Search users by name or email..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <Text className="text-center text-slate-400 font-bold my-8">Loading users directory...</Text>
        ) : filteredUsers.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="people-outline" size={64} color="#cbd5e1" />
            <Text className="text-slate-800 font-extrabold text-base mt-4">No users found</Text>
            <Text className="text-slate-400 text-xs font-semibold text-center mt-1">Adjust search parameters.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 mb-3 flex-row justify-between items-center">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Text className="text-slate-800 font-extrabold text-sm">{item.name}</Text>
                    <Text className="text-[10px] text-primary-600 font-black bg-primary-50 px-2 py-0.5 rounded-md uppercase">
                      {item.role}
                    </Text>
                    {item.suspended && (
                      <Text className="text-[10px] text-red-600 font-black bg-red-50 px-2 py-0.5 rounded-md uppercase">
                        Suspended
                      </Text>
                    )}
                  </View>
                  <Text className="text-slate-400 text-xs font-semibold mt-0.5">{item.email}</Text>
                  {item.phoneNumber && (
                    <Text className="text-slate-400 text-[10px] font-semibold mt-0.5">Phone: {item.phoneNumber}</Text>
                  )}
                </View>

                {item.role !== 'admin' && (
                  <TouchableOpacity
                    onPress={() => handleToggleSuspend(item.id, item.suspended)}
                    className={`px-3 py-2 rounded-xl active:opacity-85 ${
                      item.suspended ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <Text className={`text-xs font-black ${item.suspended ? 'text-green-600' : 'text-red-600'}`}>
                      {item.suspended ? 'Unsuspend' : 'Suspend'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
