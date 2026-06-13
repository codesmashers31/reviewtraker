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
        className="flex-row items-center bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl active:bg-slate-100"
      >
        <Ionicons name="search" size={20} color="#94a3b8" />
        <View className="flex-1 ml-3">
          <TextInput
            placeholder="Search city, locality, or PG name..."
            placeholderTextColor="#94a3b8"
            editable={false}
            pointerEvents="none"
          />
        </View>
        {onFilterPress && (
          <Pressable onPress={onFilterPress} className="p-1 active:opacity-75">
            <Ionicons name="options-outline" size={20} color="#64748b" />
          </Pressable>
        )}
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl focus-within:border-primary-500">
      <Ionicons name="search" size={20} color="#94a3b8" />
      <TextInput
        className="flex-1 ml-3 text-slate-800 text-sm font-medium"
        placeholder="Search city, locality, or PG name..."
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {onFilterPress && (
        <Pressable onPress={onFilterPress} className="p-1 ml-2 active:opacity-75">
          <Ionicons name="options-outline" size={20} color="#64748b" />
        </Pressable>
      )}
    </View>
  );
}
