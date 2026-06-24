import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  bio: zod.string().optional(),
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
      bio: '',
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
      {/* Premium Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-white border border-slate-200 rounded-full justify-center items-center active:bg-slate-50"
        >
          <Ionicons name="arrow-back" size={20} color="#002D74" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-xl font-black text-[#002D74]">Personal Info</Text>
          <Text className="text-xs font-bold text-blue-600">Update your details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View className="p-5 flex-1">
          {/* Avatar Section */}
          <View className="items-center mt-2 mb-8">
            <View className="relative">
              <Image
                source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
                className="w-28 h-28 rounded-full border-4 border-[#e4edff]"
              />
              <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-600 w-9 h-9 rounded-full justify-center items-center border-2 border-white shadow-sm active:bg-blue-700">
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="space-y-4 gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-[#002D74] font-bold text-xs mb-1.5 ml-1 uppercase tracking-wider">Full Name</Text>
                  <TextInput
                    className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold border ${errors.name ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}
                    placeholder="John Doe"
                    placeholderTextColor="#94a3b8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.name && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</Text>}
                </View>
              )}
            />

            <View>
              <Text className="text-slate-400 font-bold text-xs mb-1.5 ml-1 uppercase tracking-wider">Email Address</Text>
              <TextInput
                className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl text-slate-400 text-sm font-semibold border border-transparent"
                value={user?.email || 'demo@truthreview.com'}
                editable={false}
              />
            </View>

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-[#002D74] font-bold text-xs mb-1.5 ml-1 uppercase tracking-wider">Phone Number</Text>
                  <TextInput
                    className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold border ${errors.phoneNumber ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}
                    placeholder="1234567890"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.phoneNumber && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.phoneNumber.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="text-[#002D74] font-bold text-xs mb-1.5 ml-1 uppercase tracking-wider">Bio (Optional)</Text>
                  <TextInput
                    className="w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold border border-transparent"
                    placeholder="Tell us a bit about yourself"
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
          </View>
        </View>

        <View className="px-5 mt-auto">
          <TouchableOpacity 
            onPress={handleSubmit(onSaveProfile)}
            disabled={saving}
            className={`w-full py-4 rounded-full justify-center items-center shadow-sm ${saving ? 'bg-blue-400' : 'bg-blue-600'}`}
          >
            <Text className="text-white text-sm font-black uppercase tracking-widest">{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
