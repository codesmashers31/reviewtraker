import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'NotificationPreferences'>;

export default function NotificationPreferencesScreen({ navigation }: Props) {
  const [preferences, setPreferences] = useState({
    pushAll: true,
    emailAlerts: true,
    reviewUpdates: true,
    promotions: false,
    smsAlerts: false,
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
        text1: 'Preferences Saved',
        text2: 'Your notification settings have been updated.',
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
        <View className={`w-10 h-10 rounded-full justify-center items-center ${value ? 'bg-blue-100' : 'bg-slate-200'}`}>
          <Ionicons name={icon as any} size={20} color={value ? '#2563eb' : '#64748b'} />
        </View>
        <View className="ml-3 flex-1">
          <Text className={`text-sm font-bold ${value ? 'text-[#002D74]' : 'text-slate-600'}`}>{title}</Text>
          <Text className="text-[11px] text-slate-500 font-medium mt-0.5">{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
        thumbColor={value ? '#2563eb' : '#f8fafc'}
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
          <Text className="text-xl font-black text-[#002D74]">Notifications</Text>
          <Text className="text-xs font-bold text-blue-600">Manage your alerts</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="p-5 flex-1">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Global Settings</Text>
          <SettingItem
            title="Push Notifications"
            description="Receive alerts directly on your device."
            icon="notifications"
            value={preferences.pushAll}
            onToggle={() => togglePreference('pushAll')}
          />
          <SettingItem
            title="Email Alerts"
            description="Get weekly summaries and important updates."
            icon="mail"
            value={preferences.emailAlerts}
            onToggle={() => togglePreference('emailAlerts')}
          />

          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mt-6 mb-4">Activity Updates</Text>
          <SettingItem
            title="Review Interactions"
            description="When someone likes or replies to your review."
            icon="chatbubbles"
            value={preferences.reviewUpdates}
            onToggle={() => togglePreference('reviewUpdates')}
          />
          <SettingItem
            title="Promotional Offers"
            description="Exclusive deals on verified accommodations."
            icon="pricetag"
            value={preferences.promotions}
            onToggle={() => togglePreference('promotions')}
          />
          <SettingItem
            title="SMS Alerts"
            description="Critical account security and verification updates."
            icon="phone-portrait"
            value={preferences.smsAlerts}
            onToggle={() => togglePreference('smsAlerts')}
          />
        </View>

        <View className="px-5 mt-auto pt-6">
          <TouchableOpacity 
            onPress={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-full justify-center items-center shadow-sm ${saving ? 'bg-blue-400' : 'bg-blue-600'}`}
          >
            <Text className="text-white text-sm font-black uppercase tracking-widest">{saving ? 'Saving...' : 'Save Preferences'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
