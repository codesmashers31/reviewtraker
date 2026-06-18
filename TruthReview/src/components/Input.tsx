import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
  errorStyle?: string;
}

export default function Input({
  label,
  error,
  containerStyle = '',
  labelStyle = '',
  inputStyle = '',
  errorStyle = '',
  ...props
}: InputProps) {
  return (
    <View className={`w-full mb-4 ${containerStyle}`}>
      {label && (
        <Text className={`text-textBody font-bold text-sm mb-1.5 ${labelStyle}`}>
          {label}
        </Text>
      )}
      <TextInput
        className={`w-full bg-surface border ${
          error ? 'border-red-500 bg-red-950/10' : 'border-borderSubtle focus:border-secondary-500'
        } px-4 py-3.5 rounded-2xl text-text text-sm font-medium ${inputStyle}`}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error && (
        <Text className={`text-red-400 text-xs font-semibold mt-1 ${errorStyle}`}>
          {error}
        </Text>
      )}
    </View>
  );
}
