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
      className={`flex-1 min-w-[48%] bg-card border ${
        selected ? 'border-accent-500 bg-surface' : 'border-borderSubtle shadow-premium'
      } p-5 rounded-3xl items-center justify-center m-1 active:opacity-90`}
    >
      <View className={`h-12 w-12 rounded-full justify-center items-center mb-3 ${
        selected ? 'bg-accent-500/15 border border-accent-500/30' : 'bg-surface border border-borderSubtle'
      }`}>
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className={`text-sm font-bold ${selected ? 'text-accent-500' : 'text-textBody'}`}>
        {title}
      </Text>
    </Pressable>
  );
}
