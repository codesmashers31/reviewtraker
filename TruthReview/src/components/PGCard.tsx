import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PGItem } from '../utils/mockData';
import { RootState } from '../store';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { HomeStackParamList } from '../navigation/types';

interface PGCardProps {
  item: PGItem;
}

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export default function PGCard({ item }: PGCardProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isFavorited = wishlistItems.includes(item.id);

  const toggleFavorite = (e: any) => {
    e.stopPropagation(); // Stop click propagating to navigation
    if (isFavorited) {
      dispatch(removeFromWishlist(item.id));
    } else {
      dispatch(addToWishlist(item.id));
    }
  };

  const getGenderLabel = () => {
    switch (item.type) {
      case 'boys':
        return { text: 'Boys Only', bg: 'bg-blue-50', textCol: 'text-blue-600' };
      case 'girls':
        return { text: 'Girls Only', bg: 'bg-pink-50', textCol: 'text-pink-600' };
      case 'unisex':
        return { text: 'Co-Ed', bg: 'bg-purple-50', textCol: 'text-purple-600' };
    }
  };

  const genderInfo = getGenderLabel();

  return (
    <Pressable
      className="bg-white rounded-2xl mb-4 overflow-hidden border border-slate-100 shadow-sm active:opacity-95"
      onPress={() => navigation.navigate('PGDetails', { pgId: item.id })}
    >
      <View className="relative h-48 w-full bg-slate-100">
        <Image
          source={{ uri: item.images[0] }}
          className="h-full w-full"
          resizeMode="cover"
        />
        
        {/* Floating Gender Badge */}
        <View className={`absolute top-3 left-3 px-3 py-1 rounded-full ${genderInfo.bg}`}>
          <Text className={`text-xs font-bold uppercase tracking-wider ${genderInfo.textCol}`}>
            {genderInfo.text}
          </Text>
        </View>

        {/* Favorite Heart Button */}
        <TouchableOpacity
          className="absolute top-3 right-3 h-9 w-9 bg-white/90 rounded-full justify-center items-center shadow-sm active:scale-95"
          onPress={toggleFavorite}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorited ? '#ec4899' : '#475569'}
          />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <Text className="text-base font-extrabold text-slate-800 flex-1 mr-2" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text className="text-slate-800 text-sm font-bold ml-1">
              {item.rating.toFixed(1)}
            </Text>
            <Text className="text-slate-400 text-xs font-semibold ml-0.5">
              ({item.reviewsCount})
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={13} color="#64748b" />
          <Text className="text-slate-500 text-xs font-semibold ml-1 flex-1" numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        {/* Price Tag & CTA */}
        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-slate-50">
          <View className="flex-row items-baseline">
            <Text className="text-primary-600 text-lg font-extrabold">₹{item.price.toLocaleString('en-IN')}</Text>
            <Text className="text-slate-400 text-xs font-medium ml-1">/ month</Text>
          </View>
          
          <View className="bg-primary-50 px-3 py-1.5 rounded-lg">
            <Text className="text-primary-600 text-xs font-bold">Details</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
