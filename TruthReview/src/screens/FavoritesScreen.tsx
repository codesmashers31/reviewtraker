import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootState } from '../store';
import { MockDb, Property } from '../services/mockDb';
import PGCard from '../components/PGCard';
import { useTheme } from '../features/theme/ThemeContext';

const { width } = Dimensions.get('window');

export default function FavoritesScreen({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
  const isFocused = useIsFocused();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    setLoading(false);
    const props = await MockDb.getProperties();
    setProperties(props);
  };

  useEffect(() => {
    if (isFocused) {
      loadProperties();
    }
  }, [isFocused]);

  const favoritedPGs = properties.filter((pg) => wishlistItems.includes(pg.id));
  const recommendedPGs = properties.slice(0, 4); // Take first 4 for recommendations

  const textDark = isDark ? 'text-white' : 'text-[#0f172a]';
  const bgStyles = isDark ? 'bg-[#0f172a]' : 'bg-[#fafafa]';
  
  const popularSearches = [
    { title: 'PG in Koramangala', icon: 'business-outline' },
    { title: 'Hostels in Bangalore', icon: 'bed-outline' },
    { title: 'Rentals in HSR Layout', icon: 'home-outline' },
    { title: 'Co-living in Indiranagar', icon: 'people-outline' },
  ];

  const benefits = [
    { title: 'Price Alerts', desc: 'Get notified when prices drop', icon: 'notifications-outline', color: '#3b82f6', bg: 'bg-blue-50' },
    { title: 'Compare', desc: 'Easily compare amenities', icon: 'git-compare-outline', color: '#10b981', bg: 'bg-emerald-50' },
    { title: 'Fast Booking', desc: 'Access top choices instantly', icon: 'flash-outline', color: '#f59e0b', bg: 'bg-amber-50' }
  ];

  const collections = [
    { title: 'Luxury Stays', count: '124 Places', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400' },
    { title: 'Budget Friendly', count: '540+ Places', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' },
    { title: 'Student Hubs', count: '89 Places', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400' }
  ];

  return (
    <SafeAreaView className={`flex-1 ${bgStyles}`} edges={['top', 'left', 'right']}>
      {/* HEADER */}
      <View className="px-5 pt-6 pb-2 flex-row justify-between items-start border-b border-slate-100">
        <View>
          <Text className={`text-[24px] font-black tracking-tight text-[#1e3a8a] mb-1 ${isDark ? 'text-blue-400' : ''}`}>My Favorites</Text>
          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={12} color="#1d4ed8" />
            <Text className="text-[11px] text-slate-500 font-medium ml-1.5">
              Places you love, saved for later
            </Text>
          </View>
        </View>
        <TouchableOpacity className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center shadow-sm shadow-blue-100">
          <Ionicons name="settings" size={20} color="#1d4ed8" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-grow justify-center items-center">
          <Text className="text-slate-400 font-bold">Loading favorites...</Text>
        </View>
      ) : favoritedPGs.length > 0 ? (
        <FlatList
          data={favoritedPGs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PGCard item={item} navigation={navigation} />}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        /* ENHANCED CUSTOM EMPTY STATE */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Main Empty Section */}
          <View className="bg-gradient-to-b from-blue-50/50 to-transparent pb-8 pt-4">
            {/* Illustration */}
            <View className="h-48 items-center justify-center relative overflow-hidden">
              <View className="absolute inset-0 items-center justify-center opacity-60">
                <Ionicons name="cloud" size={40} color="#e0f2fe" style={{ position: 'absolute', top: 20, left: 60 }} />
                <Ionicons name="cloud" size={30} color="#e0f2fe" style={{ position: 'absolute', bottom: 30, right: 40 }} />
                <Ionicons name="star" size={12} color="#bfdbfe" style={{ position: 'absolute', top: 10, right: 120 }} />
                <Ionicons name="airplane" size={16} color="#bae6fd" style={{ position: 'absolute', top: 20, left: 80, transform: [{ rotate: '-45deg' }] }} />
              </View>

              <View className="items-center z-10 mt-6">
                <View className="relative items-center mb-[-15px] z-20">
                  <Ionicons name="heart-outline" size={60} color="#60a5fa" style={{ opacity: 0.9 }} />
                </View>
                <View className="w-24 h-16 bg-[#bfdbfe] rounded-sm opacity-90 border-t-8 border-[#93c5fd] items-center justify-center relative">
                  <View className="absolute -top-3 left-0 w-10 h-4 bg-[#bfdbfe] rounded-sm transform -rotate-12 origin-bottom-left" />
                  <View className="absolute -top-3 right-0 w-10 h-4 bg-[#bfdbfe] rounded-sm transform rotate-12 origin-bottom-right" />
                  <View className="w-12 h-8 bg-[#93c5fd] opacity-40 rounded" />
                </View>
              </View>
            </View>

            {/* Empty State Text & CTA */}
            <View className="px-8 items-center mb-4">
              <Text className={`text-[18px] font-black text-[#0f172a] mb-2 text-center ${isDark ? 'text-white' : ''}`}>Your Wishlist is Empty</Text>
              <Text className="text-[12px] text-slate-500 text-center leading-5 font-medium max-w-[280px]">
                You haven't added any listings to your favorites yet. Tap the heart icon on any card to save it.
              </Text>

              <TouchableOpacity 
                onPress={() => navigation.navigate('SearchStack', { screen: 'Search' } as any)}
                className="mt-6 bg-[#1d4ed8] px-8 py-3.5 rounded-full flex-row items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Ionicons name="search" size={16} color="#ffffff" />
                <Text className="text-white text-[13px] font-black ml-1.5 tracking-wide">Start Exploring</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="h-2 bg-slate-50" />

          {/* Benefits of Saving */}
          <View className="py-6 px-5 border-b border-slate-100">
            <Text className={`text-[13px] font-black uppercase tracking-widest text-[#0f172a] mb-4 ${isDark ? 'text-white' : ''}`}>Why Save Places?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 gap-3">
              {benefits.map((item, idx) => (
                <View key={idx} className="w-[150px] border border-slate-200 rounded-2xl p-4 shadow-sm bg-white">
                  <View className={`${item.bg} w-8 h-8 rounded-full items-center justify-center mb-3`}>
                    <Ionicons name={item.icon as any} size={16} color={item.color} />
                  </View>
                  <Text className="text-[12px] font-black text-slate-800 mb-1">{item.title}</Text>
                  <Text className="text-[10px] text-slate-500 font-medium leading-3">{item.desc}</Text>
                </View>
              ))}
              <View className="w-5" />
            </ScrollView>
          </View>

          {/* Curated Collections */}
          <View className="py-6 px-5 border-b border-slate-100 bg-slate-50">
            <Text className={`text-[13px] font-black uppercase tracking-widest text-[#0f172a] mb-4 ${isDark ? 'text-white' : ''}`}>Curated Collections</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 gap-3">
              {collections.map((col, idx) => (
                <TouchableOpacity key={idx} className="w-[140px] h-[160px] rounded-2xl overflow-hidden relative shadow-sm">
                  <Image source={{ uri: col.img }} className="w-full h-full object-cover" />
                  <View className="absolute inset-0 bg-slate-900/40" />
                  <View className="absolute bottom-4 left-3 right-3">
                    <Text className="text-white text-[13px] font-black mb-0.5 leading-4">{col.title}</Text>
                    <Text className="text-blue-200 text-[10px] font-bold">{col.count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <View className="w-5" />
            </ScrollView>
          </View>

          {/* Recommended For You */}
          <View className="py-6 px-5 border-b border-slate-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-[13px] font-black uppercase tracking-widest text-[#0f172a] ${isDark ? 'text-white' : ''}`}>Recommended For You</Text>
              <TouchableOpacity>
                <Text className="text-[#1d4ed8] text-[11px] font-bold">View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 gap-4">
              {recommendedPGs.map((item, idx) => (
                <View key={idx} className="w-[280px]">
                  <PGCard item={item} navigation={navigation} />
                </View>
              ))}
              <View className="w-5" />
            </ScrollView>
          </View>

          {/* Popular Searches */}
          <View className="py-6 px-5 bg-slate-50">
            <Text className={`text-[13px] font-black uppercase tracking-widest text-[#0f172a] mb-4 ${isDark ? 'text-white' : ''}`}>Popular Searches</Text>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {popularSearches.map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  className={`w-[48%] border border-slate-200 rounded-full px-3 py-3 flex-row items-center shadow-sm bg-white`}
                >
                  <Ionicons name={item.icon as any} size={14} color="#3b82f6" />
                  <Text className={`text-[10px] font-bold text-slate-700 ml-2 flex-1`} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}
