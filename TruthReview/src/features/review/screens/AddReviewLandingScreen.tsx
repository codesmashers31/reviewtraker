import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MockDb, Property } from '../../../services/mockDb';
import { HomeStackParamList } from '../../../navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const CATEGORIES = [
  { id: 'all', name: 'All Places', icon: 'grid-outline' },
  { id: 'PG', name: 'PGs', icon: 'business-outline' },
  { id: 'Hostel', name: 'Hostels', icon: 'home-outline' },
  { id: 'Hotel', name: 'Hotels', icon: 'bed-outline' },
  { id: 'Rental Room', name: 'Rentals', icon: 'key-outline' },
];

export default function AddReviewLandingScreen({ navigation }: { navigation: any }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadProperties = async () => {
      const allProps = await MockDb.getProperties();
      setProperties(allProps);
    };
    loadProperties();
  }, []);

  const filteredProperties = properties.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const mapType = selectedCategory === 'Rental Room' ? 'Rental Room' : selectedCategory;
    const matchesCategory = selectedCategory === 'all' ||
      item.type.toLowerCase().includes(mapType.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleSelectProperty = (propertyId: string) => {
    navigation.navigate('HomeStack', {
      screen: 'AddReview',
      params: { pgId: propertyId }
    } as any);
  };

  const handleCreateNewPlace = () => {
    navigation.navigate('HomeStack', {
      screen: 'AddProperty'
    } as any);
  };

  const renderHeader = () => (
    <View className="pt-2 bg-white">
      {/* Header Branding */}
      <View className="px-5 flex-row justify-between items-start mb-6 mt-4">
        <View className="flex-row">
          <View className="bg-[#1d4ed8] rounded-xl w-10 h-10 justify-center items-center shadow-sm">
            <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
          </View>
          <View className="ml-3">
            <View className="flex-row items-baseline">
              <Text className="text-[18px] font-black text-slate-800 tracking-tight">Truth</Text>
              <Text className="text-[18px] font-black text-[#1d4ed8] ml-1 tracking-tight">Review</Text>
            </View>
            <Text className="text-[10px] text-slate-500 font-medium leading-3 mt-0.5 max-w-[150px]">
              India's Verified Accommodation Reality Platform
            </Text>
          </View>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center">
          <Ionicons name="settings" size={20} color="#1d4ed8" />
        </TouchableOpacity>
      </View>

      {/* Hero Content */}
      <View className="px-5 mb-6 relative">
        <Text className="text-[11px] font-black text-[#1d4ed8] uppercase tracking-widest mb-1">REVIEW WORKSPACE</Text>
        <Text className="text-[26px] font-black text-slate-900 tracking-tight leading-8 mb-2">Select a Place to <Text className="text-[#1d4ed8]">Review</Text></Text>
        <Text className="text-xs text-slate-500 font-medium max-w-[200px]">Share your experience. Help others choose better.</Text>
        
        {/* City Illustration (Mocked with vectors) */}
        <View className="absolute right-0 top-0 w-32 h-24 flex-row items-end justify-end opacity-90 pr-5">
           <View className="bg-blue-100 w-6 h-12 rounded-t-sm mx-0.5 border border-blue-200" />
           <View className="bg-blue-200 w-5 h-8 rounded-t-sm mx-0.5 border border-blue-300" />
           <View className="bg-blue-300 w-8 h-16 rounded-t-sm mx-0.5 border border-blue-400" />
           <View className="bg-blue-200 w-6 h-10 rounded-t-sm mx-0.5 border border-blue-300" />
           <View className="absolute top-2 right-10 bg-white border border-slate-100 shadow-sm rounded-full px-2 py-0.5 flex-row">
             <Ionicons name="star" size={8} color="#1d4ed8" />
             <Ionicons name="star" size={8} color="#1d4ed8" />
             <Ionicons name="star" size={8} color="#1d4ed8" />
             <Ionicons name="star" size={8} color="#1d4ed8" />
             <Ionicons name="star" size={8} color="#1d4ed8" />
           </View>
        </View>
      </View>

      {/* Search Input */}
      <View className="px-5 mb-4 z-10">
        <View className="flex-row items-center border border-slate-200 rounded-full px-4 py-3 bg-white shadow-sm shadow-slate-100/50">
          <Ionicons name="search-outline" size={20} color="#64748b" />
          <TextInput
            className="flex-1 ml-2 text-sm font-medium text-slate-800"
            placeholder="Search place name, location or type..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View className="mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`flex-row items-center px-4 py-2 rounded-full border ${isActive
                    ? 'bg-[#1d4ed8] border-[#1d4ed8]'
                    : 'bg-white border-slate-200'
                  }`}
              >
                {cat.id === 'all' && (
                  <Ionicons name="apps" size={14} color={isActive ? '#ffffff' : '#64748b'} />
                )}
                <Text className={`text-[12px] font-bold ${isActive ? 'text-white ml-1' : 'text-slate-600'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Trust Banner */}
      <View className="px-5 mb-8">
        <View className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-2xl p-4 flex-row items-center">
          <View className="bg-[#1d4ed8] w-12 h-12 rounded-full items-center justify-center shadow-md shadow-blue-500/20 mr-4">
            <Ionicons name="shield-checkmark" size={24} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-black text-[#1e3a8a] mb-1">Your review builds trust</Text>
            <Text className="text-[9px] text-[#475569] font-medium leading-3">
              100% verified platform • Real residents only{'\n'}
              No fake reviews. No paid promotions.
            </Text>
          </View>
          <View className="items-center">
            <View className="flex-row mb-1">
              <Image source={{uri: 'https://randomuser.me/api/portraits/women/44.jpg'}} className="w-6 h-6 rounded-full border-2 border-[#f0f9ff] -mr-2 z-30" />
              <Image source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}} className="w-6 h-6 rounded-full border-2 border-[#f0f9ff] -mr-2 z-20" />
              <Image source={{uri: 'https://randomuser.me/api/portraits/women/68.jpg'}} className="w-6 h-6 rounded-full border-2 border-[#f0f9ff] z-10" />
            </View>
            <Text className="text-[12px] font-black text-slate-800">12,540+</Text>
            <Text className="text-[8px] font-bold text-slate-500 uppercase">Verified Reviewers</Text>
          </View>
        </View>
      </View>

      {/* Trending Nearby */}
      <View className="mb-6">
        <View className="px-5 flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Ionicons name="trending-up" size={16} color="#1d4ed8" />
            <Text className="text-[15px] font-black text-slate-800 ml-1">Trending Nearby</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-[#1d4ed8] text-[12px] font-bold">View All</Text>
          </TouchableOpacity>
        </View>
        <Text className="px-5 text-[11px] text-slate-500 font-medium mb-4 -mt-2">Popular places people are reviewing</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {[
            { name: 'Elite Men\'s\nLuxury PG', rating: '4.5', location: 'Adyar', icon: 'business-outline' },
            { name: 'Stanza Living\nLadies Stay', rating: '4.3', location: 'Velachery', icon: 'home-outline' },
            { name: 'Co-Fi\nCo-Living Hub', rating: '4.2', location: 'OMR', icon: 'people-outline' },
            { name: 'Serene Haven\nService Apts', rating: '4.6', location: 'T. Nagar', icon: 'business-outline' },
          ].map((item, i) => (
            <TouchableOpacity key={i} className="w-[120px] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm shadow-slate-100">
              <View className="bg-blue-50 w-8 h-8 rounded-full items-center justify-center mb-3">
                <Ionicons name={item.icon as any} size={16} color="#1d4ed8" />
              </View>
              <Text className="text-[12px] font-black text-slate-800 leading-4 mb-2">{item.name}</Text>
              <View className="flex-row items-center mb-1">
                <Ionicons name="star" size={10} color="#1d4ed8" />
                <Text className="text-[11px] font-black text-slate-800 ml-1">{item.rating}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 font-medium">{item.location}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Places Header */}
      <View className="px-5 flex-row justify-between items-center mb-3 mt-4">
        <Text className="text-[15px] font-black text-slate-800">Recent Places</Text>
        <TouchableOpacity className="flex-row items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <Text className="text-[10px] text-slate-500 font-bold mr-1">Sort By:</Text>
          <Text className="text-[10px] font-black text-slate-700">Most Recent</Text>
          <Ionicons name="chevron-down" size={10} color="#64748b" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View className="px-5 pb-10">
      <TouchableOpacity
        onPress={handleCreateNewPlace}
        className="bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center justify-between shadow-sm"
      >
        <View className="flex-row items-center flex-1">
          <Ionicons name="add-circle-outline" size={32} color="#1d4ed8" />
          <View className="ml-3 flex-1">
            <Text className="text-[13px] font-black text-[#1d4ed8] mb-0.5">Can't find the place?</Text>
            <Text className="text-[10px] text-slate-500 font-medium">Search and add a new place to share your review.</Text>
          </View>
        </View>
        <View className="bg-[#1d4ed8] px-4 py-2 rounded-full flex-row items-center ml-2 shadow-sm shadow-blue-500/30">
          <Ionicons name="add" size={14} color="#ffffff" />
          <Text className="text-white text-[11px] font-black ml-1">Add New Place</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-6">
            <View className="bg-slate-50 p-4 rounded-full mb-4 border border-slate-100">
              <Ionicons name="search-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-sm font-bold text-slate-700 text-center">No matching places found</Text>
            <Text className="text-xs text-slate-500 text-center mt-2 leading-4">
              Try adjusting your search criteria.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectProperty(item.id)}
            activeOpacity={0.7}
            className="bg-white border-b border-slate-100 p-4 flex-row items-center justify-between mx-5"
          >
            <View className="flex-row items-start flex-1 mr-3">
              <View className="bg-slate-50 border border-slate-200 w-12 h-12 rounded-xl items-center justify-center">
                <Ionicons name={item.type === 'Hotel' || item.type === 'Service Apartment' ? 'bed-outline' : 'business-outline'} size={20} color="#64748b" />
              </View>
              <View className="ml-3.5 flex-1">
                <Text className="text-[14px] font-black text-slate-800 mb-0.5" numberOfLines={1}>{item.name}</Text>
                <Text className="text-[11px] text-slate-500 font-medium mb-2" numberOfLines={1}>{item.address || item.location}</Text>
                
                <View className="flex-row items-center space-x-2">
                  <View className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    <Text className="text-[9px] font-black text-[#1d4ed8] uppercase tracking-wider">{item.type}</Text>
                  </View>
                  <View className="flex-row items-center ml-2">
                    <Ionicons name="shield-checkmark" size={12} color="#1d4ed8" />
                    <Text className="text-slate-600 text-[10px] font-bold ml-1">Trust Score: {item.trustScore}%</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 items-center justify-center mr-3">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={12} color="#1d4ed8" />
                  <Text className="text-[13px] font-black text-[#1d4ed8] ml-1">
                    {(item.trustScore / 10).toFixed(1)}
                  </Text>
                </View>
                <Text className="text-[9px] text-slate-500 font-bold mt-0.5">({item.reviewsCount * 12} reviews)</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
