import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
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
  { id: 'Restaurant', name: 'Restaurants', icon: 'restaurant-outline' },
  { id: 'Cafe', name: 'Cafes', icon: 'cafe-outline' },
  { id: 'Rental Room', name: 'Rentals', icon: 'key-outline' },
  { id: 'Office', name: 'Offices', icon: 'briefcase-outline' },
  { id: 'Shopping', name: 'Shops', icon: 'cart-outline' },
  { id: 'Community', name: 'Community', icon: 'people-outline' }
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

  // Filter properties based on search query and selected category
  const filteredProperties = properties.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      item.type.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleSelectProperty = (propertyId: string) => {
    // Navigate to AddReview screen inside HomeStack
    navigation.navigate('HomeStack', {
      screen: 'AddReview',
      params: { pgId: propertyId }
    } as any);
  };

  const handleCreateNewPlace = () => {
    // Navigate to AddProperty screen
    navigation.navigate('HomeStack', {
      screen: 'AddProperty'
    } as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Header */}
      <View className="px-5 pt-6 pb-4 flex-row justify-between items-center bg-surface border-b border-borderSubtle shadow-premium-sm">
        <View>
<<<<<<< HEAD
          <Text className="text-[10px] font-black uppercase tracking-widest text-accent-500">Review Workspace</Text>
          <Text className="text-xl font-extrabold text-text mt-0.5">Select a Place to Review</Text>
=======
          <Text className="text-[10px] font-black uppercase tracking-widest text-primary-500">Review Workspace</Text>
          <Text className="text-xl font-extrabold text-slate-900 mt-0.5">Select a Place to Review</Text>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-card border border-borderSubtle"
        >
          <Ionicons name="close" size={20} color="#D4A5A5" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View className="px-5 py-4 bg-surface border-b border-borderSubtle">
        <View className="flex-row items-center bg-card border border-borderSubtle px-3.5 py-2.5 rounded-2xl">
          <Ionicons name="search" size={18} color="#D4A5A5" />
          <TextInput
            className="flex-1 text-textBody text-xs ml-2 font-medium"
            placeholder="Search place name, location or type..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories chips horizontal selector */}
      <View className="bg-surface py-3 border-b border-borderSubtle">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
<<<<<<< HEAD
                className={`flex-row items-center mr-2.5 px-4 py-2 rounded-full border ${
                  isActive 
                    ? 'bg-primary-500 border-accent-500' 
                    : 'bg-card border-borderSubtle'
                }`}
              >
                <Ionicons 
                  name={cat.icon as any} 
                  size={14} 
                  color={isActive ? '#ffffff' : '#D1D5DB'} 
                />
                <Text className={`text-xs font-bold ml-1.5 ${
                  isActive ? 'text-text' : 'text-textBody'
                }`}>
=======
                className={`flex-row items-center mr-2.5 px-4 py-2 rounded-full border ${isActive
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-slate-50 border-slate-200'
                  }`}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isActive ? '#ffffff' : '#475569'}
                />
                <Text className={`text-xs font-bold ml-1.5 ${isActive ? 'text-white' : 'text-slate-700'
                  }`}>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List of Properties */}
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-6">
            <View className="bg-card p-4 rounded-full mb-4 border border-borderSubtle">
              <Ionicons name="business-outline" size={32} color="#D4A5A5" />
            </View>
            <Text className="text-sm font-bold text-text text-center">No matching places found</Text>
            <Text className="text-xs text-textMuted text-center mt-2 leading-4">
              Try searching for another place, or add this place to our community-listed directory.
            </Text>

            <TouchableOpacity
              onPress={handleCreateNewPlace}
<<<<<<< HEAD
              className="mt-6 bg-primary-500 px-5 py-3 rounded-xl flex-row items-center justify-center shadow-premium border border-accent-500/20"
=======
              className="mt-6 bg-primary-500 px-5 py-3 rounded-xl flex-row items-center justify-center shadow-md shadow-primary-500/10"
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text className="text-white text-xs font-bold ml-1.5">Add New Place</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectProperty(item.id)}
            activeOpacity={0.7}
            className="bg-card border border-borderSubtle rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-premium-sm"
          >
            <View className="flex-row items-center flex-1 mr-3">
<<<<<<< HEAD
              <View className="bg-surface border border-borderSubtle w-12 h-12 rounded-xl items-center justify-center">
                <Ionicons name="business" size={20} color="#D4A5A5" />
=======
              <View className="bg-slate-50 border border-slate-100 w-12 h-12 rounded-xl items-center justify-center">
                <Ionicons name="business" size={20} color="#14B8A6" />
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
              </View>
              <View className="ml-3.5 flex-1">
                <Text className="text-xs font-bold text-text truncate">{item.name}</Text>
                <Text className="text-[10px] text-textMuted mt-0.5 truncate">{item.location}</Text>
                <View className="flex-row items-center mt-1.5 space-x-2">
                  <View className="bg-surface px-2 py-0.5 rounded-md border border-borderSubtle">
                    <Text className="text-[9px] font-bold text-textBody uppercase">{item.type}</Text>
                  </View>
                  <View className="flex-row items-center ml-2">
                    <Ionicons name="shield-checkmark" size={10} color="#22c55e" />
                    <Text className="text-accent-500 text-[9px] font-bold ml-0.5">Score: {item.trustScore}%</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="bg-surface p-2.5 rounded-full border border-borderSubtle">
              <Ionicons name="chevron-forward" size={16} color="#D4A5A5" />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
