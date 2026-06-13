import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { mockPGs, PGItem } from '../utils/mockData';
import SearchBar from '../components/SearchBar';
import PGCard from '../components/PGCard';
import EmptyState from '../components/EmptyState';
import { SearchStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, 'Search'>;

type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'ratingDesc';

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'boys' | 'girls' | 'unisex'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter & Sort computation
  const filteredAndSortedPGs = useMemo(() => {
    let result = [...mockPGs];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pg) =>
          pg.name.toLowerCase().includes(query) ||
          pg.location.toLowerCase().includes(query) ||
          pg.facilities.some((f) => f.toLowerCase().includes(query))
      );
    }

    // Apply gender category filter
    if (selectedGender !== 'all') {
      result = result.filter((pg) => pg.type === selectedGender);
    }

    // Apply sorting
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'ratingDesc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedGender, sortBy]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate network pull
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'priceAsc':
        return 'Price: Low to High';
      case 'priceDesc':
        return 'Price: High to Low';
      case 'ratingDesc':
        return 'Top Rated';
      default:
        return 'Sort By';
    }
  };

  const cycleSort = () => {
    const options: SortOption[] = ['default', 'priceAsc', 'priceDesc', 'ratingDesc'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-2 border-b border-slate-50">
        <Text className="text-2xl font-extrabold text-slate-800 mb-4">Find PG Listings</Text>
        
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => navigation.navigate('Filters')}
        />

        {/* Filters and Sorting bar */}
        <View className="flex-row items-center justify-between mt-4 mb-2">
          {/* Gender Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2 gap-2 flex-grow">
            {(['all', 'boys', 'girls', 'unisex'] as const).map((gender) => (
              <TouchableOpacity
                key={gender}
                onPress={() => setSelectedGender(gender)}
                className={`px-4 py-2 rounded-full border ${
                  selectedGender === gender
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold capitalize ${
                    selectedGender === gender ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {gender === 'all' ? 'All Gender' : gender}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort Button */}
          <TouchableOpacity
            onPress={cycleSort}
            className="flex-row items-center border border-slate-200 bg-slate-50 px-3.5 py-2 rounded-full ml-3"
          >
            <Ionicons name="swap-vertical" size={14} color="#475569" />
            <Text className="text-slate-600 text-xs font-bold ml-1.5">{getSortLabel()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedPGs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PGCard item={item} />}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          initialNumToRender={5}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <EmptyState
              title="No Listings Found"
              description="We couldn't find any PGs matching your search query or filters. Try adjusting them."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
