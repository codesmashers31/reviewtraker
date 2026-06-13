import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Property } from '../services/mockDb';
import { RootState } from '../store';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { HomeStackParamList } from '../navigation/types';

interface PGCardProps {
  item: Property;
}

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export default function PGCard({ item }: PGCardProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isFavorited = wishlistItems.includes(item.id);

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
        return { text: 'Boys Only', bg: 'bg-blue-50', textCol: 'text-blue-600' };
      case 'girls':
        return { text: 'Girls Only', bg: 'bg-pink-50', textCol: 'text-pink-600' };
      case 'unisex':
        return { text: 'Co-Ed', bg: 'bg-purple-50', textCol: 'text-purple-600' };
      default:
        return { text: 'Any Gender', bg: 'bg-slate-50', textCol: 'text-slate-600' };
    }
  };

  const getTrustBand = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 50) return { label: 'Average', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const genderInfo = getGenderLabel();
  const trustBand = getTrustBand(item.trustScore);

  return (
    <Pressable
      className="bg-white rounded-3xl mb-4 overflow-hidden border border-slate-100 shadow-sm active:opacity-95"
      onPress={() => navigation.navigate('PGDetails', { pgId: item.id } as any)}
    >
      <View className="relative h-44 w-full bg-slate-100">
        <Image
          source={{ uri: item.images[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80' }}
          className="h-full w-full"
          resizeMode="cover"
        />
        
        {/* Floating Gender Badge */}
        <View className={`absolute top-3 left-3 px-2.5 py-1 rounded-full ${genderInfo.bg}`}>
          <Text className={`text-[10px] font-black uppercase tracking-wider ${genderInfo.textCol}`}>
            {genderInfo.text}
          </Text>
        </View>

        {/* Verified Owner / Property Badge */}
        {(item.claimedBy !== null || item.trustScore >= 80) && (
          <View className="absolute top-3 left-28 bg-green-500 rounded-full px-2 py-0.5 flex-row items-center">
            <Ionicons name="checkmark-circle" size={10} color="#ffffff" />
            <Text className="text-white text-[9px] font-black ml-1 uppercase">Verified Property</Text>
          </View>
        )}

        {/* Favorite Heart Button */}
        <TouchableOpacity
          className="absolute top-3 right-3 h-8 w-8 bg-white/90 rounded-full justify-center items-center shadow-sm active:scale-95"
          onPress={toggleFavorite}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorited ? '#ec4899' : '#475569'}
          />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        {/* Property Type + Trust Score Row */}
        <View className="flex-row justify-between items-center mb-1.5">
          <Text className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{item.type}</Text>
          
          <View className={`px-2.5 py-0.5 rounded-lg flex-row items-center ${trustBand.bg}`}>
            <Text className={`text-[9px] font-black uppercase tracking-wider ${trustBand.color}`}>
              Trust: {item.trustScore} ({trustBand.label})
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-start">
          <Text className="text-sm font-extrabold text-slate-800 flex-1 mr-2" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={11} color="#64748b" />
            <Text className="text-slate-400 text-[10px] font-semibold ml-1">
              {item.reviewsCount} {item.reviewsCount === 1 ? 'review' : 'reviews'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={12} color="#64748b" />
          <Text className="text-slate-500 text-xs font-semibold ml-1 flex-1" numberOfLines={1}>
            {item.address || item.location}
          </Text>
        </View>

        {/* Price Tag & CTA */}
        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-slate-50">
          <View className="flex-row items-baseline">
            <Text className="text-primary-600 text-base font-black">₹{item.price.toLocaleString('en-IN')}</Text>
            <Text className="text-slate-400 text-[10px] font-bold ml-1">/ month</Text>
          </View>
          
          <View className="bg-primary-50 px-3 py-1.5 rounded-lg">
            <Text className="text-primary-600 text-[10px] font-extrabold uppercase">Read Reviews</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
