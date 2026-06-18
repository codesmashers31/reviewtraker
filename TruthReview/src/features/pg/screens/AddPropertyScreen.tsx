import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { HomeStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { MockDb, PropertyType, GenderType } from '../../../services/mockDb';

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

export default function AddPropertyScreen({ navigation }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
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
      city: 'Chennai',
      state: 'Tamil Nadu',
      latitude: 13.0827, // Default Chennai lat
      longitude: 80.2707, // Default Chennai lng
      description: '',
      contactNumber: '',
    },
  });

  const amenities = [
    'AC Available',
    'WiFi Available',
    'Food Included',
    'Daily Cleaning',
    'CCTV Security',
    'Gym Access',
    'Laundry Service',
    '24/7 Power Backup',
    'Water Supply',
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
      // Create new property via MockDb
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

  // Preset location helper for Chennai tester
  const applyPresetCoords = (lat: number, lng: number, area: string) => {
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
    setValue('area', area, { shouldValidate: true });
    setValue('address', `No 2, Cross Street, ${area}, Chennai`);
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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Add New Accommodation</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        {/* Helper Note */}
        <View className="bg-primary-50 border border-primary-100/50 p-4 rounded-2xl mb-6">
          <Text className="text-xs font-bold text-primary-700 leading-5">
            💡 Propose any verified PG, hostel, or rental space. Duplicate listings are automatically prevented using Name, Address, and Coordinates (latitude/longitude).
          </Text>
        </View>

        {/* Basic Information */}
        <Text className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Basic Information</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
          <Text className="text-slate-600 font-bold text-xs mb-2">Property Type</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {(['PG', 'Hostel', 'Hotel', 'Service Apartment', 'Rental Room', 'Co-Living Property'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => onChange(t)}
                    className={`px-3 py-2.5 rounded-xl border ${value === t
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-slate-50 border-slate-200'
                      } flex-grow m-0.5`}
                  >
                    <Text
                      className={`text-xs font-extrabold text-center ${value === t ? 'text-white' : 'text-slate-600'
                        }`}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        {/* Gender Sharing Category */}
        <View className="mb-4">
          <Text className="text-slate-600 font-bold text-xs mb-2">Gender Category</Text>
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
                    className={`px-3.5 py-2.5 rounded-xl border ${value === g.val
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-slate-50 border-slate-200'
                      } flex-grow m-0.5`}
                  >
                    <Text
                      className={`text-xs font-extrabold text-center ${value === g.val ? 'text-white' : 'text-slate-600'
                        }`}
                    >
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        {/* Contact Info */}
        <View className="mb-4">
          <Controller
            control={control}
            name="contactNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
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
        </View>

        {/* Location Details */}
        <Text className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 mb-4">Location Details</Text>

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full Street Address"
              placeholder="e.g. No 12, Main Street, Near Church"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.address?.message}
            />
          )}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Controller
              control={control}
              name="area"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Area / Locality"
                  placeholder="e.g. Adyar"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.area?.message}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="City"
                  placeholder="e.g. Chennai"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.city?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="State"
              placeholder="e.g. Tamil Nadu"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.state?.message}
            />
          )}
        />

        {/* Map Coordinates Simulation */}
        <View className="mb-4">
          <Text className="text-slate-700 font-extrabold text-sm mb-2">Latitude & Longitude Coordinates</Text>
          <Text className="text-[11px] font-semibold text-slate-400 mb-3">
            Precise coordinates are required to enforce duplicate prevention. Select a test area to simulate coordinate mapping:
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            <TouchableOpacity
              onPress={() => applyPresetCoords(13.0067, 80.2578, 'Adyar')}
              className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl"
            >
              <Text className="text-xs font-bold text-slate-700">📍 Seed Adyar PG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => applyPresetCoords(12.9801, 80.2224, 'Velachery')}
              className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl"
            >
              <Text className="text-xs font-bold text-slate-700">📍 Seed Stanza Velachery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => applyPresetCoords(13.0418, 80.2341, 'T. Nagar')}
              className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl"
            >
              <Text className="text-xs font-bold text-slate-700">📍 Seed Serene T. Nagar</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="latitude"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Latitude"
                    placeholder="e.g. 13.0827"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    value={value ? String(value) : ''}
                    error={errors.latitude?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="longitude"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Longitude"
                    placeholder="e.g. 80.2707"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(parseFloat(text) || 0)}
                    value={value ? String(value) : ''}
                    error={errors.longitude?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-slate-600 font-bold text-xs mb-2">Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`w-full bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200'
                  } px-4 py-3 rounded-2xl text-slate-800 text-sm font-medium h-28`}
                placeholder="Describe the rooms, occupancy details, environment, deposit rules, etc."
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
            <Text className="text-red-500 text-xs font-bold mt-1">{errors.description.message}</Text>
          )}
        </View>

        {/* Amenities Checklist */}
        <View className="mb-8">
          <Text className="text-slate-700 font-extrabold text-sm mb-3">Amenities Provided</Text>
          <View className="flex-row flex-wrap gap-2">
            {amenities.map((item) => {
              const isSelected = selectedFacilities.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleFacility(item)}
                  className={`flex-row items-center border ${isSelected ? 'bg-primary-50 border-primary-300' : 'bg-slate-55 border-slate-200'
                    } px-3.5 py-2.5 rounded-xl m-0.5`}
                >
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={16}
                    color={isSelected ? '#14B8A6' : '#94a3b8'}
                  />
                  <Text className={`text-xs font-bold ml-2 ${isSelected ? 'text-primary-600' : 'text-slate-600'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit */}
        <Button
          title="Suggest Property"
          loading={submitting}
          onPress={handleSubmit(onSubmitProperty)}
          className="mb-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
