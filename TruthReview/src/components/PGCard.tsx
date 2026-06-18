import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Property, MockDb, Review } from '../services/mockDb';
import { RootState } from '../store';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { HomeStackParamList } from '../navigation/types';
import { useTheme } from '../features/theme/ThemeContext';

interface PGCardProps {
  item: Property;
  navigation: any;
}

export default function PGCard({ item, navigation }: PGCardProps) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isFavorited = wishlistItems.includes(item.id);

  const [latestReview, setLatestReview] = useState<Review | null>(null);
  const [reviewsCount, setReviewsCount] = useState(item.reviewsCount);
  const [avgRating, setAvgRating] = useState<string>('N/A');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const allReviews = await MockDb.getReviews();
        const propReviews = allReviews.filter(r => r.propertyId === item.id);
        setReviewsCount(propReviews.length);
        if (propReviews.length > 0) {
          setLatestReview(propReviews[0]);
          const sum = propReviews.reduce((acc, r) => acc + r.ratings.overall, 0);
          setAvgRating((sum / propReviews.length).toFixed(1));
        } else {
          setLatestReview(null);
          setAvgRating('N/A');
        }
      } catch (err) {
        console.log("Error loading reviews in card:", err);
      }
    };
    fetchReviews();
  }, [item.id]);

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    if (isFavorited) {
      dispatch(removeFromWishlist(item.id));
    } else {
      dispatch(addToWishlist(item.id));
    }
  };

  const getGenderLabel = () => {
    switch (item.genderType) {
      case 'boys':
        return { text: 'Boys Only', bg: 'bg-blue-900/60 border border-blue-500/35', textCol: 'text-blue-300' };
      case 'girls':
        return { text: 'Girls Only', bg: 'bg-pink-950/60 border border-pink-500/35', textCol: 'text-pink-300' };
      case 'unisex':
        return { text: 'Co-Ed', bg: 'bg-purple-950/60 border border-purple-500/35', textCol: 'text-purple-300' };
      default:
        return { text: 'Any Gender', bg: 'bg-slate-800 border border-slate-700', textCol: 'text-slate-300' };
    }
  };

  const getTrustBandColor = (score: number) => {
<<<<<<< HEAD
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500', bgLight: 'bg-emerald-950/30' };
    if (score >= 75) return { text: 'Good', color: 'text-secondary-500', bg: 'bg-secondary-500', bgLight: 'bg-secondary-950/30' };
    if (score >= 50) return { text: 'Average', color: 'text-amber-400', bg: 'bg-amber-500', bgLight: 'bg-amber-950/30' };
    return { text: 'Poor', color: 'text-rose-400', bg: 'bg-rose-500', bgLight: 'bg-rose-950/30' };
=======
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50' };
    if (score >= 75) return { text: 'Good', color: 'text-teal-600', bg: 'bg-teal-500', bgLight: 'bg-teal-50' };
    if (score >= 50) return { text: 'Average', color: 'text-amber-600', bg: 'bg-amber-500', bgLight: 'bg-amber-50' };
    return { text: 'Poor', color: 'text-rose-600', bg: 'bg-rose-500', bgLight: 'bg-rose-50' };
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
  };

  const genderInfo = getGenderLabel();
  const trustBand = getTrustBandColor(item.trustScore);

  return (
    <Pressable
<<<<<<< HEAD
      className="bg-card rounded-4xl overflow-hidden shadow-premium mb-6 active:opacity-95 border border-borderSubtle"
=======
      className={`border rounded-[24px] overflow-hidden shadow-sm mb-5 active:opacity-95 ${isDark ? 'bg-slate-900 border-slate-850 shadow-slate-950/20' : 'bg-white border-slate-100 shadow-slate-100/50'}`}
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
      onPress={() => navigation.navigate('PGDetails', { pgId: item.id } as any)}
    >
      {/* Property Image Container */}
      <View className="h-48 w-full relative">
        <Image
          source={{ uri: item.images[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80' }}
          className="h-full w-full object-cover"
        />
<<<<<<< HEAD
        <View className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        
        {/* Floating Category Tag */}
        <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex-row items-center border border-white/10">
          <Ionicons 
            name={item.type === 'Hotel' || item.type === 'Service Apartment' ? 'bed-outline' : 'business-outline'} 
            size={10} 
            color="#ffffff" 
=======
        <View className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

        {/* Floating Category Tag */}
        <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex-row items-center">
          <Ionicons
            name={item.type === 'Hotel' || item.type === 'Service Apartment' ? 'bed-outline' : 'business-outline'}
            size={10}
            color="#ffffff"
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
          />
          <Text className="text-white text-[8px] font-black uppercase ml-1 tracking-wider">{item.type}</Text>
        </View>

        {/* Floating Gender Restriction Badge */}
        {item.genderType !== 'none' && (
          <View className={`absolute top-4 left-24 px-3 py-1 rounded-full ${genderInfo.bg}`}>
            <Text className={`${genderInfo.textCol} text-[8px] font-black uppercase tracking-wider`}>
              {genderInfo.text}
            </Text>
          </View>
        )}

        {/* Claimed/Verified Stamp */}
        {(item.claimedBy !== null || item.trustScore >= 80) && (
          <View className="absolute bottom-4 left-4 bg-accent-500 rounded-full px-3 py-1 flex-row items-center shadow-md">
            <Ionicons name="checkmark-circle" size={10} color="#1A1D29" />
            <Text className="text-[#1A1D29] text-[8px] font-black ml-1 uppercase tracking-wider">Verified Property</Text>
          </View>
        )}

        {/* Favorite Heart Button */}
        <TouchableOpacity
          className="absolute top-4 right-4 h-9 w-9 bg-[#1A1D29]/80 rounded-full justify-center items-center shadow-sm border border-white/15 active:scale-95"
          onPress={toggleFavorite}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={18}
<<<<<<< HEAD
            color={isFavorited ? '#D4A5A5' : '#D1D5DB'}
=======
            color={isFavorited ? '#FF6B6B' : '#475569'}
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
          />
        </TouchableOpacity>
      </View>

      {/* Property Details Container */}
      <View className="p-5">
        {/* Title and location row */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
<<<<<<< HEAD
            <Text className="text-md font-black text-text leading-5" numberOfLines={1}>
=======
            <Text className={`text-md font-black leading-5 ${isDark ? 'text-white' : 'text-slate-800'}`} numberOfLines={1}>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
              {item.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={12} color="#94A3B8" />
              <Text className="text-[10px] text-textMuted ml-0.5 truncate">{item.address || item.location}</Text>
            </View>
          </View>
        </View>

        {/* Trust Score & Stars Section */}
<<<<<<< HEAD
        <View className="flex-row justify-between items-center mt-4 bg-surface border border-borderSubtle p-4 rounded-3xl">
=======
        <View className={`flex-row justify-between items-center mt-4 p-3.5 rounded-2xl border ${isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50/80 border-slate-100'}`}>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
          <View className="flex-row items-center flex-1">
            <Ionicons name="ribbon-outline" size={16} color="#D4A5A5" />
            <View className="ml-2 flex-1 pr-3">
              <View className="flex-row justify-between items-center mb-0.5">
<<<<<<< HEAD
                <Text className="text-[9px] font-bold text-textMuted uppercase">Trust Score</Text>
                <Text className={`text-[10px] font-black ${trustBand.color}`}>{item.trustScore}%</Text>
              </View>
              <View className="h-1 bg-background rounded-full w-full overflow-hidden">
                <View 
=======
                <Text className={`text-[9px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trust Score</Text>
                <Text className={`text-[10px] font-black ${trustBand.color}`}>{item.trustScore}%</Text>
              </View>
              <View className={`h-1 rounded-full w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <View
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
                  className={`h-full ${trustBand.bg} rounded-full`}
                  style={{ width: `${item.trustScore}%` }}
                />
              </View>
            </View>
          </View>

<<<<<<< HEAD
          <View className="h-6 w-[1px] bg-borderSubtle mx-1" />

          <View className="flex-row items-center pl-3">
            <Ionicons name="star" size={12} color="#D4A5A5" />
            <Text className="text-xs font-black text-text ml-1">{avgRating}</Text>
            <Text className="text-[9px] text-textMuted font-medium ml-1">({reviewsCount})</Text>
=======
          <View className={`h-6 w-[1px] mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200/80'}`} />

          <View className="flex-row items-center pl-3">
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text className={`text-xs font-black ml-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {avgRating}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium ml-1">({reviewsCount})</Text>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
          </View>
        </View>

        {/* Latest Review Snippet Quote */}
        {latestReview ? (
<<<<<<< HEAD
          <View className="mt-4 bg-surface border-l-2 border-accent-500 p-3.5 rounded-r-xl border border-borderSubtle border-l-0">
=======
          <View className={`mt-4 border-l-2 p-3.5 rounded-r-xl ${isDark ? 'bg-slate-850/40 border-slate-700' : 'bg-slate-50/40 border-slate-300'}`}>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
            <View className="flex-row justify-between items-center">
              <Text className="text-[9px] font-black text-[#D4A5A5] uppercase">
                Latest Resident Review
              </Text>
              {latestReview.verified && (
                <View className="bg-accent-500/10 border border-accent-500/20 px-1.5 py-0.5 rounded-md flex-row items-center">
                  <Ionicons name="shield-checkmark" size={8} color="#D4A5A5" />
                  <Text className="text-[#D4A5A5] text-[7px] font-extrabold uppercase ml-0.5">Verified Stay</Text>
                </View>
              )}
            </View>
<<<<<<< HEAD
            <Text className="text-xs text-textBody italic mt-1.5 leading-4" numberOfLines={2}>
=======
            <Text className={`text-xs italic mt-1.5 leading-4 ${isDark ? 'text-slate-350' : 'text-slate-600'}`} numberOfLines={2}>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
              "{latestReview.comment}"
            </Text>
          </View>
        ) : (
<<<<<<< HEAD
          <View className="mt-4 bg-surface/50 border-l-2 border-borderSubtle p-3.5 rounded-r-xl">
            <Text className="text-xs text-textMuted italic">No reviews posted yet. Be the first to share your experience!</Text>
=======
          <View className={`mt-4 border-l-2 p-3.5 rounded-r-xl ${isDark ? 'bg-slate-850/40 border-slate-850' : 'bg-slate-50/40 border-slate-200'}`}>
            <Text className="text-xs text-slate-400 italic">No reviews posted yet. Be the first to share your experience!</Text>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
          </View>
        )}
      </View>
    </Pressable>
  );
}
