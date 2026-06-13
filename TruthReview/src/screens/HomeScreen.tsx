import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootState } from '../store';
import { MockDb, Property } from '../services/mockDb';
import SearchBar from '../components/SearchBar';
import PGCard from '../components/PGCard';
import { MainTabParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabParamList, 'HomeStack'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [trendingComplaints, setTrendingComplaints] = useState<{ category: string, count: number, trend: 'up' | 'down' | 'stable' }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    const props = await MockDb.getProperties();
    setProperties(props);

    const trends = await MockDb.getTrendingComplaints();
    setTrendingComplaints(trends);
  };

  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
    }
  }, [isFocused]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Sections data filtering
  const topTrusted = properties.filter((p) => p.trustScore >= 75).sort((a, b) => b.trustScore - a.trustScore);
  const verifiedProperties = properties.filter((p) => p.claimedBy !== null || p.trustScore >= 80);
  const recentlyReviewed = properties.filter((p) => p.reviewsCount > 0);
  const recommended = [...properties].sort((a, b) => b.price - a.price);

  const popularAreas = ['Adyar', 'Velachery', 'T. Nagar', 'Perungudi', 'Tambaram'];

  const handleAreaPress = (area: string) => {
    navigation.navigate('SearchStack', {
      screen: 'Search',
      params: { query: area }
    } as any);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return { name: 'trending-up-outline', col: 'text-red-500', bg: 'bg-red-50' };
      case 'down':
        return { name: 'trending-down-outline', col: 'text-green-500', bg: 'bg-green-50' };
      case 'stable':
        return { name: 'remove-outline', col: 'text-slate-400', bg: 'bg-slate-50' };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header section with glassmorphism touches */}
      <View className="px-5 pt-6 pb-2 flex-row justify-between items-center border-b border-slate-50">
        <View>
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Truth Review Platform</Text>
          <Text className="text-xl font-extrabold text-slate-800 mt-0.5">Hi, {user?.name || 'Guest'} 👋</Text>
          {user && (
            <View className="flex-row items-center mt-1">
              <View className="bg-primary-50 px-2 py-0.5 rounded-md">
                <Text className="text-[9px] text-primary-700 font-extrabold uppercase">{user.role} Account</Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
          onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}
        >
          <Ionicons name="person-outline" size={18} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />}
      >
        {/* Search Bar section */}
        <View className="px-5 mt-6 mb-6">
          <SearchBar
            onPress={() => navigation.navigate('SearchStack', { screen: 'Search' })}
            onFilterPress={() => navigation.navigate('SearchStack', { screen: 'Filters' })}
          />
        </View>

        {/* Popular Areas */}
        <View className="mb-6">
          <Text className="text-base font-extrabold text-slate-800 px-5 mb-3">Popular Chennai Areas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-5 space-x-2 gap-2">
            {popularAreas.map((area) => (
              <TouchableOpacity
                key={area}
                onPress={() => handleAreaPress(area)}
                className="bg-slate-50 border border-slate-150 px-4 py-2.5 rounded-full active:bg-slate-100"
              >
                <Text className="text-slate-700 text-xs font-bold">📍 {area}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Trusted Properties (Trust Score >= 75) */}
        {topTrusted.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center px-5 mb-3">
              <Text className="text-base font-extrabold text-slate-800">Top Trusted Accommodations</Text>
              <Text className="text-[10px] text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-md uppercase">Score &gt;= 75</Text>
            </View>
            <FlatList
              data={topTrusted}
              keyExtractor={(item) => `trust_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
              renderItem={({ item }) => (
                <View className="w-72 mr-4">
                  <PGCard item={item as any} />
                </View>
              )}
            />
          </View>
        )}

        {/* Trending Complaints Panel */}
        {trendingComplaints.length > 0 && (
          <View className="px-5 mb-6">
            <View className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm">
              <Text className="text-base font-extrabold text-slate-800">Trending Issues</Text>
              <Text className="text-xs font-semibold text-slate-400 mt-0.5 mb-4">Real-time resident complaints aggregate</Text>

              <View className="space-y-3 gap-3">
                {trendingComplaints.map((item) => {
                  const trendInfo = getTrendIcon(item.trend);
                  return (
                    <View key={item.category} className="flex-row justify-between items-center py-1.5 border-b border-slate-100/50">
                      <Text className="text-slate-700 text-xs font-bold">{item.category}</Text>
                      <View className="flex-row items-center">
                        <View className="bg-slate-200/55 px-2.5 py-1 rounded-lg mr-2">
                          <Text className="text-slate-800 text-[10px] font-black">{item.count} flagged</Text>
                        </View>
                        <View className={`p-1 rounded-md ${trendInfo.bg}`}>
                          <Ionicons name={trendInfo.name as any} size={14} className={trendInfo.col} />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Verified Properties (Claimed by owner or high trust) */}
        {verifiedProperties.length > 0 && (
          <View className="mb-6">
            <Text className="text-base font-extrabold text-slate-800 px-5 mb-3">Verified Properties</Text>
            <FlatList
              data={verifiedProperties}
              keyExtractor={(item) => `veri_prop_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
              renderItem={({ item }) => (
                <View className="w-72 mr-4">
                  <PGCard item={item as any} />
                </View>
              )}
            />
          </View>
        )}

        {/* Recently Reviewed Properties */}
        {recentlyReviewed.length > 0 && (
          <View className="mb-6">
            <Text className="text-base font-extrabold text-slate-800 px-5 mb-3">Recently Reviewed</Text>
            <FlatList
              data={recentlyReviewed}
              keyExtractor={(item) => `recent_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
              renderItem={({ item }) => (
                <View className="w-72 mr-4">
                  <PGCard item={item as any} />
                </View>
              )}
            />
          </View>
        )}

        {/* Suggest Property card banner */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileStack', { screen: 'AddProperty' })}
            className="bg-primary-600/90 border border-primary-500 rounded-3xl p-5 shadow-md flex-row justify-between items-center"
          >
            <View className="flex-1 mr-3">
              <Text className="text-white text-base font-extrabold">Can't find an accommodation?</Text>
              <Text className="text-primary-100 text-xs mt-1 font-semibold">Suggest a new PG, Hostel, or Rental Room to help others.</Text>
            </View>
            <View className="bg-white rounded-full p-2.5">
              <Ionicons name="add" size={20} color="#0284c7" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recommended list */}
        <View className="px-5 mb-10">
          <Text className="text-base font-extrabold text-slate-800 mb-4">Recommended For You</Text>
          {recommended.map((item) => (
            <PGCard key={item.id} item={item as any} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
