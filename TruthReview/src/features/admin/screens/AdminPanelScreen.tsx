import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AdminPanel'>;

export default function AdminPanelScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-6">
      <Text className="text-3xl font-extrabold text-slate-800 mt-8 mb-6">Admin Panel</Text>
      
      <View className="space-y-4 gap-4">
        <TouchableOpacity
          className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl flex-row justify-between items-center"
          onPress={() => navigation.navigate('ManagePGs')}
        >
          <Text className="text-slate-800 text-base font-bold">Manage PGs</Text>
          <Text className="text-primary-500 font-bold">→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl flex-row justify-between items-center"
          onPress={() => navigation.navigate('ManageReviews')}
        >
          <Text className="text-slate-800 text-base font-bold">Manage Reviews</Text>
          <Text className="text-primary-500 font-bold">→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl flex-row justify-between items-center"
          onPress={() => navigation.navigate('ManageUsers')}
        >
          <Text className="text-slate-800 text-base font-bold">Manage Users</Text>
          <Text className="text-primary-500 font-bold">→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-8 bg-slate-100 py-4 rounded-xl items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-slate-700 font-bold">Back to Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
