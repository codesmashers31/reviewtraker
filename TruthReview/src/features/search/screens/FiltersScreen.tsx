import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SearchStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<SearchStackParamList, 'Filters'>;

export default function FiltersScreen({ navigation, route }: Props) {
  // Pre-fill with existing filters if they exist
  const existingFilters = route.params?.filters || {};
  
  // State for filter controls
  const [verifiedOnly, setVerifiedOnly] = useState(existingFilters.verifiedOnly || false);
  const [highTrustScore, setHighTrustScore] = useState(existingFilters.highTrustScore || false);
  const [ac, setAc] = useState(existingFilters.ac || false);
  const [wifi, setWifi] = useState(existingFilters.wifi || false);
  const [foodIncluded, setFoodIncluded] = useState(existingFilters.foodIncluded || false);
  
  // Using Segmented Control approach for Gender
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>(
    existingFilters.maleHostel ? 'Male' : (existingFilters.femaleHostel ? 'Female' : 'All')
  );

  const [propertyType, setPropertyType] = useState<string | null>(existingFilters.propertyType || null);

  const typesList = [
    { name: 'All', icon: 'apps-outline' },
    { name: 'PG', icon: 'bed-outline' },
    { name: 'Hostel', icon: 'business-outline' },
    { name: 'Hotel', icon: 'star-outline' },
    { name: 'Service Apartment', icon: 'key-outline' },
    { name: 'Rental Room', icon: 'home-outline' },
    { name: 'Co-Living Property', icon: 'people-outline' },
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
        maleHostel: genderFilter === 'Male',
        femaleHostel: genderFilter === 'Female',
        propertyType: propertyType === 'All' ? null : propertyType,
      },
    } as any);
  };

  const handleReset = () => {
    setVerifiedOnly(false);
    setHighTrustScore(false);
    setAc(false);
    setWifi(false);
    setFoodIncluded(false);
    setGenderFilter('All');
    setPropertyType(null);
  };

  // Custom Toggle Switch Component
  const PremiumToggle = ({ label, desc, icon, value, onToggle }: any) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onToggle(!value)}
      className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${value ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 shadow-sm'}`}
    >
      <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${value ? 'bg-blue-500' : 'bg-slate-100'}`}>
          <Ionicons name={icon} size={20} color={value ? 'white' : '#64748b'} />
        </View>
        <View className="flex-1 pr-4">
          <Text className={`font-bold text-[15px] ${value ? 'text-blue-900' : 'text-slate-800'}`}>{label}</Text>
          <Text className={`font-medium text-[11px] mt-0.5 ${value ? 'text-blue-600' : 'text-slate-500'}`}>{desc}</Text>
        </View>
      </View>
      {/* Switch Track */}
      <View className={`w-12 h-6 rounded-full p-1 flex-row items-center ${value ? 'bg-blue-500 justify-end' : 'bg-slate-300 justify-start'}`}>
        {/* Switch Thumb */}
        <View className="w-4 h-4 rounded-full bg-white shadow-sm" />
      </View>
    </TouchableOpacity>
  );

  // Custom Amenity Grid Item Component
  const AmenityCard = ({ label, icon, value, onToggle }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onToggle(!value)}
      className={`flex-1 m-1.5 p-4 rounded-2xl items-center justify-center border ${value ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}
      style={{ minHeight: 90 }}
    >
      <Ionicons name={icon} size={28} color={value ? '#10b981' : '#94a3b8'} style={{ marginBottom: 8 }} />
      <Text className={`font-bold text-[12px] text-center ${value ? 'text-emerald-800' : 'text-slate-600'}`}>{label}</Text>
      {value && (
        <View className="absolute top-2 right-2">
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Premium Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white shadow-sm border-b border-slate-100 z-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-slate-50 rounded-full justify-center items-center"
        >
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-[17px] font-black text-slate-800 tracking-wide">Filters</Text>
        <TouchableOpacity onPress={handleReset} className="h-10 justify-center">
          <Text className="text-blue-600 font-bold text-[14px]">Reset All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Verification & Quality */}
        <View className="px-5 pt-6 pb-2">
          <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Quality & Trust</Text>
          <PremiumToggle 
            label="Verified Properties Only" 
            desc="Listings with verified owners and documents" 
            icon="shield-checkmark" 
            value={verifiedOnly} 
            onToggle={setVerifiedOnly} 
          />
          <PremiumToggle 
            label="High Trust Score" 
            desc="Properties rated 75% or higher by residents" 
            icon="star" 
            value={highTrustScore} 
            onToggle={setHighTrustScore} 
          />
        </View>

        {/* Accommodation Gender Category (Segmented Control) */}
        <View className="px-5 py-4">
          <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Who can stay here?</Text>
          <View className="flex-row bg-slate-200 p-1 rounded-2xl">
            {['All', 'Male', 'Female'].map((gender) => {
              const isSelected = genderFilter === gender;
              return (
                <TouchableOpacity
                  key={gender}
                  onPress={() => setGenderFilter(gender as any)}
                  className={`flex-1 py-3 rounded-xl items-center ${isSelected ? 'bg-white shadow-sm' : ''}`}
                >
                  <Text className={`font-bold text-[13px] ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                    {gender === 'All' ? 'Anyone' : gender === 'Male' ? 'Boys Only' : 'Girls Only'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Property Category (Horizontal Scroll) */}
        <View className="py-4">
          <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-6">Property Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {typesList.map((t) => {
              const isSelected = propertyType === t.name;
              return (
                <TouchableOpacity
                  key={t.name}
                  onPress={() => setPropertyType(isSelected ? null : t.name)}
                  className={`flex-row items-center px-4 py-3 rounded-2xl mr-3 border ${
                    isSelected ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <Ionicons name={t.icon as any} size={18} color={isSelected ? '#ffffff' : '#64748b'} />
                  <Text className={`ml-2 font-bold text-[13px] ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    {t.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Amenities Grid */}
        <View className="px-5 py-4">
          <Text className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Must-Have Amenities</Text>
          <View className="flex-row flex-wrap -mx-1.5">
            <AmenityCard label="Air Conditioning" icon="snow" value={ac} onToggle={setAc} />
            <AmenityCard label="Fast Wi-Fi" icon="wifi" value={wifi} onToggle={setWifi} />
            <AmenityCard label="Food Included" icon="restaurant" value={foodIncluded} onToggle={setFoodIncluded} />
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Apply Action */}
      <View className="bg-white border-t border-slate-100 p-5 shadow-lg">
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={handleApply}
          className="bg-blue-600 h-14 rounded-full flex-row items-center justify-center shadow-md shadow-blue-500/30"
        >
          <Ionicons name="search" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-black text-[16px]">Show Results</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
