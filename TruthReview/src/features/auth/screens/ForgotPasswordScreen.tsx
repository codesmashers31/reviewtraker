import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { AuthStackParamList } from '../../../navigation/types';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const forgotPasswordSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
});

type FormData = zod.infer<typeof forgotPasswordSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // API call:
      // await authService.forgotPassword(data.email)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: 'Please check your email to reset password.',
        position: 'bottom',
      });
      navigation.navigate('Login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: error.message || 'Could not send reset request.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between px-6 py-8">
          <View>
            <View className="mt-8 mb-10">
              <Text className="text-3xl font-extrabold text-text">Forgot Password?</Text>
              <Text className="text-sm text-textMuted mt-2 font-medium">
                Enter your email address and we'll send you instructions to reset your password.
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

            <Button
              title="Send Reset Instructions"
              loading={submitting}
              onPress={handleSubmit(onSubmit)}
              className="mt-4"
            />
          </View>

          <View className="items-center mt-6">
            <Button
              title="Back to Sign In"
              variant="outline"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
