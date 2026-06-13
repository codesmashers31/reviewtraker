import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SearchStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';

type Props = NativeStackScreenProps<SearchStackParamList, 'Filters'>;

export default function FiltersScreen({ navigation }: Props) {
  const [budgetRange, setBudgetRange] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'all' | 'boys' | 'girls' | 'unisex'>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const budgets = [
    { label: 'Under ₹6,000', value: 'under_6000' },
    { label: '₹6,000 - ₹9,000', value: '6000_9000' },
    { label: '₹9,000 - ₹12,000', value: '9000_12000' },
    { label: 'Above ₹12,000', value: 'above_12000' },
  ];

  const genders = [
    { label: 'All Genders', value: 'all' },
    { label: 'Boys Only', value: 'boys' },
    { label: 'Girls Only', value: 'girls' },
    { label: 'Co-Ed', value: 'unisex' },
  ];

  const amenitiesList = [
    'AC',
    'High-Speed Wi-Fi',
    'Daily Cleaning',
    '3 Meals Veg/Non-Veg',
    'CCTV Security',
    'Gym Access',
    'Laundry Service',
    '24/7 Power Backup',
  ];

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleApply = () => {
    // Navigate back to Search and pass the selected filters
    navigation.navigate('Search');
  };

  const handleReset = () => {
    setBudgetRange(null);
    setSelectedGender('all');
    setSelectedAmenities([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-50">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
          >
            <Ionicons name="close" size={20} color="#475569" />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-slate-800 ml-3">Filters</Text>
        </View>
        <TouchableOpacity onPress={handleReset} className="active:opacity-75">
          <Text className="text-slate-400 font-bold text-sm">Reset All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        {/* Budget Section */}
        <View className="mb-6">
          <Text className="text-base font-extrabold text-slate-800 mb-3">Monthly Rent Budget</Text>
          <View className="flex-row flex-wrap gap-2">
            {budgets.map((b) => (
              <TouchableOpacity
                key={b.value}
                onPress={() => setBudgetRange(budgetRange === b.value ? null : b.value)}
                className={`px-4 py-3.5 rounded-2xl border ${
                  budgetRange === b.value
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-slate-50 border-slate-200'
                } min-w-[46%] flex-grow m-0.5`}
              >
                <Text
                  className={`text-xs font-bold text-center ${
                    budgetRange === b.value ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gender Sharing Section */}
        <View className="mb-6">
          <Text className="text-base font-extrabold text-slate-800 mb-3">Hostel Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {genders.map((g) => (
              <TouchableOpacity
                key={g.value}
                onPress={() => setSelectedGender(g.value as any)}
                className={`px-4 py-3.5 rounded-2xl border ${
                  selectedGender === g.value
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-slate-50 border-slate-200'
                } min-w-[46%] flex-grow m-0.5`}
              >
                <Text
                  className={`text-xs font-bold text-center ${
                    selectedGender === g.value ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amenities Section */}
        <View className="mb-8">
          <Text className="text-base font-extrabold text-slate-800 mb-3">Amenities & Facilities</Text>
          <View className="flex-row flex-wrap gap-2">
            {amenitiesList.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  onPress={() => toggleAmenity(amenity)}
                  className={`flex-row items-center border ${
                    isSelected ? 'bg-primary-50 border-primary-400' : 'bg-white border-slate-200'
                  } px-4 py-3 rounded-xl m-0.5`}
                >
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={16}
                    color={isSelected ? '#0ea5e9' : '#94a3b8'}
                  />
                  <Text
                    className={`text-xs font-bold ml-2 ${
                      isSelected ? 'text-primary-600' : 'text-slate-600'
                    }`}
                  >
                    {amenity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer Apply CTA */}
      <View className="border-t border-slate-100 bg-white px-5 py-4">
        <Button title="Apply Filters" onPress={handleApply} />
      </View>
    </SafeAreaView>
  );
}
