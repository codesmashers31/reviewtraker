import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function EmptyState({
  title,
  description,
  icon = 'search-outline',
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <View className="h-20 w-20 bg-slate-50 rounded-full justify-center items-center mb-4">
        <Ionicons name={icon} size={40} color="#94a3b8" />
      </View>
      <Text className="text-lg font-bold text-slate-800 text-center mb-1.5">{title}</Text>
      <Text className="text-sm text-slate-400 text-center max-w-[250px] font-medium leading-5">
        {description}
      </Text>
    </View>
  );
}
