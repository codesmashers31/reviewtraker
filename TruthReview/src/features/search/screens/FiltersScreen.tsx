import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SearchStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';

type Props = NativeStackScreenProps<SearchStackParamList, 'Filters'>;

export default function FiltersScreen({ navigation }: Props) {
  // State for filter controls
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [highTrustScore, setHighTrustScore] = useState(false);
  const [ac, setAc] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [foodIncluded, setFoodIncluded] = useState(false);
  const [maleHostel, setMaleHostel] = useState(false);
  const [femaleHostel, setFemaleHostel] = useState(false);
  
  const [budgetRange, setBudgetRange] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);

  const budgets = [
    { label: 'Under ₹6,000', value: 'under_6000' },
    { label: '₹6,000 - ₹9,000', value: '6000_9000' },
    { label: '₹9,000 - ₹12,000', value: '9000_12000' },
    { label: 'Above ₹12,000', value: 'above_12000' },
  ];

  const typesList = [
    'All',
    'PG',
    'Hostel',
    'Hotel',
    'Service Apartment',
    'Rental Room',
    'Co-Living Property',
  ];

  const handleApply = () => {
    // Navigate back to Search screen and pass active filters
    navigation.navigate('Search', {
      filters: {
        verifiedOnly,
        highTrustScore,
        ac,
        wifi,
        foodIncluded,
        maleHostel,
        femaleHostel,
        budgetRange,
        propertyType,
      },
    } as any);
  };

  const handleReset = () => {
    setVerifiedOnly(false);
    setHighTrustScore(false);
    setAc(false);
    setWifi(false);
    setFoodIncluded(false);
    setMaleHostel(false);
    setFemaleHostel(false);
    setBudgetRange(null);
    setPropertyType(null);
  };

  const renderToggle = (label: string, value: boolean, setValue: (v: boolean) => void, icon: string) => {
    return (
      <TouchableOpacity
        onPress={() => setValue(!value)}
        className={`flex-row justify-between items-center border p-4.5 rounded-2xl mb-2.5 active:opacity-90 ${
          value ? 'bg-primary-50/20 border-primary-300' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <View className="flex-row items-center">
          <Ionicons name={icon as any} size={18} color={value ? '#0ea5e9' : '#475569'} />
          <Text className={`text-xs font-bold ml-3.5 ${value ? 'text-primary-700' : 'text-slate-700'}`}>
            {label}
          </Text>
        </View>
        <Ionicons
          name={value ? 'checkbox' : 'square-outline'}
          size={18}
          color={value ? '#0ea5e9' : '#94a3b8'}
        />
      </TouchableOpacity>
    );
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
        
        {/* Verification & Trust */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Verification & Trust</Text>
        {renderToggle('Verified Property Listings Only', verifiedOnly, setVerifiedOnly, 'checkmark-circle-outline')}
        {renderToggle('High Trust Score (>= 75)', highTrustScore, setHighTrustScore, 'shield-checkmark-outline')}

        {/* Accommodation Gender Category */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4 mb-3">Accommodation Gender Rules</Text>
        {renderToggle("Male Hostel (Boys Only)", maleHostel, setMaleHostel, 'man-outline')}
        {renderToggle("Female Hostel (Girls Only)", femaleHostel, setFemaleHostel, 'woman-outline')}

        {/* Amenities */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4 mb-3">Amenities & Facilities</Text>
        {renderToggle('Air Conditioning (AC) Available', ac, setAc, 'snow')}
        {renderToggle('Wi-Fi / Internet Available', wifi, setWifi, 'wifi')}
        {renderToggle('Meals / Food Included', foodIncluded, setFoodIncluded, 'fast-food-outline')}

        {/* Property Type Category Selector */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4 mb-3">Property Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {typesList.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setPropertyType(propertyType === t ? null : t)}
              className={`px-3.5 py-2.5 rounded-xl border ${
                propertyType === t
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-slate-50 border-slate-200'
              } flex-grow m-0.5`}
            >
              <Text
                className={`text-xs font-extrabold text-center ${
                  propertyType === t ? 'text-white' : 'text-slate-600'
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budget Selector */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4 mb-3">Monthly Rent Budget</Text>
        <View className="flex-row flex-wrap gap-2 mb-10">
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
      </ScrollView>

      {/* Footer Apply CTA */}
      <View className="border-t border-slate-100 bg-white px-5 py-4">
        <Button title="Apply Active Filters" onPress={handleApply} />
      </View>
    </SafeAreaView>
  );
}
