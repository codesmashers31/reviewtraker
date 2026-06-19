import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { HomeStackParamList } from '../../../navigation/types';
import { MockDb, GenderType } from '../../../services/mockDb';

const propertySchema = zod.object({
  name: zod.string().min(4, 'Property Name must be at least 4 characters').max(100),
  type: zod.enum(['PG', 'Hostel', 'Hotel', 'Service Apartment', 'Rental Room', 'Co-Living Property'] as const),
  genderType: zod.enum(['boys', 'girls', 'unisex', 'none'] as const),
  price: zod.number(),
  address: zod.string().min(10, 'Full address must be at least 10 characters'),
  area: zod.string().min(3, 'Area/Neighborhood must be at least 3 characters'),
  city: zod.string().min(3, 'City must be at least 3 characters'),
  state: zod.string().min(3, 'State must be at least 3 characters'),
  latitude: zod.number().min(-90).max(90),
  longitude: zod.number().min(-180).max(180),
  description: zod.string().min(20, 'Provide at least 20 characters of description'),
  contactNumber: zod.string().min(10, 'Contact number must be at least 10 digits'),
});

type FormData = zod.infer<typeof propertySchema>;
type Props = NativeStackScreenProps<HomeStackParamList, 'AddProperty'>;

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
}

function CustomInput({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  keyboardType = 'default',
}: CustomInputProps) {
  return (
    <View className="w-full mb-4">
      <Text className="text-slate-500 font-semibold text-xs mb-2 ml-1">
        {label}
      </Text>
      <TextInput
        className={`w-full bg-[#f0f4fc] px-4 py-4 rounded-2xl text-slate-800 text-sm font-semibold border ${
          error ? 'border-red-500 bg-red-50/10' : 'border-transparent focus:border-blue-400'
        }`}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
      />
      {error && (
        <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}

export default function AddPropertyScreen({ navigation }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      type: 'PG',
      genderType: 'unisex',
      price: 0,
      address: '',
      area: '',
      city: '',
      state: '',
      latitude: 6.5244,
      longitude: 3.3792,
      description: '',
      contactNumber: '',
    },
  });

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const amenities = [
    { key: 'AC Available', label: 'AC', icon: 'snow-outline', activeIcon: 'snow' },
    { key: 'WiFi Available', label: 'WiFi', icon: 'wifi-outline', activeIcon: 'wifi' },
    { key: 'Food Included', label: 'Food', icon: 'restaurant-outline', activeIcon: 'restaurant' },
    { key: 'Daily Cleaning', label: 'Cleaning', icon: 'brush-outline', activeIcon: 'brush' },
    { key: 'CCTV Security', label: 'CCTV', icon: 'videocam-outline', activeIcon: 'videocam' },
    { key: 'Gym Access', label: 'Gym', icon: 'resize-outline', activeIcon: 'resize' },
    { key: 'Laundry Service', label: 'Laundry', icon: 'shirt-outline', activeIcon: 'shirt' },
    { key: '24/7 Power Backup', label: 'Power', icon: 'flash-outline', activeIcon: 'flash' },
    { key: 'Water Supply', label: 'Water', icon: 'water-outline', activeIcon: 'water' },
  ];

  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  const onSubmitProperty = async (data: FormData) => {
    setSubmitting(true);
    try {
      const newProp = await MockDb.addProperty({
        name: data.name,
        type: data.type,
        genderType: data.genderType,
        price: data.price,
        location: `${data.area}, ${data.city}`,
        address: data.address,
        area: data.area,
        city: data.city,
        state: data.state,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        contactNumber: data.contactNumber,
        facilities: selectedFacilities,
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
        ],
      });

      Toast.show({
        type: 'success',
        text1: 'Property Added',
        text2: 'Thank you! The listing has been added to our platform.',
        position: 'bottom',
      });

      navigation.replace('PGDetails', { pgId: newProp.id });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Duplicate Found',
        text2: error.message || 'Property already listed.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDetectLocation = () => {
    setValue('latitude', 6.5244, { shouldValidate: true });
    setValue('longitude', 3.3792, { shouldValidate: true });
    setValue('area', 'Business District', { shouldValidate: true });
    setValue('city', 'Lagos', { shouldValidate: true });
    setValue('state', 'Lagos State', { shouldValidate: true });
    setValue('address', '123 Blue Marine Street, Business District, Lagos', { shouldValidate: true });

    Toast.show({
      type: 'success',
      text1: 'Location Detected',
      text2: 'Coordinates matched to Lagos, Nigeria',
      position: 'bottom',
    });
  };

  const applyPresetCoords = (lat: number, lng: number, area: string, city: string, state: string) => {
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
    setValue('area', area, { shouldValidate: true });
    setValue('city', city, { shouldValidate: true });
    setValue('state', state, { shouldValidate: true });
    setValue('address', `No 2, Cross Street, ${area}, ${city}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8faff]" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-slate-100 bg-[#f8faff]">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-lg font-black text-[#0b1a4a]">Add New Accommodation</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        
        {/* SECTION 1: Basic Information */}
        <View className="flex-row items-center mb-4 mt-2">
          <View className="bg-[#0b1a4a] rounded-full w-7 h-7 justify-center items-center mr-3">
            <Text className="text-white font-extrabold text-xs">1</Text>
          </View>
          <Text className="text-[15px] font-extrabold text-[#0b1a4a]">Basic Information</Text>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Property Name"
              placeholder="e.g. Olive Unisex Co-Living Hub"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        {/* Property Type Grid */}
        <View className="mb-4">
          <Text className="text-slate-500 font-semibold text-xs mb-2 ml-1">Property Type</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {(['PG', 'Hostel', 'Hotel', 'Service Apartment', 'Rental Room', 'Co-Living Property'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => onChange(t)}
                    activeOpacity={0.8}
                    className={`px-4 py-2.5 rounded-full border ${
                      value === t
                        ? 'bg-[#0b1a4a] border-[#0b1a4a]'
                        : 'bg-[#f0f4fc] border-transparent'
                    } m-0.5`}
                  >
                    <Text className={`text-xs font-bold text-center ${value === t ? 'text-white' : 'text-slate-600'}`}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.type && (
            <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.type.message}</Text>
          )}
        </View>

        {/* Gender Sharing Category */}
        <View className="mb-4">
          <Text className="text-slate-500 font-semibold text-xs mb-2 ml-1">Gender Category</Text>
          <Controller
            control={control}
            name="genderType"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {[
                  { label: 'Boys Only', val: 'boys' },
                  { label: 'Girls Only', val: 'girls' },
                  { label: 'Co-Ed', val: 'unisex' },
                  { label: 'No Gender Restriction', val: 'none' },
                ].map((g) => (
                  <TouchableOpacity
                    key={g.val}
                    onPress={() => onChange(g.val as GenderType)}
                    activeOpacity={0.8}
                    className={`px-4 py-2.5 rounded-full border ${
                      value === g.val
                        ? 'bg-[#0b1a4a] border-[#0b1a4a]'
                        : 'bg-[#f0f4fc] border-transparent'
                    } m-0.5`}
                  >
                    <Text className={`text-xs font-bold text-center ${value === g.val ? 'text-white' : 'text-slate-600'}`}>
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.genderType && (
            <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.genderType.message}</Text>
          )}
        </View>

        {/* Contact Info */}
        <Controller
          control={control}
          name="contactNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Contact Phone Number"
              placeholder="e.g. 9876543210"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.contactNumber?.message}
            />
          )}
        />

        {/* SECTION 2: Location Details */}
        <View className="flex-row items-center mb-4 mt-6">
          <View className="bg-[#0b1a4a] rounded-full w-7 h-7 justify-center items-center mr-3">
            <Text className="text-white font-extrabold text-xs">2</Text>
          </View>
          <Text className="text-[15px] font-extrabold text-[#0b1a4a]">Location Details</Text>
        </View>

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Full Street Address"
              placeholder="e.g. 123 Blue Marine Street"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.address?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="area"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Area / Locality"
              placeholder="e.g. Business District"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.area?.message}
            />
          )}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="City"
                  placeholder="e.g. Lagos"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.city?.message}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="State"
                  placeholder="e.g. Lagos State"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.state?.message}
                />
              )}
            />
          </View>
        </View>

        {/* SECTION 3: Map Pin Verification */}
        <View className="flex-row items-center mb-4 mt-6">
          <View className="bg-[#0b1a4a] rounded-full w-7 h-7 justify-center items-center mr-3">
            <Text className="text-white font-extrabold text-xs">3</Text>
          </View>
          <Text className="text-[15px] font-extrabold text-[#0b1a4a]">Map Pin Verification</Text>
        </View>

        {/* Map Container */}
        <View className="w-full h-44 rounded-3xl overflow-hidden relative mb-3 border border-slate-100 shadow-sm">
          <Image
            source={require('../../../../assets/map_placeholder.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={handleDetectLocation}
            activeOpacity={0.85}
            className="absolute bottom-3 right-3 bg-[#0b1a4a] flex-row items-center px-4 py-2.5 rounded-xl shadow-md"
          >
            <Ionicons name="locate" size={14} color="#ffffff" />
            <Text className="text-white font-extrabold text-[11px] ml-1.5">Detect Location</Text>
          </TouchableOpacity>
        </View>

        {/* Coordinates Display Card */}
        <View className="bg-[#eef3fc] p-4 rounded-2xl flex-row justify-between items-center mb-1">
          <View className="flex-1 items-start pl-2">
            <Text className="text-[10px] font-bold text-slate-400 uppercase">Latitude</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="compass-outline" size={16} color="#0b1a4a" />
              <Text className="text-[#0b1a4a] font-extrabold text-sm ml-1.5">
                {latitude ? `${latitude.toFixed(4)}° N` : 'Not Set'}
              </Text>
            </View>
          </View>
          <View className="flex-1 items-start pl-4 border-l border-slate-200">
            <Text className="text-[10px] font-bold text-slate-400 uppercase">Longitude</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="compass-outline" size={16} color="#0b1a4a" />
              <Text className="text-[#0b1a4a] font-extrabold text-sm ml-1.5">
                {longitude ? `${longitude.toFixed(4)}° E` : 'Not Set'}
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-[11px] text-slate-400 font-medium leading-4 mb-4 mt-1.5 px-1">
          Ensure the marker sits exactly on the property entrance for verification.
        </Text>

        {/* Developer Seeding Section (Subtle) */}
        <View className="flex-row flex-wrap gap-2 mb-4 px-1">
          <TouchableOpacity
            onPress={() => applyPresetCoords(13.0067, 80.2578, 'Adyar', 'Chennai', 'Tamil Nadu')}
            className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-[10px] font-bold text-slate-500">📍 Seed Adyar PG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => applyPresetCoords(12.9801, 80.2224, 'Velachery', 'Chennai', 'Tamil Nadu')}
            className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-[10px] font-bold text-slate-500">📍 Seed Velachery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => applyPresetCoords(13.0418, 80.2341, 'T. Nagar', 'Chennai', 'Tamil Nadu')}
            className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-[10px] font-bold text-slate-500">📍 Seed T. Nagar</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 4: Description */}
        <View className="flex-row items-center mb-4 mt-4">
          <View className="bg-[#0b1a4a] rounded-full w-7 h-7 justify-center items-center mr-3">
            <Text className="text-white font-extrabold text-xs">4</Text>
          </View>
          <Text className="text-[15px] font-extrabold text-[#0b1a4a]">Description</Text>
        </View>

        <View className="mb-4">
          <Text className="text-slate-500 font-semibold text-xs mb-2 ml-1">Truth Summary</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`w-full bg-[#f0f4fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold border ${
                  errors.description ? 'border-red-500' : 'border-transparent focus:border-blue-400'
                } h-32`}
                placeholder="Describe the current condition, known issues, or landlord management style. Provide facts that marketing materials usually hide."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.description && (
            <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.description.message}</Text>
          )}
        </View>

        {/* SECTION 5: Facilities & Amenities */}
        <View className="flex-row items-center mb-4 mt-6">
          <View className="bg-[#0b1a4a] rounded-full w-7 h-7 justify-center items-center mr-3">
            <Text className="text-white font-extrabold text-xs">5</Text>
          </View>
          <Text className="text-[15px] font-extrabold text-[#0b1a4a]">Facilities & Amenities</Text>
        </View>

        {/* 3x3 Grid Checklist */}
        <View className="flex-row flex-wrap justify-between gap-y-3 mb-6">
          {amenities.map((item) => {
            const isSelected = selectedFacilities.includes(item.key);
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => toggleFacility(item.key)}
                activeOpacity={0.8}
                className={`w-[31.5%] h-20 rounded-2xl justify-center items-center border ${
                  isSelected
                    ? 'bg-[#eff6ff] border-blue-200'
                    : 'bg-[#f4f7fc] border-transparent'
                }`}
              >
                <Ionicons
                  name={(isSelected ? item.activeIcon : item.icon) as any}
                  size={22}
                  color={isSelected ? '#2563eb' : '#64748b'}
                />
                <Text className={`text-[10px] font-extrabold mt-1.5 text-center ${
                  isSelected ? 'text-[#0b1a4a]' : 'text-slate-500'
                }`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Verified Integrity Check Card */}
        <View className="bg-[#05246e] p-5 rounded-3xl mb-6 shadow-md shadow-blue-900/10">
          <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <Text className="text-white font-extrabold text-sm ml-2">Verified Integrity Check</Text>
          </View>
          <Text className="text-blue-200/80 text-xs font-semibold leading-5">
            By submitting this accommodation, you agree that all provided data is factual and personally verified. False submissions will result in immediate reviewer ban and a "Fraud Flag" on your identity profile.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmitProperty)}
          disabled={submitting}
          activeOpacity={0.9}
          className="w-full bg-[#051c47] py-4 rounded-2xl flex-row items-center justify-center shadow-md active:opacity-90"
        >
          <Ionicons name="send" size={16} color="#ffffff" style={{ marginRight: 8, transform: [{ rotate: '-45deg' }] }} />
          <Text className="text-white text-base font-extrabold">Submit for Review</Text>
        </TouchableOpacity>
        
        <Text className="text-xs text-slate-400 font-bold text-center mt-2.5 mb-10">
          Typical moderation time: 24-48 hours
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
