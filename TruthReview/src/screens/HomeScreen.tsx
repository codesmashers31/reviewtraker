import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootState } from '../store';
import { mockPGs, PGItem } from '../utils/mockData';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import PGCard from '../components/PGCard';
import { MainTabParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabParamList, 'HomeStack'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredPGs = mockPGs.filter((pg) => pg.featured);
  
  // Filter popular lists based on quick selection tabs
  const getFilteredPGs = () => {
    if (!selectedCategory) return mockPGs;
    const typeMapping: Record<string, string> = {
      'Boys Only': 'boys',
      'Girls Only': 'girls',
      'Co-Ed': 'unisex',
    };
    const targetType = typeMapping[selectedCategory];
    return mockPGs.filter((pg) => pg.type === targetType);
  };

  const categories = [
    { title: 'Boys Only', icon: '👦' },
    { title: 'Girls Only', icon: '👧' },
    { title: 'Co-Ed', icon: '🏡' },
    { title: 'AC Rooms', icon: '❄️' },
  ];

  const handleCategoryPress = (title: string) => {
    setSelectedCategory(selectedCategory === title ? null : title);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 py-3">
        {/* Header Section */}
        <View className="flex-row justify-between items-center mt-6 mb-4">
          <View>
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Explore Spaces
            </Text>
            <Text className="text-2xl font-extrabold text-slate-800">
              Hi, {user?.name || 'Guest'} 👋
            </Text>
          </View>
          <TouchableOpacity
            className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
            onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}
          >
            <Ionicons name="person-outline" size={18} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Search Input Trigger */}
        <View className="mb-6">
          <SearchBar
            onPress={() => navigation.navigate('SearchStack', { screen: 'Search' })}
            onFilterPress={() => navigation.navigate('SearchStack', { screen: 'Filters' })}
          />
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <Text className="text-lg font-extrabold text-slate-800 mb-3">Categories</Text>
          <View className="flex-row flex-wrap gap-2 justify-between">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.title}
                title={cat.title}
                icon={cat.icon}
                selected={selectedCategory === cat.title}
                onPress={() => handleCategoryPress(cat.title)}
              />
            ))}
          </View>
        </View>

        {/* Featured Section */}
        {!selectedCategory && (
          <View className="mb-6">
            <Text className="text-lg font-extrabold text-slate-800 mb-3">Featured Listings</Text>
            <FlatList
              data={featuredPGs}
              keyExtractor={(item) => `feat_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="w-72 mr-4">
                  <PGCard item={item} />
                </View>
              )}
            />
          </View>
        )}

        {/* Popular Listings Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-extrabold text-slate-800">
              {selectedCategory ? `${selectedCategory} listings` : 'Popular Near You'}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchStack', { screen: 'Search' })}>
              <Text className="text-primary-500 font-bold text-sm">See All</Text>
            </TouchableOpacity>
          </View>

          {getFilteredPGs().map((item) => (
            <PGCard key={item.id} item={item} />
          ))}

          {getFilteredPGs().length === 0 && (
            <View className="items-center py-10">
              <Text className="text-slate-400 font-medium">No listings found in this category.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
