import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { HomeStackParamList } from '../../../navigation/types';
import { mockPGs } from '../../../utils/mockData';
import { RootState } from '../../../store';
import { addToWishlist, removeFromWishlist } from '../../wishlist/wishlistSlice';

type Props = NativeStackScreenProps<HomeStackParamList, 'PGDetails'>;
const { width } = Dimensions.get('window');

export default function PGDetailsScreen({ route, navigation }: Props) {
  const { pgId } = route.params;
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const pg = mockPGs.find((p) => p.id === pgId);
  const isFavorited = wishlistItems.includes(pgId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!pg) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-slate-500 font-bold">PG Listing Not Found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 bg-primary-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleFavorite = () => {
    if (isFavorited) {
      dispatch(removeFromWishlist(pgId));
      Toast.show({
        type: 'success',
        text1: 'Removed from Favorites',
        position: 'bottom',
      });
    } else {
      dispatch(addToWishlist(pgId));
      Toast.show({
        type: 'success',
        text1: 'Added to Favorites',
        position: 'bottom',
      });
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${pg.contactNumber.replace(/\s+/g, '')}`);
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(`${pg.name}, ${pg.location}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  const getGenderStyle = () => {
    switch (pg.type) {
      case 'boys':
        return { text: 'Boys Only Hostel', textCol: 'text-blue-600', bg: 'bg-blue-50' };
      case 'girls':
        return { text: 'Girls Only Hostel', textCol: 'text-pink-600', bg: 'bg-pink-50' };
      case 'unisex':
        return { text: 'Co-Ed Living Space', textCol: 'text-purple-600', bg: 'bg-purple-50' };
    }
  };

  const getFacilityIcon = (facility: string): keyof typeof Ionicons.glyphMap => {
    const f = facility.toLowerCase();
    if (f.includes('wifi') || f.includes('internet')) return 'wifi';
    if (f.includes('ac') || f.includes('condition')) return 'snow';
    if (f.includes('cleaning') || f.includes('housekeeping')) return 'brush-outline';
    if (f.includes('meal') || f.includes('food')) return 'fast-food';
    if (f.includes('cctv') || f.includes('security')) return 'shield-checkmark';
    if (f.includes('laundry') || f.includes('washing')) return 'shirt-outline';
    if (f.includes('gym')) return 'barbell';
    if (f.includes('power') || f.includes('backup')) return 'flash';
    return 'checkmark-circle-outline';
  };

  const gender = getGenderStyle();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Absolute Header Overlay */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between px-5 items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-black/45 rounded-full justify-center items-center active:scale-95"
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleFavorite}
          className="h-10 w-10 bg-black/45 rounded-full justify-center items-center active:scale-95"
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorited ? '#ec4899' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Horizontal Image Carousel */}
        <View className="relative h-72 bg-slate-100">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slide !== activeImageIndex) {
                setActiveImageIndex(slide);
              }
            }}
            scrollEventThrottle={16}
          >
            {pg.images.map((image, idx) => (
              <Image
                key={idx}
                source={{ uri: image }}
                style={{ width, height: 288 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          {pg.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2 gap-1.5">
              {pg.images.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content Details */}
        <View className="p-5">
          {/* Tag + Title */}
          <View className="flex-row items-center mb-2">
            <View className={`px-3 py-1 rounded-full ${gender.bg}`}>
              <Text className={`text-xs font-extrabold uppercase tracking-wide ${gender.textCol}`}>
                {gender.text}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-extrabold text-slate-800 leading-8">
            {pg.name}
          </Text>

          {/* Rating & Reviews Section */}
          <TouchableOpacity
            className="flex-row items-center mt-3 bg-slate-50 self-start px-3 py-1.5 rounded-lg"
            onPress={() => navigation.navigate('PGReviews', { pgId })}
          >
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text className="text-slate-800 font-extrabold ml-1.5">
              {pg.rating.toFixed(1)}
            </Text>
            <Text className="text-slate-400 font-semibold text-xs ml-1">
              • {pg.reviewsCount} genuine reviews
            </Text>
            <Ionicons name="chevron-forward" size={12} color="#94a3b8" className="ml-2" />
          </TouchableOpacity>

          {/* Location details */}
          <View className="flex-row items-center mt-4 border-t border-slate-50 pt-4">
            <Ionicons name="location-outline" size={20} color="#64748b" />
            <Text className="text-slate-600 font-medium text-sm ml-2 flex-1">
              {pg.location}
            </Text>
            <TouchableOpacity onPress={handleOpenMap} className="ml-2">
              <Text className="text-primary-500 font-bold text-sm">View Map</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mt-6">
            <Text className="text-lg font-extrabold text-slate-800 mb-2">About this PG</Text>
            <Text className="text-slate-500 text-sm font-medium leading-6">
              {pg.description}
            </Text>
          </View>

          {/* Facilities Grid */}
          <View className="mt-6">
            <Text className="text-lg font-extrabold text-slate-800 mb-3">Amenities</Text>
            <View className="flex-row flex-wrap gap-2.5">
              {pg.facilities.map((fac, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl min-w-[46%] m-0.5"
                >
                  <Ionicons name={getFacilityIcon(fac)} size={16} color="#0ea5e9" />
                  <Text className="text-slate-700 text-xs font-bold ml-2">{fac}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Bar for Booking / Contacting */}
      <View className="border-t border-slate-100 bg-white px-5 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">Starts From</Text>
          <View className="flex-row items-baseline mt-0.5">
            <Text className="text-slate-800 text-xl font-black">₹{pg.price.toLocaleString('en-IN')}</Text>
            <Text className="text-slate-400 text-xs font-medium ml-1">/ month</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary-500 px-8 py-3.5 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary-500/20 active:opacity-90"
          onPress={handleCall}
        >
          <Ionicons name="call" size={16} color="#ffffff" />
          <Text className="text-white text-base font-bold ml-2">Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
