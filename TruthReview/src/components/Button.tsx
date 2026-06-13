import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  textStyle?: string;
  className?: string;
}

export default function Button({
  title,
  loading = false,
  variant = 'primary',
  textStyle = '',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let buttonClasses = 'w-full py-4 rounded-xl items-center justify-center flex-row shadow-sm ';
  let textClasses = 'text-base font-bold ';

  if (variant === 'primary') {
    buttonClasses += 'bg-primary-500 active:opacity-90';
    textClasses += 'text-white';
  } else if (variant === 'secondary') {
    buttonClasses += 'bg-slate-100 active:bg-slate-200';
    textClasses += 'text-slate-800';
  } else if (variant === 'outline') {
    buttonClasses += 'bg-transparent border border-slate-200 active:bg-slate-50';
    textClasses += 'text-slate-700';
  } else if (variant === 'danger') {
    buttonClasses += 'bg-red-500 active:opacity-90';
    textClasses += 'text-white';
  }

  if (disabled || loading) {
    buttonClasses += ' opacity-60 pointer-events-none';
  }

  return (
    <TouchableOpacity
      className={`${buttonClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'outline' ? '#0f172a' : '#ffffff'} />
      ) : (
        <Text className={`${textClasses} ${textStyle}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
