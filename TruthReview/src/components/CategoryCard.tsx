import React from 'react';
import { Text, Pressable, View } from 'react-native';

interface CategoryCardProps {
  title: string;
  icon: string;
  onPress?: () => void;
  selected?: boolean;
}

export default function CategoryCard({
  title,
  icon,
  onPress,
  selected = false,
}: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 min-w-[48%] bg-white border ${
        selected ? 'border-primary-500 bg-primary-50/10 shadow-sm' : 'border-slate-100 shadow-sm'
      } p-5 rounded-2xl items-center justify-center m-1 active:opacity-90`}
    >
      <View className="h-12 w-12 bg-slate-50 rounded-full justify-center items-center mb-3">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className={`text-sm font-bold ${selected ? 'text-primary-600' : 'text-slate-700'}`}>
        {title}
      </Text>
    </Pressable>
  );
}
