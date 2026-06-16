import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Property, MockDb, Review } from '../services/mockDb';
import { RootState } from '../store';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { HomeStackParamList } from '../navigation/types';

interface PGCardProps {
  item: Property;
  navigation: any;
}

export default function PGCard({ item, navigation }: PGCardProps) {
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
        return { text: 'Boys Only', bg: 'bg-blue-600', textCol: 'text-white' };
      case 'girls':
        return { text: 'Girls Only', bg: 'bg-pink-600', textCol: 'text-white' };
      case 'unisex':
        return { text: 'Co-Ed', bg: 'bg-purple-600', textCol: 'text-white' };
      default:
        return { text: 'Any Gender', bg: 'bg-slate-700', textCol: 'text-white' };
    }
  };

  const getTrustBandColor = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50' };
    if (score >= 75) return { text: 'Good', color: 'text-teal-600', bg: 'bg-teal-500', bgLight: 'bg-teal-50' };
    if (score >= 50) return { text: 'Average', color: 'text-amber-600', bg: 'bg-amber-500', bgLight: 'bg-amber-50' };
    return { text: 'Poor', color: 'text-rose-600', bg: 'bg-rose-500', bgLight: 'bg-rose-50' };
  };

  const genderInfo = getGenderLabel();
  const trustBand = getTrustBandColor(item.trustScore);

  return (
    <Pressable
      className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm shadow-slate-100/50 mb-5 active:opacity-95"
      onPress={() => navigation.navigate('PGDetails', { pgId: item.id } as any)}
    >
      {/* Property Image Container */}
      <View className="h-48 w-full relative">
        <Image
          source={{ uri: item.images[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80' }}
          className="h-full w-full object-cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        
        {/* Floating Category Tag */}
        <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex-row items-center">
          <Ionicons 
            name={item.type === 'Hotel' || item.type === 'Service Apartment' ? 'bed-outline' : 'business-outline'} 
            size={10} 
            color="#ffffff" 
          />
          <Text className="text-white text-[8px] font-black uppercase ml-1 tracking-wider">{item.type}</Text>
        </View>

        {/* Floating Gender Restriction Badge */}
        {item.genderType !== 'none' && (
          <View className={`absolute top-4 left-24 px-3 py-1 rounded-full ${genderInfo.bg}`}>
            <Text className="text-white text-[8px] font-black uppercase tracking-wider">
              {genderInfo.text}
            </Text>
          </View>
        )}

        {/* Claimed/Verified Stamp */}
        {(item.claimedBy !== null || item.trustScore >= 80) && (
          <View className="absolute bottom-4 left-4 bg-emerald-500/95 rounded-full px-3 py-1 flex-row items-center">
            <Ionicons name="checkmark-circle" size={10} color="#ffffff" />
            <Text className="text-white text-[8px] font-black ml-1 uppercase tracking-wider">Verified Property</Text>
          </View>
        )}

        {/* Favorite Heart Button */}
        <TouchableOpacity
          className="absolute top-4 right-4 h-9 w-9 bg-white/90 rounded-full justify-center items-center shadow-sm active:scale-95"
          onPress={toggleFavorite}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorited ? '#FF6B6B' : '#475569'}
          />
        </TouchableOpacity>
      </View>

      {/* Property Details Container */}
      <View className="p-5">
        {/* Title and location row */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-md font-black text-slate-800 leading-5" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={12} color="#64748b" />
              <Text className="text-[10px] text-slate-500 ml-0.5 truncate">{item.address || item.location}</Text>
            </View>
          </View>
        </View>

        {/* Trust Score & Stars Section */}
        <View className="flex-row justify-between items-center mt-4 bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl">
          <View className="flex-row items-center flex-1">
            <Ionicons name="ribbon-outline" size={16} color="#10B981" />
            <View className="ml-2 flex-1 pr-3">
              <View className="flex-row justify-between items-center mb-0.5">
                <Text className="text-[9px] font-bold text-slate-500 uppercase">Trust Score</Text>
                <Text className={`text-[10px] font-black ${trustBand.color}`}>{item.trustScore}%</Text>
              </View>
              <View className="h-1 bg-slate-200 rounded-full w-full">
                <View 
                  className={`h-full ${trustBand.bg} rounded-full`}
                  style={{ width: `${item.trustScore}%` }} 
                />
              </View>
            </View>
          </View>

          <View className="h-6 w-[1px] bg-slate-200/80 mx-1" />

          <View className="flex-row items-center pl-3">
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text className="text-xs font-black text-slate-800 ml-1">
              {avgRating}
            </Text>
            <Text className="text-[9px] text-slate-400 font-medium ml-1">({reviewsCount})</Text>
          </View>
        </View>

        {/* Latest Review Snippet Quote */}
        {latestReview ? (
          <View className="mt-4 bg-slate-50/40 border-l-2 border-slate-300 p-3.5 rounded-r-xl">
            <View className="flex-row justify-between items-center">
              <Text className="text-[9px] font-black text-slate-400 uppercase">
                Latest Resident Review
              </Text>
              {latestReview.verified && (
                <View className="bg-emerald-50 px-1.5 py-0.5 rounded-md flex-row items-center">
                  <Ionicons name="shield-checkmark" size={8} color="#10B981" />
                  <Text className="text-emerald-600 text-[7px] font-extrabold uppercase ml-0.5">Verified Stay</Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-slate-600 italic mt-1.5 leading-4" numberOfLines={2}>
              "{latestReview.comment}"
            </Text>
          </View>
        ) : (
          <View className="mt-4 bg-slate-50/40 border-l-2 border-slate-200 p-3.5 rounded-r-xl">
            <Text className="text-xs text-slate-400 italic">No reviews posted yet. Be the first to share your experience!</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
