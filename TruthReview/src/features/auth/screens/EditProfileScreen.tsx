import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { ProfileStackParamList } from '../../../navigation/types';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { RootState } from '../../../store';
import { updateUserProfile } from '../authSlice';

const profileSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: zod.string().min(10, 'Please enter a valid phone number'),
});

type FormData = zod.infer<typeof profileSchema>;
type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const onSaveProfile = async (data: FormData) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update Redux state
      dispatch(updateUserProfile({ name: data.name, phoneNumber: data.phoneNumber }));

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your information has been successfully saved.',
        position: 'bottom',
      });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: error.message || 'Something went wrong.',
        position: 'bottom',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-slate-50">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
        >
          <Ionicons name="arrow-back" size={20} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="p-5 flex-1 justify-between">
          <View className="mt-4">
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

            {/* Read-only email display */}
            <Input
              label="Email Address"
              value={user?.email || ''}
              editable={false}
              containerStyle="opacity-65"
              inputStyle="bg-slate-100/50 text-slate-400"
            />
          </View>

          <Button
            title="Save Changes"
            loading={saving}
            onPress={handleSubmit(onSaveProfile)}
            className="mb-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
