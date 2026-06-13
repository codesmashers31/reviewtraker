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
        <Text className={`text-slate-600 font-semibold text-sm mb-1.5 ${labelStyle}`}>
          {label}
        </Text>
      )}
      <TextInput
        className={`w-full bg-slate-50 border ${
          error ? 'border-red-500 bg-red-50/10' : 'border-slate-200 focus:border-primary-500'
        } px-4 py-3.5 rounded-xl text-slate-800 text-sm font-medium ${inputStyle}`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error && (
        <Text className={`text-red-500 text-xs font-semibold mt-1 ${errorStyle}`}>
          {error}
        </Text>
      )}
    </View>
  );
}
