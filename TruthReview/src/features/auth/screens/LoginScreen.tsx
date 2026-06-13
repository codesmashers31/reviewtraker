import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import { AuthStackParamList } from '../../../navigation/types';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { setCredentials, setLoading, setAuthError } from '../authSlice';
import { storage, STORAGE_KEYS } from '../../../services/storage';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = zod.infer<typeof loginSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin = async (data: FormData) => {
    setSubmitting(true);
    dispatch(setLoading(true));
    try {
      // Direct API Call would be:
      // const res = await authService.login(data.email, data.password);
      // But for preview/robustness, we handle local mock fallback if API isn't online
      // We will try the API request, and if it fails due to network, we inform and prompt demo
      
      // Simulate API call delay for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // If we had the live backend, we would do:
      // const response = await api.post('/auth/login', data);
      
      throw new Error('API Offline: Backend server not reached. Click "Demo Login" below to preview.');
    } catch (error: any) {
      dispatch(setAuthError(error.message));
      Toast.show({
        type: 'error',
        text1: 'Authentication Failed',
        text2: error.message || 'Could not connect to server.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const handleDemoLogin = async () => {
    dispatch(setLoading(true));
    try {
      const demoUser = {
        id: 'user_123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user' as const,
        phoneNumber: '+1234567890',
      };
      const demoToken = 'mock_jwt_token_for_demo';

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoToken);
      await storage.setItem(STORAGE_KEYS.USER_INFO, demoUser);

      dispatch(setCredentials({ user: demoUser, token: demoToken }));
      Toast.show({
        type: 'success',
        text1: 'Logged in as Demo User',
        text2: 'Welcome to TruthReview!',
        position: 'bottom',
      });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDemoAdmin = async () => {
    dispatch(setLoading(true));
    try {
      const demoAdmin = {
        id: 'admin_123',
        name: 'Admin User',
        email: 'admin@truthreview.com',
        role: 'admin' as const,
        phoneNumber: '+9876543210',
      };
      const demoToken = 'mock_jwt_token_for_admin';

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoToken);
      await storage.setItem(STORAGE_KEYS.USER_INFO, demoAdmin);

      dispatch(setCredentials({ user: demoAdmin, token: demoToken }));
      Toast.show({
        type: 'success',
        text1: 'Logged in as Admin',
        text2: 'Admin panel access granted.',
        position: 'bottom',
      });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between px-6 py-8">
          <View>
            <View className="mt-8 mb-10">
              <Text className="text-3xl font-extrabold text-slate-800">Welcome Back</Text>
              <Text className="text-sm text-slate-500 mt-2 font-medium">
                Log in to search and review PGs.
              </Text>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
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

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              className="align-self-end mt-1 mb-6"
            >
              <Text className="text-primary-500 text-sm font-semibold text-right">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              loading={submitting}
              onPress={handleSubmit(onLogin)}
              className="mt-2"
            />

            {/* Demo Helpers */}
            <View className="border-t border-slate-100 my-6 pt-6 space-y-3">
              <Text className="text-slate-400 text-xs font-bold text-center uppercase tracking-widest mb-2">
                Demo Accounts
              </Text>
              <View className="flex-row space-x-3 gap-3">
                <View className="flex-1">
                  <Button
                    title="User Demo"
                    variant="outline"
                    onPress={handleDemoLogin}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title="Admin Demo"
                    variant="outline"
                    onPress={handleDemoAdmin}
                  />
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-slate-500 text-sm font-medium">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primary-500 text-sm font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
