import React from 'react';
import { View, TextInput, Pressable, TextInputProps } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SearchBarProps extends TextInputProps {
  onFilterPress?: () => void;
  onPress?: () => void;
}

export default function SearchBar({ onFilterPress, onPress, ...props }: SearchBarProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row items-center bg-surface shadow-premium border border-borderSubtle px-4 py-3.5 rounded-2xl active:opacity-80"
      >
        <Ionicons name="search" size={20} color="#D4A5A5" />
        <View className="flex-1 ml-3">
          <TextInput
            placeholder="Search city, locality, or PG name..."
            placeholderTextColor="#94A3B8"
            editable={false}
            pointerEvents="none"
            style={{ color: '#FFFFFF' }}
          />
        </View>
        {onFilterPress && (
          <Pressable onPress={onFilterPress} className="p-1 active:opacity-75">
            <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          </Pressable>
        )}
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center bg-surface shadow-premium border border-borderSubtle px-4 py-3.5 rounded-2xl">
      <Ionicons name="search" size={20} color="#D4A5A5" />
      <TextInput
        className="flex-1 ml-3 text-text text-sm font-medium"
        placeholder="Search city, locality, or PG name..."
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {onFilterPress && (
        <Pressable onPress={onFilterPress} className="p-1 ml-2 active:opacity-75">
          <Ionicons name="options-outline" size={20} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}
