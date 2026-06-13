import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6 py-12">
        <View className="items-center mt-20">
          <Text className="text-5xl font-extrabold text-primary-600 tracking-tight">
            TruthReview
          </Text>
          <Text className="text-lg text-slate-500 font-medium text-center mt-4 px-4">
            Verify before you stay. Real reviews, genuine images, and verified PG listings.
          </Text>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            className="w-full bg-primary-500 py-4 rounded-xl items-center justify-center shadow-lg shadow-primary-500/20 active:opacity-90"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-white text-base font-bold">Login to Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-slate-50 border border-slate-200 py-4 rounded-xl items-center justify-center active:bg-slate-100 mt-4"
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-slate-800 text-base font-bold">Create New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
