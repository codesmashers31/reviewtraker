import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ManageUsers'>;

export default function ManageUsersScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Text className="text-xl font-bold text-slate-800">Manage Users</Text>
      <Text className="text-slate-500 mt-2">Moderate User Accounts and Privileges</Text>
      <TouchableOpacity
        className="mt-6 bg-slate-100 px-6 py-3 rounded-lg"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-slate-700 font-bold">Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
