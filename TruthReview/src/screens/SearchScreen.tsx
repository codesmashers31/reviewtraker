import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';

import { MockDb, Property } from '../services/mockDb';
import PGCard from '../components/PGCard';
import EmptyState from '../components/EmptyState';
import { SearchStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, 'Search'>;

type SortOption = 'default' | 'trustDesc' | 'reviewsDesc';

export default function SearchScreen({ navigation }: { navigation: any }) {
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Location Fetching State
  const [locationName, setLocationName] = useState('Adyar, Chennai');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Active filters from filter screen route params
  const activeFilters = route.params?.filters || {};

  const loadProperties = async () => {
    setLoading(true);
    const props = await MockDb.getProperties();
    setProperties(props);
    setLoading(false);
  };

  // Location Fetching Function
  const fetchLocation = async (isInitial = false) => {
    setLoadingLocation(true);
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setLocationName('Adyar, Chennai');
        if (!isInitial) {
          Toast.show({
            type: 'info',
            text1: 'Location Services Disabled',
            text2: 'Using default location (Adyar, Chennai).',
            position: 'top',
          });
        }
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!isInitial) {
          Toast.show({
            type: 'error',
            text1: 'Location Permission Denied',
            text2: 'Using default location (Adyar, Chennai).',
            position: 'top',
          });
        }
        setLocationName('Adyar, Chennai');
        return;
      }

      let location = null;
      try {
        location = await Location.getLastKnownPositionAsync({});
      } catch (e) {
        // Silently catch
      }

      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
      
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        const city = address.city || address.subregion || 'Chennai';
        const neighborhood = address.district || address.name || 'Nearby';
        setLocationName(`${neighborhood}, ${city}`);
        
        if (!isInitial) {
          Toast.show({
            type: 'success',
            text1: 'Location Updated',
            text2: `Set to ${neighborhood}, ${city}`,
            position: 'top',
          });
        }
      } else {
        setLocationName('Chennai, TN');
      }
    } catch (error) {
      setLocationName('Adyar, Chennai');
      if (!isInitial) {
        Toast.show({
          type: 'info',
          text1: 'Location Unavailable',
          text2: 'Using default location (Adyar, Chennai).',
          position: 'top',
        });
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadProperties();
      fetchLocation(true); // Silently fetch location on focus
      
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

    // 4. Apply sorting
    if (sortBy === 'trustDesc') {
      result.sort((a, b) => b.trustScore - a.trustScore);
    } else if (sortBy === 'reviewsDesc') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [properties, searchQuery, selectedType, activeFilters, sortBy]);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'trustDesc':
        return 'Top Trusted';
      case 'reviewsDesc':
        return 'Most Reviewed';
      default:
        return 'Sort By';
    }
  };

  const cycleSort = () => {
    const options: SortOption[] = ['default', 'trustDesc', 'reviewsDesc'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const typesList = ['All', 'PG', 'Hostel', 'Hotel', 'Service Apartment', 'Rental Room', 'Co-Living Property'];

  // Check if any filters are currently active to show indicators
  const filterCount = Object.values(activeFilters).filter(val => val !== undefined && val !== null && val !== false && val !== 'All').length;

  return (
    <SafeAreaView className="flex-1 bg-slate-50/50" edges={['top', 'left', 'right']}>
      {/* Top Header with Location Fetching */}
      <View className="px-5 pt-4 pb-3 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View className="flex-row items-center flex-1">
          <View className="bg-primary-600 p-2 rounded-xl flex-row items-center justify-center">
            <Ionicons name="compass-outline" size={18} color="#ffffff" />
          </View>
          <View className="ml-3 flex-1 justify-center">
            <Text className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Search Location</Text>
            
            <TouchableOpacity 
              onPress={() => fetchLocation(false)} 
              className="flex-row items-center mt-0.5"
              activeOpacity={0.7}
            >
              <Ionicons name="location" size={12} color="#2563eb" />
              <Text className="text-xs font-black text-slate-800 ml-1 mr-1.5 truncate max-w-[140px]">
                {locationName}
              </Text>
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#2563eb" style={{ transform: [{ scale: 0.7 }] }} />
              ) : (
                <Ionicons name="chevron-down" size={10} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center space-x-2.5">
          <TouchableOpacity 
            onPress={() => Toast.show({ type: 'info', text1: 'Notifications dashboard mock.' })}
            className="p-2.5 bg-slate-50 border border-slate-100 rounded-full"
          >
            <Ionicons name="notifications-outline" size={16} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 px-5 pt-4">
        {/* Search Input Bar */}
        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-1.5 mb-4 shadow-sm shadow-slate-100/5">
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-xs font-semibold h-10"
            placeholder="Search by name, area, city..."
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
            <Ionicons name="funnel-outline" size={16} color={filterCount > 0 ? '#2563eb' : '#475569'} />
            {filterCount > 0 && (
              <View className="bg-primary-600 rounded-full h-4 w-4 justify-center items-center ml-1">
                <Text className="text-white text-[8px] font-black">{filterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Accommodation Types Horizontal scroll */}
        <View className="mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2 gap-2">
            {typesList.map((type) => {
              const active = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full border ${
                    active ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className={`text-[10px] font-black uppercase tracking-wider ${active ? 'text-white' : 'text-slate-500'}`}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Sorting controls */}
        <View className="flex-row justify-between items-center mt-2 mb-3.5 px-1">
          <Text className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            Showing {filteredAndSortedProperties.length} results
          </Text>
          
          <TouchableOpacity
            onPress={cycleSort}
            className="flex-row items-center border border-slate-200 bg-white px-3.5 py-1.5 rounded-full shadow-sm shadow-slate-100/5"
          >
            <Ionicons name="swap-vertical" size={12} color="#475569" />
            <Text className="text-slate-600 text-[10px] font-black ml-1.5">{getSortLabel()}</Text>
          </TouchableOpacity>
        </View>

        {/* Results list */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <FlatList
            data={filteredAndSortedProperties}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PGCard item={item} navigation={navigation} />}
            contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
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
      </View>
    </SafeAreaView>
  );
}
