import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PrivacySettings'>;

export default function PrivacySettingsScreen({ navigation }: Props) {
  const [preferences, setPreferences] = useState({
    publicProfile: true,
    showActivity: true,
    dataAnalytics: true,
    shareReviews: true,
    allowMessages: false,
  });

  const [saving, setSaving] = useState(false);

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      Toast.show({
        type: 'success',
        text1: 'Privacy Updated',
        text2: 'Your privacy settings have been successfully updated.',
        position: 'bottom',
      });
      navigation.goBack();
    }, 800);
  };

  const SettingItem = ({ 
    title, 
    description, 
    icon, 
    value, 
    onToggle 
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    value: boolean; 
    onToggle: () => void; 
  }) => (
    <View className="flex-row items-center justify-between bg-[#f4f7fc] p-4 rounded-2xl mb-3 border border-transparent">
      <View className="flex-row items-center flex-1 mr-4">
        <View className={`w-10 h-10 rounded-full justify-center items-center ${value ? 'bg-sky-100' : 'bg-slate-200'}`}>
          <Ionicons name={icon as any} size={20} color={value ? '#0ea5e9' : '#64748b'} />
        </View>
        <View className="ml-3 flex-1">
          <Text className={`text-sm font-bold ${value ? 'text-[#002D74]' : 'text-slate-600'}`}>{title}</Text>
          <Text className="text-[11px] text-slate-500 font-medium mt-0.5">{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#cbd5e1', true: '#bae6fd' }}
        thumbColor={value ? '#0ea5e9' : '#f8fafc'}
        ios_backgroundColor="#cbd5e1"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Premium Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-white border border-slate-200 rounded-full justify-center items-center active:bg-slate-50"
        >
          <Ionicons name="arrow-back" size={20} color="#002D74" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-xl font-black text-[#002D74]">Privacy Settings</Text>
          <Text className="text-xs font-bold text-sky-500">Control your data & visibility</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="p-5 flex-1">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Profile Visibility</Text>
          <SettingItem
            title="Public Profile"
            description="Allow other users to see your basic profile information."
            icon="person"
            value={preferences.publicProfile}
            onToggle={() => togglePreference('publicProfile')}
          />
          <SettingItem
            title="Show Activity Status"
            description="Let others know when you are currently online."
            icon="eye"
            value={preferences.showActivity}
            onToggle={() => togglePreference('showActivity')}
          />

          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mt-6 mb-4">Data & Content</Text>
          <SettingItem
            title="Share Reviews Publicly"
            description="Your reviews will be visible on property pages."
            icon="share-social"
            value={preferences.shareReviews}
            onToggle={() => togglePreference('shareReviews')}
          />
          <SettingItem
            title="App Analytics"
            description="Share anonymous usage data to help us improve."
            icon="stats-chart"
            value={preferences.dataAnalytics}
            onToggle={() => togglePreference('dataAnalytics')}
          />
          <SettingItem
            title="Allow Direct Messages"
            description="Allow property owners to message you directly."
            icon="chatbubble-ellipses"
            value={preferences.allowMessages}
            onToggle={() => togglePreference('allowMessages')}
          />
        </View>

        <View className="px-5 mt-auto pt-6">
          <TouchableOpacity 
            onPress={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-full justify-center items-center shadow-sm ${saving ? 'bg-sky-400' : 'bg-[#0ea5e9]'}`}
          >
            <Text className="text-white text-sm font-black uppercase tracking-widest">{saving ? 'Saving...' : 'Save Privacy Options'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="mt-4 py-2 flex-row justify-center items-center opacity-70">
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
            <Text className="text-red-500 text-xs font-bold ml-1">Request Account Deletion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
