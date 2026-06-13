import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MockDb, Property } from '../services/mockDb';
import SearchBar from '../components/SearchBar';
import PGCard from '../components/PGCard';
import EmptyState from '../components/EmptyState';
import { SearchStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, 'Search'>;

type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'trustDesc' | 'reviewsDesc';

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Active filters from filter screen route params
  const activeFilters = route.params?.filters || {};

  const loadProperties = async () => {
    setLoading(true);
    const props = await MockDb.getProperties();
    setProperties(props);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      loadProperties();
      
      // If a search query was passed as parameter (e.g. from popular areas chip)
      if (route.params?.query) {
        setSearchQuery(route.params.query);
        // Clear param after consumption to avoid locking search
        navigation.setParams({ query: undefined } as any);
      }
    }
  }, [isFocused, route.params?.query]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const props = await MockDb.getProperties();
    setProperties(props);
    setRefreshing(false);
  };

  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // 1. Search Query (Property Name, Address, Area, City, State)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.area.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.state.toLowerCase().includes(query)
      );
    }

    // 2. Category Tab Filter (Co-Living, PG, Hostel, Hotel, Apartment, Room)
    if (selectedType !== 'All') {
      result = result.filter((p) => p.type === selectedType);
    }

    // 3. Filter page parameters
    if (activeFilters.verifiedOnly) {
      result = result.filter((p) => p.claimedBy !== null || p.trustScore >= 80);
    }

    if (activeFilters.highTrustScore) {
      result = result.filter((p) => p.trustScore >= 75);
    }

    if (activeFilters.ac) {
      result = result.filter((p) => p.facilities.some(f => f.toLowerCase().includes('ac') || f.toLowerCase().includes('condition')));
    }

    if (activeFilters.wifi) {
      result = result.filter((p) => p.facilities.some(f => f.toLowerCase().includes('wifi') || f.toLowerCase().includes('internet')));
    }

    if (activeFilters.foodIncluded) {
      result = result.filter((p) => p.facilities.some(f => f.toLowerCase().includes('meal') || f.toLowerCase().includes('food')));
    }

    if (activeFilters.maleHostel) {
      result = result.filter((p) => p.genderType === 'boys');
    }

    if (activeFilters.femaleHostel) {
      result = result.filter((p) => p.genderType === 'girls');
    }

    if (activeFilters.propertyType && activeFilters.propertyType !== 'All') {
      result = result.filter((p) => p.type === activeFilters.propertyType);
    }

    if (activeFilters.budgetRange) {
      if (activeFilters.budgetRange === 'under_6000') {
        result = result.filter((p) => p.price < 6000);
      } else if (activeFilters.budgetRange === '6000_9000') {
        result = result.filter((p) => p.price >= 6000 && p.price <= 9000);
      } else if (activeFilters.budgetRange === '9000_12000') {
        result = result.filter((p) => p.price >= 9000 && p.price <= 12000);
      } else if (activeFilters.budgetRange === 'above_12000') {
        result = result.filter((p) => p.price > 12000);
      }
    }

    // 4. Apply sorting
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'trustDesc') {
      result.sort((a, b) => b.trustScore - a.trustScore);
    } else if (sortBy === 'reviewsDesc') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [properties, searchQuery, selectedType, activeFilters, sortBy]);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'priceAsc':
        return 'Price: Low to High';
      case 'priceDesc':
        return 'Price: High to Low';
      case 'trustDesc':
        return 'Top Trusted (Score)';
      case 'reviewsDesc':
        return 'Most Reviewed';
      default:
        return 'Sort By';
    }
  };

  const cycleSort = () => {
    const options: SortOption[] = ['default', 'priceAsc', 'priceDesc', 'trustDesc', 'reviewsDesc'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const typesList = ['All', 'PG', 'Hostel', 'Hotel', 'Service Apartment', 'Rental Room', 'Co-Living Property'];

  // Check if any filters are currently active to show indicators
  const filterCount = Object.values(activeFilters).filter(val => val !== undefined && val !== null && val !== false && val !== 'All').length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-2 border-b border-slate-50">
        <Text className="text-2xl font-black text-slate-800 mb-4">Find Accommodation</Text>
        
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 mb-4">
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-xs font-semibold h-10"
            placeholder="Search by name, area, city, or state..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="mr-2">
              <Ionicons name="close-circle" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Filters' as any)}
            className="border-l border-slate-200 pl-3 flex-row items-center"
          >
            <Ionicons name="funnel-outline" size={16} color={filterCount > 0 ? '#0ea5e9' : '#475569'} />
            {filterCount > 0 && (
              <View className="bg-primary-500 rounded-full h-4 w-4 justify-center items-center ml-1">
                <Text className="text-white text-[8px] font-black">{filterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Accommodation Types Horizontal scroll */}
        <View className="mb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2 gap-2">
            {typesList.map((type) => {
              const active = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full border ${
                    active ? 'bg-primary-500 border-primary-500' : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Sorting controls */}
        <View className="flex-row justify-between items-center mt-3 mb-1">
          <Text className="text-[10px] text-slate-400 font-extrabold uppercase">
            Showing {filteredAndSortedProperties.length} results
          </Text>
          
          <TouchableOpacity
            onPress={cycleSort}
            className="flex-row items-center border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-full"
          >
            <Ionicons name="swap-vertical" size={12} color="#475569" />
            <Text className="text-slate-600 text-[10px] font-black ml-1.5">{getSortLabel()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results list */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PGCard item={item} />}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <EmptyState
              title="No Accommodations Found"
              description="We couldn't find any listings matching your search or filters. Try clearing some criteria."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
