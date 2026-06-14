import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { AuthStackParamList } from '../../../navigation/types';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const registerSchema = zod
  .object({
    name: zod.string().min(2, 'Name must be at least 2 characters'),
    email: zod.string().email('Please enter a valid email address'),
    phoneNumber: zod.string().min(10, 'Please enter a valid phone number'),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = zod.infer<typeof registerSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onRegister = async (data: FormData) => {
    setSubmitting(true);
    try {
      // API call:
      // await authService.register(...)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Please log in to continue.',
        position: 'bottom',
      });
      navigation.navigate('Login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message || 'Could not register account.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between px-6 py-6">
          <View>
            <View className="mt-4 mb-8">
              <Text className="text-3xl font-extrabold text-slate-800">Create Account</Text>
              <Text className="text-sm text-slate-500 mt-2 font-medium">
                Register to start reviewing PGs.
              </Text>
            </View>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="john@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number"
                  placeholder="1234567890"
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.phoneNumber?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Button
              title="Sign Up"
              loading={submitting}
              onPress={handleSubmit(onRegister)}
              className="mt-4"
            />
          </View>

          <View className="flex-row justify-center items-center mt-8 mb-4">
            <Text className="text-slate-500 text-sm font-medium">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary-500 text-sm font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
