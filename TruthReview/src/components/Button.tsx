import React, { useCallback } from 'react';
import { Text, ActivityIndicator, Pressable, PressableProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
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
  const scale = useSharedValue(1);

  const handlePressIn = useCallback((e: any) => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    props.onPressIn?.(e);
  }, [props.onPressIn, scale]);

  const handlePressOut = useCallback((e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    props.onPressOut?.(e);
  }, [props.onPressOut, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  let buttonClasses = 'w-full rounded-2xl items-center justify-center flex-row shadow-premium ';
  let textClasses = 'text-base font-bold ';

  if (variant === 'primary') {
    buttonClasses += 'overflow-hidden p-0 h-[52px] ';
    textClasses += 'text-white';
  } else if (variant === 'secondary') {
    buttonClasses += 'bg-transparent border-2 border-accent-500 py-3.5 ';
    textClasses += 'text-accent-500';
  } else if (variant === 'outline') {
    buttonClasses += 'bg-transparent border-2 border-secondary-500 py-3.5 ';
    textClasses += 'text-secondary-500';
  } else if (variant === 'danger') {
    buttonClasses += 'bg-red-600 py-3.5 ';
    textClasses += 'text-white';
  }

  if (disabled || loading) {
    buttonClasses += ' opacity-60 pointer-events-none';
  }

  return (
    <AnimatedPressable
      className={`${buttonClasses} ${className}`}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      {...props}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={['#2563EB', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderRadius: 16 }}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className={`${textClasses} ${textStyle}`}>{title}</Text>
          )}
        </LinearGradient>
      ) : (
        loading ? (
          <ActivityIndicator color={variant === 'secondary' ? '#F59E0B' : '#ffffff'} />
        ) : (
          <Text className={`${textClasses} ${textStyle}`}>{title}</Text>
        )
      )}
    </AnimatedPressable>
  );
}
