import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Image } from 'react-native';
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
import { useTheme } from '../features/theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, 'Search'>;

type SortOption = 'default' | 'trustDesc' | 'reviewsDesc';

export default function SearchScreen({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Location Fetching State
  const [locationName, setLocationName] = useState('Whitefield, Bangalore');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);

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
        setLocationName('Whitefield, Bangalore');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Whitefield, Bangalore');
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
        const city = address.city || address.subregion || 'Bangalore';
        const neighborhood = address.district || address.name || 'Whitefield';
        setLocationName(`${neighborhood}, ${city}`);
      } else {
        setLocationName('Bangalore, KA');
      }
    } catch (error) {
      setLocationName('Whitefield, Bangalore');
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadProperties();

      const passedLocation = route.params?.location;
      const passedQuery = route.params?.query;

      if (passedLocation || passedQuery) {
        if (passedLocation) {
          const citySuffix = ['Adyar', 'Velachery', 'T Nagar', 'OMR'].includes(passedLocation) ? ', Chennai' : ', Bangalore';
          setLocationName(`${passedLocation}${citySuffix}`);
          setHasFetchedLocation(true);
        }
        if (passedQuery) {
          setSearchQuery(passedQuery);
        }
        navigation.setParams({ location: undefined, query: undefined } as any);
      } else if (!hasFetchedLocation) {
        fetchLocation(true);
        setHasFetchedLocation(true);
      }
    }
  }, [isFocused, route.params?.location, route.params?.query, hasFetchedLocation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const props = await MockDb.getProperties();
    setProperties(props);
    setRefreshing(false);
  };

  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

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

    if (selectedType !== 'ALL') {
      const mapType = selectedType === 'SERVICE APARTMENT' ? 'Service Apartment' : selectedType === 'CO-LIVING' ? 'Co-Living Property' : selectedType === 'RENTAL' ? 'Rental Room' : selectedType.charAt(0) + selectedType.slice(1).toLowerCase();
      result = result.filter((p) => p.type.toLowerCase() === mapType.toLowerCase() || p.type.toLowerCase().includes(selectedType.toLowerCase()));
    }

    // Filters logic
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

    if (sortBy === 'trustDesc') {
      result.sort((a, b) => b.trustScore - a.trustScore);
    } else if (sortBy === 'reviewsDesc') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [properties, searchQuery, selectedType, activeFilters, sortBy]);

  const cycleSort = () => {
    const options: SortOption[] = ['default', 'trustDesc', 'reviewsDesc'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const typesList = ['ALL', 'PG', 'HOSTEL', 'HOTEL', 'SERVICE APARTMENT', 'RENTAL', 'CO-LIVING'];

  const filterCount = Object.values(activeFilters).filter(val => val !== undefined && val !== null && val !== false && val !== 'All').length;

  const textDark = isDark ? 'text-white' : 'text-[#0f172a]';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const bgStyles = isDark ? 'bg-[#0f172a]' : 'bg-[#fafafa]';
  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';

  const renderHeader = () => (
    <View className="px-5 pt-4">
      {/* Search Location Blue Card */}
      <View className={`rounded-2xl p-4 flex-row items-center shadow-sm mb-4 border ${cardBg}`}>
        <View className="bg-[#1d4ed8] w-10 h-10 rounded-xl items-center justify-center shadow-md">
          <Ionicons name="compass" size={20} color="#ffffff" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[10px] font-black uppercase text-[#1d4ed8] tracking-widest mb-0.5">Search Location</Text>
          <TouchableOpacity onPress={() => fetchLocation(false)} className="flex-row items-center">
            <Ionicons name="location" size={12} color="#0f172a" />
            <Text className={`text-[13px] font-black ml-1 ${textDark}`}>
              {locationName}
            </Text>
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#1d4ed8" style={{ marginLeft: 4, transform: [{ scale: 0.6 }] }} />
            ) : (
              <Ionicons name="chevron-down" size={10} color="#64748b" style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="bg-slate-50 p-2 rounded-full border border-slate-200">
          <Ionicons name="settings-outline" size={18} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className={`flex-row items-center border rounded-full px-4 py-1.5 mb-5 shadow-sm ${cardBg}`}>
        <Ionicons name="search-outline" size={20} color="#94a3b8" />
        <TextInput
          className={`flex-1 ml-2 text-[13px] font-medium h-10 ${textDark}`}
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
        <TouchableOpacity onPress={() => navigation.navigate('Filters' as any)} className="border-l border-slate-200 pl-3 py-1 flex-row items-center">
          <Ionicons name="funnel-outline" size={18} color={filterCount > 0 ? '#1d4ed8' : '#64748b'} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View className="mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -20 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {typesList.map((type) => {
            const active = selectedType === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedType(type)}
                className={`px-5 py-2.5 rounded-full border ${active
                    ? 'bg-[#1d4ed8] border-[#1d4ed8]'
                    : isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}
              >
                <Text className={`text-[11px] font-black uppercase tracking-wider ${active ? 'text-white' : textDark}`}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results & Sort */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
          Showing <Text className={`text-[#1d4ed8]`}>{filteredAndSortedProperties.length}</Text> Results
        </Text>

        <TouchableOpacity onPress={cycleSort} className="flex-row items-center">
          <Ionicons name="swap-vertical" size={12} color="#1d4ed8" />
          <Text className={`text-[11px] font-black ml-1 ${textDark}`}>Sort By</Text>
          <Ionicons name="chevron-down" size={10} color={isDark ? '#94a3b8' : '#475569'} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View className="px-5 pt-4 pb-24">
      {/* FEATURED ADS */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-[12px] font-black uppercase tracking-widest ${textDark}`}>Featured Ads</Text>
          <TouchableOpacity><Text className="text-[#1d4ed8] text-[11px] font-bold">View all</Text></TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -20 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
        >
          {[
            { title: 'PAYING GUESTS', price: '₹6,500', btn: 'Explore PGs', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400' },
            { title: 'HOSTELS', price: '₹5,000', btn: 'Explore Hostels', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' },
            { title: 'SERVICE APARTMENTS', price: '₹18,000', btn: 'Explore Now', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
            { title: 'CO-LIVING SPACES', price: '₹7,500', btn: 'Explore Spaces', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400' }
          ].map((ad, i) => (
            <View key={i} className="w-[175px] h-[200px] rounded-[20px] overflow-hidden relative shadow-md">
              <Image source={{ uri: ad.img }} className="w-full h-full object-cover" />
              <View className="absolute inset-0" style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)' }} />
              <View className="absolute top-4 left-4 right-4">
                <Text className="text-white text-[10px] font-black uppercase mb-1 tracking-wider">{ad.title}</Text>
                <Text className="text-slate-300 text-[9px] font-semibold mb-0.5">Starting from</Text>
                <Text className="text-white text-[15px] font-black">{ad.price} <Text className="text-[10px] font-medium text-slate-300">/mo</Text></Text>
              </View>
              <View className="absolute bottom-4 left-4 right-4">
                <TouchableOpacity className="bg-white py-2.5 rounded-xl items-center flex-row justify-center shadow-sm active:scale-95" activeOpacity={0.8}>
                  <Text className="text-[#0f172a] text-[10px] font-black tracking-wide">{ad.btn}</Text>
                  <Ionicons name="arrow-forward" size={10} color="#0f172a" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* POPULAR LOCALITIES */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-[12px] font-black uppercase tracking-widest ${textDark}`}>Popular Localities</Text>
          <TouchableOpacity><Text className="text-[#1d4ed8] text-[11px] font-bold">View all</Text></TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -20 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
        >
          {[
            { name: 'Whitefield', props: '128+', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200' },
            { name: 'Koramangala', props: '96+', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200' },
            { name: 'HSR Layout', props: '84+', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200' },
            { name: 'Indiranagar', props: '72+', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200' },
            { name: 'Marathahalli', props: '65+', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200' }
          ].map((loc, i) => (
            <TouchableOpacity key={i} className="w-[130px]" activeOpacity={0.8}>
              <View className="w-full h-[85px] rounded-[16px] overflow-hidden mb-2 shadow-sm">
                <Image source={{ uri: loc.img }} className="w-full h-full object-cover" />
              </View>
              <View className="px-1">
                <Text className={`text-[12px] font-black ${textDark}`} numberOfLines={1}>{loc.name}</Text>
                <Text className={`text-[9px] font-semibold ${textMuted} mt-0.5`}>{loc.props} Properties</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* WHY CHOOSE US */}
      <View className="mb-4">
        <Text className={`text-[12px] font-black uppercase tracking-widest ${textDark} mb-4`}>Why Choose Us</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -20 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
        >
          {[
            { title: '100% Verified\nProperties', sub: 'All properties are\nmanually verified', icon: 'shield-checkmark', color: '#1d4ed8', bg: 'rgba(29, 78, 216, 0.1)' },
            { title: 'Trusted by\n10K+ Users', sub: 'Real reviews from\nverified residents', icon: 'people', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
            { title: '24x7 Customer\nSupport', sub: 'We\'re here to help\nyou anytime', icon: 'headset', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
            { title: 'Secure & Safe\nBookings', sub: 'Your safety and privacy\nare our priority', icon: 'lock-closed', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' }
          ].map((item, i) => (
            <View key={i} className={`w-[195px] h-[80px] rounded-[18px] p-3 flex-row items-center border ${cardBg} shadow-sm`}>
              <View style={{ backgroundColor: item.bg }} className="w-9 h-9 rounded-full items-center justify-center mr-3">
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className={`text-[10px] font-black ${textDark} leading-tight mb-0.5`}>{item.title}</Text>
                <Text className={`text-[8px] font-semibold ${textMuted} leading-normal`}>{item.sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${bgStyles}`} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View className={`px-5 pt-3 pb-2 flex-row justify-between items-start`}>
        <View>
          <Text className={`text-[22px] font-black ${textDark} tracking-tight`}>Explore</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={12} color="#1d4ed8" />
            <Text className={`text-[11px] font-black text-[#1d4ed8] ml-1`}>
              {locationName}
            </Text>
            <Ionicons name="chevron-down" size={10} color="#1d4ed8" style={{ marginLeft: 4 }} />
          </View>
        </View>
        
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => Toast.show({ type: 'info', text1: 'Notifications' })} className="p-1 relative">
            <Ionicons name="notifications-outline" size={22} color={textDark} />
            <View className="absolute right-1 top-1 w-2.5 h-2.5 bg-[#1d4ed8] rounded-full border-2 border-white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}>
            <Image source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}} className="w-8 h-8 rounded-full border border-slate-200" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area via FlatList */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1d4ed8" />
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-5">
              <PGCard item={item} navigation={navigation} />
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View className="px-5">
              <EmptyState
                title="No Properties Found"
                description="We couldn't find any listings matching your search or filters. Try adjusting your criteria."
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
