import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { HomeStackParamList } from '../../../navigation/types';
import { MockDb } from '../../../services/mockDb';

const { width } = Dimensions.get('window');

const propertySchema = zod.object({
  name: zod.string().min(4, 'Property Name must be at least 4 characters').max(100),
  type: zod.enum(['PG', 'Hostel', 'Hotel', 'Service Apartment', 'Rental Room', 'Co-Living Property'] as const),
  genderType: zod.enum(['boys', 'girls', 'unisex', 'none'] as const),
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
      type: 'Co-Living Property',
      genderType: 'unisex',
      address: '',
      area: '',
      city: '',
      state: '',
      latitude: 12.9716, // Default to a realistic coordinate
      longitude: 77.5946,
      description: '',
      contactNumber: '',
    },
  });

  const propertyType = watch('type');
  const genderType = watch('genderType');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const amenities = [
    { key: 'AC Available', label: 'AC', icon: 'snow-outline', activeIcon: 'snow' },
    { key: 'WiFi Available', label: 'WiFi', icon: 'wifi-outline', activeIcon: 'wifi' },
    { key: 'Food Included', label: 'Food', icon: 'restaurant-outline', activeIcon: 'restaurant' },
    { key: 'Daily Cleaning', label: 'Cleaning', icon: 'brush-outline', activeIcon: 'brush' },
    { key: 'CCTV Security', label: 'CCTV', icon: 'videocam-outline', activeIcon: 'videocam' },
    { key: 'Gym Access', label: 'Gym', icon: 'barbell-outline', activeIcon: 'barbell' },
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

  const handleDetectLocation = () => {
    setValue('latitude', 12.971598, { shouldValidate: true });
    setValue('longitude', 77.594562, { shouldValidate: true });
    Toast.show({
      type: 'success',
      text1: 'Location Detected',
      text2: 'GPS Coordinates acquired.',
      position: 'bottom',
    });
  };

  const onSubmitProperty = async (data: FormData) => {
    setSubmitting(true);
    try {
      const newProp = await MockDb.addProperty({
        name: data.name,
        type: data.type,
        genderType: data.genderType,
        price: 5000, // Default price since it's not in the new UI
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
        text1: 'Property Submitted',
        text2: 'Thank you! The listing has been submitted for review.',
        position: 'bottom',
      });

      navigation.replace('PGDetails', { pgId: newProp.id });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error.message || 'Something went wrong.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const SectionHeader = ({ number, title }: { number: string; title: string }) => (
    <View className="flex-row items-center mb-5">
      <View className="w-6 h-6 rounded-full bg-[#002D74] justify-center items-center mr-2">
        <Text className="text-white text-xs font-bold">{number}</Text>
      </View>
      <Text className="text-lg font-black text-[#002D74]">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7fc]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="#002D74" />
        </TouchableOpacity>
        <Text className="text-lg font-black text-[#002D74]">Add New Accommodation</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Section 1: Basic Information */}
        <View className="bg-white px-5 py-6 mb-3">
          <SectionHeader number="1" title="Basic Information" />
          
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-5">
                <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">Property Name</Text>
                <TextInput
                  className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold ${errors.name ? 'border border-red-500 bg-red-50/10' : ''}`}
                  placeholder="e.g. Olive Unisex Co-Living Hub"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.name && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</Text>}
              </View>
            )}
          />

          <View className="mb-5">
            <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">Property Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {['PG', 'Hostel', 'Hotel', 'Service Apartment', 'Rental Room', 'Co-Living Property'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setValue('type', type as any)}
                  className={`px-4 py-2 rounded-full border ${propertyType === type ? 'bg-[#002D74] border-[#002D74]' : 'bg-white border-slate-200'}`}
                >
                  <Text className={`text-xs font-bold ${propertyType === type ? 'text-white' : 'text-slate-600'}`}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">Gender Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                { id: 'boys', label: 'Boys Only' },
                { id: 'girls', label: 'Girls Only' },
                { id: 'unisex', label: 'Co-Ed' },
                { id: 'none', label: 'No Gender Restriction' }
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setValue('genderType', cat.id as any)}
                  className={`px-4 py-2 rounded-full border ${genderType === cat.id ? 'bg-[#002D74] border-[#002D74]' : 'bg-white border-slate-200'}`}
                >
                  <Text className={`text-xs font-bold ${genderType === cat.id ? 'text-white' : 'text-slate-600'}`}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Controller
            control={control}
            name="contactNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">Contact Phone Number</Text>
                <TextInput
                  className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold ${errors.contactNumber ? 'border border-red-500 bg-red-50/10' : ''}`}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.contactNumber && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.contactNumber.message}</Text>}
              </View>
            )}
          />
        </View>

        {/* Section 2: Location Details */}
        <View className="bg-white px-5 py-6 mb-3">
          <SectionHeader number="2" title="Location Details" />
          
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-5">
                <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">Full Street Address</Text>
                <TextInput
                  className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold ${errors.address ? 'border border-red-500 bg-red-50/10' : ''}`}
                  placeholder="e.g. #42, 1st Cross, Tech Park Road"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="area"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-5">
                <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">Area / Locality</Text>
                <TextInput
                  className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold ${errors.area ? 'border border-red-500 bg-red-50/10' : ''}`}
                  placeholder="e.g. Koramangala"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />

          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">City</Text>
                    <TextInput
                      className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold ${errors.city ? 'border border-red-500 bg-red-50/10' : ''}`}
                      placeholder="e.g. Bengaluru"
                      placeholderTextColor="#94a3b8"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
            </View>
            <View className="flex-1 ml-2">
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">State</Text>
                    <TextInput
                      className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold ${errors.state ? 'border border-red-500 bg-red-50/10' : ''}`}
                      placeholder="e.g. Karnataka"
                      placeholderTextColor="#94a3b8"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
            </View>
          </View>
        </View>

        {/* Section 3: Map Pin Verification */}
        <View className="bg-white px-5 py-6 mb-3">
          <SectionHeader number="3" title="Map Pin Verification" />
          
          <View className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-200 mb-3">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80' }} 
              className="w-full h-full opacity-70"
            />
            <View className="absolute inset-0 justify-center items-center">
              <Ionicons name="location" size={40} color="#ef4444" className="shadow-lg" />
            </View>
            <View className="absolute bottom-3 w-full items-center">
              <TouchableOpacity 
                onPress={handleDetectLocation}
                className="bg-white px-4 py-2 rounded-full flex-row items-center shadow-sm border border-slate-100"
              >
                <Ionicons name="locate" size={16} color="#002D74" />
                <Text className="text-[#002D74] font-bold text-xs ml-1">Detect Location</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-row justify-center space-x-6 mb-3">
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-xs font-bold mr-1">LAT:</Text>
              <Text className="text-slate-700 text-xs font-black">{latitude?.toFixed(4) || '---'}</Text>
            </View>
            <View className="mx-2 w-px h-3 bg-slate-300" />
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-xs font-bold mr-1">LNG:</Text>
              <Text className="text-slate-700 text-xs font-black">{longitude?.toFixed(4) || '---'}</Text>
            </View>
          </View>

          <Text className="text-center text-[10px] text-slate-500 leading-tight">
            Ensure the marker sits exactly on the property entrance for verification.
          </Text>
        </View>

        {/* Section 4: Description */}
        <View className="bg-white px-5 py-6 mb-3">
          <SectionHeader number="4" title="Description" />
          
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="text-slate-500 font-bold text-xs mb-2 ml-1">Truth Summary</Text>
                <TextInput
                  className={`w-full bg-[#f4f7fc] px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold ${errors.description ? 'border border-red-500 bg-red-50/10' : ''}`}
                  placeholder="Describe the current condition, known issues, exact route directions, owner behavior, deposit conditions, and true living experience..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={5}
                  style={{ minHeight: 120, textAlignVertical: 'top' }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.description && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.description.message}</Text>}
              </View>
            )}
          />
        </View>

        {/* Section 5: Facilities & Amenities */}
        <View className="bg-white px-5 py-6 mb-3">
          <SectionHeader number="5" title="Facilities & Amenities" />
          
          <View className="flex-row flex-wrap justify-between">
            {amenities.map((item) => {
              const isSelected = selectedFacilities.includes(item.key);
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => toggleFacility(item.key)}
                  style={{ width: '31%', aspectRatio: 1 }}
                  className={`mb-3 rounded-2xl justify-center items-center border ${
                    isSelected ? 'bg-blue-50 border-blue-400' : 'bg-[#f4f7fc] border-transparent'
                  }`}
                >
                  <Ionicons 
                    name={(isSelected ? item.activeIcon : item.icon) as any} 
                    size={28} 
                    color={isSelected ? '#2563eb' : '#64748b'} 
                  />
                  <Text className={`text-[10px] font-bold mt-2 text-center px-1 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submission Area */}
        <View className="px-5 mt-4">
          <View className="bg-[#002D74] p-5 rounded-3xl mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark" size={20} color="#fbbf24" />
              <Text className="text-white font-black ml-2">Verified Integrity Check</Text>
            </View>
            <Text className="text-blue-100 text-[11px] leading-relaxed opacity-90">
              By submitting this accommodation, you agree that all provided data is factual and personally verified. False submissions will result in immediate reviewer ban.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleSubmit(onSubmitProperty)}
            disabled={submitting}
            className={`w-full py-4 rounded-full flex-row justify-center items-center shadow-sm ${submitting ? 'bg-blue-400' : 'bg-[#002D74]'}`}
          >
            <Text className="text-white text-base font-black uppercase tracking-widest mr-2">
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </Text>
            {!submitting && <Ionicons name="paper-plane" size={18} color="white" />}
          </TouchableOpacity>
          <Text className="text-center text-[10px] text-slate-400 mt-3 font-bold">Typical moderation time: 24-48 hours</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
