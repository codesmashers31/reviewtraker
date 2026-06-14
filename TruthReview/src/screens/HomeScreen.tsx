import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';

import { MockDb, Property, Review } from '../services/mockDb';
import { HomeStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

// Slides for Banner Carousel
const TRENDING_SLIDES = [
  {
    id: 'slide_1',
    title: 'Verified PG Stays',
    subtitle: 'Cozy student and professional co-living rooms with high trust scores',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    tag: 'POPULAR PGs'
  },
  {
    id: 'slide_2',
    title: 'Premium Hotels & Suites',
    subtitle: 'Comfortable hotel rooms, luxury amenities & central locations',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    tag: 'TOP HOTELS'
  },
  {
    id: 'slide_3',
    title: 'Hostels & Shared Spaces',
    subtitle: 'Secure budget stays with verified check-ins and reviews',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
    tag: 'RECOMMENDED'
  }
];

// Categories data
const CATEGORIES = [
  { id: 'PG', name: 'PG', icon: 'business-outline', gradient: ['#3b82f6', '#1d4ed8'] },
  { id: 'Hostel', name: 'Hostel', icon: 'home-outline', gradient: ['#14b8a6', '#0f766e'] },
  { id: 'Hotel', name: 'Hotel', icon: 'bed-outline', gradient: ['#ec4899', '#be185d'] },
  { id: 'Co-Living Property', name: 'Co-Living', icon: 'people-outline', gradient: ['#8b5cf6', '#6d28d9'] },
  { id: 'Rental Room', name: 'Rental Room', icon: 'key-outline', gradient: ['#06b6d4', '#0891b2'] },
  { id: 'Service Apartment', name: 'Service Apt', icon: 'copy-outline', gradient: ['#f43f5e', '#e11d48'] },
  { id: 'Office', name: 'Workspace', icon: 'briefcase-outline', gradient: ['#64748b', '#475569'] }
];

export default function HomeScreen({ navigation }: { navigation: any }) {
  
  // Data State
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Location Fetching State
  const [locationName, setLocationName] = useState('Adyar, Chennai');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Banner Carousel auto-scroll index state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselScrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef<FlatList>(null);

  // Load database entities
  useEffect(() => {
    const loadData = async () => {
      const allProps = await MockDb.getProperties();
      const allRevs = await MockDb.getReviews();
      setProperties(allProps);
      setReviews(allRevs);
    };
    loadData();
    fetchLocation(true); // Auto fetch location on mount silently
  }, []);

  // Location Fetching Function
  const fetchLocation = async (isInitial = false) => {
    setLoadingLocation(true);
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setLocationName('Adyar, Chennai');
        if (!isInitial) {
          Toast.show({
            type: 'info',
            text1: 'Location Services Disabled',
            text2: 'Using default location (Adyar, Chennai).',
            position: 'top',
          });
        }
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!isInitial) {
          Toast.show({
            type: 'error',
            text1: 'Location Permission Denied',
            text2: 'Using default location (Adyar, Chennai).',
            position: 'top',
          });
        }
        setLocationName('Adyar, Chennai');
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
        const city = address.city || address.subregion || 'Chennai';
        const neighborhood = address.district || address.name || 'Nearby';
        setLocationName(`${neighborhood}, ${city}`);
        
        if (!isInitial) {
          Toast.show({
            type: 'success',
            text1: 'Location Updated',
            text2: `Set to ${neighborhood}, ${city}`,
            position: 'top',
          });
        }
      } else {
        setLocationName('Chennai, TN');
      }
    } catch (error) {
      setLocationName('Adyar, Chennai');
      if (!isInitial) {
        Toast.show({
          type: 'info',
          text1: 'Location Unavailable',
          text2: 'Using default location (Adyar, Chennai).',
          position: 'top',
        });
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  // Banner Auto-scrolling Effect
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = carouselIndex + 1;
      if (nextIndex >= TRENDING_SLIDES.length) {
        nextIndex = 0;
      }
      setCarouselIndex(nextIndex);
      carouselRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [carouselIndex]);

  // Find corresponding reviews for a property
  const getPropertyReviews = (propertyId: string) => {
    return reviews.filter(r => r.propertyId === propertyId);
  };

  // Get filtered property listing
  const getFilteredProperties = () => {
    let list = [...properties];

    // Search query matches property name, location, or description
    if (searchQuery.trim().length > 0) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected City/Area from the header circular list
    if (selectedCity) {
      list = list.filter(p => 
        p.area.toLowerCase() === selectedCity.toLowerCase() ||
        p.city.toLowerCase() === selectedCity.toLowerCase() ||
        p.location.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Filter Chips
    if (activeFilter === 'Hotels Only') {
      list = list.filter(p => p.type === 'Hotel' || p.type === 'Service Apartment');
    } else if (activeFilter === 'PGs & Hostels') {
      list = list.filter(p => p.type === 'PG' || p.type === 'Hostel');
    } else if (activeFilter === 'Co-Living Hubs') {
      list = list.filter(p => p.type === 'Co-Living Property');
    } else if (activeFilter === 'Highly Rated') {
      list = list.filter(p => p.trustScore >= 80);
    } else if (activeFilter === 'Work-Friendly') {
      list = list.filter(p => p.facilities.some(f => f.toLowerCase().includes('wifi') || f.toLowerCase().includes('workstation') || f.toLowerCase().includes('internet')));
    } else if (activeFilter === 'Highest Trust') {
      list = list.sort((a, b) => b.trustScore - a.trustScore);
    }

    return list;
  };

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('SearchStack', {
      screen: 'Search',
      params: { query: categoryId }
    } as any);
  };

  const handleSearchNavigation = () => {
    navigation.navigate('SearchStack', { screen: 'Search' });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50/50" edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Decorative Blur Gradients */}
      <View className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-100/30 via-indigo-50/15 to-transparent" style={{ pointerEvents: 'none' }} />

      {/* Main Scroll Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* OYO-STYLE VIBRANT ROSE HEADER BLOCK (SOLID ROSE FOR SEARCH BLOCK ONLY) */}
        <View className="bg-primary-600 px-5 pt-12 pb-7 rounded-b-[32px] shadow-md shadow-primary-600/10">
          {/* Top Row: Menu, Brand, Profile */}
          <View className="flex-row justify-between items-center mb-5">
            <TouchableOpacity 
              onPress={() => Toast.show({ type: 'info', text1: 'Menu opened' })}
              className="p-1"
            >
              <Ionicons name="menu-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
              <Text className="text-lg font-black text-white ml-1.5 uppercase tracking-wider">Truth Review</Text>
            </View>
            
            <View className="flex-row items-center space-x-2.5">
              <TouchableOpacity 
                onPress={() => Toast.show({ type: 'info', text1: 'Notifications dashboard mock.' })}
                className="p-2 bg-white/10 rounded-full"
              >
                <Ionicons name="notifications-outline" size={16} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}
                className="p-2 bg-white/10 rounded-full"
              >
                <Ionicons name="person-outline" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Rounded Search Pill */}
          <TouchableOpacity 
            onPress={handleSearchNavigation}
            activeOpacity={0.95}
            className="flex-row items-center bg-white px-5 py-3.5 rounded-2xl shadow-md"
          >
            <Ionicons name="search" size={18} color="#475569" />
            <View className="ml-3 flex-1">
              <Text className="text-xs font-black text-slate-800">
                {selectedCity ? selectedCity : locationName}
              </Text>
              <Text className="text-[10px] text-slate-400 font-bold mt-0.5">
                Stays, Hostels, Workspaces
              </Text>
            </View>
            {loadingLocation && (
              <ActivityIndicator size="small" color="#8c1c13" />
            )}
          </TouchableOpacity>
        </View>

        {/* Scrollable Cities & Features (Outside/Below the Gradient Header) */}
        <View className="px-5 pt-5 pb-2">
          {/* Scrollable Chennai Localities (locations) */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            className="mb-5"
          >
            {/* Nearby GPS Locator */}
            <TouchableOpacity 
              onPress={() => {
                setSelectedCity(null);
                fetchLocation(false);
              }}
              className="items-center"
            >
              <View className="w-14 h-14 rounded-full bg-white justify-center items-center shadow-sm border border-slate-200">
                <Ionicons name="compass-outline" size={24} color="#8c1c13" />
              </View>
              <Text className="text-[10px] text-slate-700 font-black mt-1.5">Nearby</Text>
            </TouchableOpacity>

            {/* Adyar */}
            <TouchableOpacity 
              onPress={() => setSelectedCity('Adyar')}
              className="items-center"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=150&q=80' }} 
                className={`w-14 h-14 rounded-full border-2 ${selectedCity === 'Adyar' ? 'border-primary-600' : 'border-white shadow-sm'}`}
              />
              <Text className="text-[10px] text-slate-700 font-black mt-1.5">Adyar</Text>
            </TouchableOpacity>

            {/* Velachery */}
            <TouchableOpacity 
              onPress={() => setSelectedCity('Velachery')}
              className="items-center"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=150&q=80' }} 
                className={`w-14 h-14 rounded-full border-2 ${selectedCity === 'Velachery' ? 'border-primary-600' : 'border-white shadow-sm'}`}
              />
              <Text className="text-[10px] text-slate-700 font-black mt-1.5">Velachery</Text>
            </TouchableOpacity>

            {/* T. Nagar */}
            <TouchableOpacity 
              onPress={() => setSelectedCity('T. Nagar')}
              className="items-center"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=150&q=80' }} 
                className={`w-14 h-14 rounded-full border-2 ${selectedCity === 'T. Nagar' ? 'border-primary-600' : 'border-white shadow-sm'}`}
              />
              <Text className="text-[10px] text-slate-700 font-black mt-1.5">T. Nagar</Text>
            </TouchableOpacity>

            {/* OMR */}
            <TouchableOpacity 
              onPress={() => setSelectedCity('Perungudi')}
              className="items-center"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80' }} 
                className={`w-14 h-14 rounded-full border-2 ${selectedCity === 'Perungudi' ? 'border-primary-600' : 'border-white shadow-sm'}`}
              />
              <Text className="text-[10px] text-slate-700 font-black mt-1.5">OMR</Text>
            </TouchableOpacity>

            {/* Tambaram */}
            <TouchableOpacity 
              onPress={() => setSelectedCity('Tambaram')}
              className="items-center"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80' }} 
                className={`w-14 h-14 rounded-full border-2 ${selectedCity === 'Tambaram' ? 'border-primary-600' : 'border-white shadow-sm'}`}
              />
              <Text className="text-[10px] text-slate-700 font-black mt-1.5">Tambaram</Text>
            </TouchableOpacity>

            {/* Anna Nagar */}
            <TouchableOpacity 
              onPress={() => setSelectedCity('Anna Nagar')}
              className="items-center"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=150&q=80' }} 
                className={`w-14 h-14 rounded-full border-2 ${selectedCity === 'Anna Nagar' ? 'border-primary-600' : 'border-white shadow-sm'}`}
              />
              <Text className="text-[10px] text-slate-700 font-black mt-1.5">Anna Nagar</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Stays Features Row */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            className="border-t border-slate-100 pt-4"
          >
            {[
              { label: 'Clean Rooms', icon: 'sparkles-outline' },
              { label: 'Helpful Staff', icon: 'heart-outline' },
              { label: 'AC Rooms', icon: 'snow-outline' },
              { label: 'Free Wi-Fi', icon: 'wifi-outline' },
              { label: 'Toiletries', icon: 'leaf-outline' }
            ].map((feat, idx) => (
              <View key={idx} className="flex-row items-center bg-primary-50/60 border border-primary-100 px-3.5 py-1.5 rounded-full">
                <Ionicons name={feat.icon as any} size={11} color="#8c1c13" />
                <Text className="text-[9px] text-primary-700 font-extrabold uppercase ml-1.5 tracking-wider">{feat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* TRENDING BANNER CAROUSEL */}
        <View className="mt-5">
          <FlatList
            ref={carouselRef}
            data={TRENDING_SLIDES}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => (
              { length: width, offset: width * index, index }
            )}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: carouselScrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setCarouselIndex(idx);
            }}
            renderItem={({ item }) => (
              <View style={{ width: width, paddingHorizontal: 20 }}>
                <TouchableOpacity 
                  activeOpacity={0.95}
                  onPress={handleSearchNavigation}
                  className="w-full h-48 rounded-3xl overflow-hidden relative shadow-md shadow-slate-200/5"
                >
                  <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
                  <View className="absolute inset-0 bg-black/40" />

                  <View className="absolute top-4 left-4 bg-primary-600 px-2.5 py-0.5 rounded-md">
                    <Text className="text-[9px] font-black text-white tracking-widest">{item.tag}</Text>
                  </View>

                  <View className="absolute bottom-4 left-4 right-4 bg-white/10 border border-white/20 p-3 rounded-2xl">
                    <Text className="text-white text-xs font-black">{item.title}</Text>
                    <Text className="text-white/80 text-[10px] font-bold mt-0.5" numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Dots Indicator */}
          <View className="flex-row justify-center items-center mt-3 space-x-1.5">
            {TRENDING_SLIDES.map((_, idx) => {
              const isActive = carouselIndex === idx;
              return (
                <View
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'w-4 bg-primary-600' : 'w-1.5 bg-slate-300'
                  }`}
                />
              );
            })}
          </View>
        </View>

        {/* CATEGORIES SECTION */}
        <View className="mt-6">
          <View className="px-5 mb-3">
            <Text className="text-xs font-black uppercase tracking-wider text-slate-400">Discover Stays & Workspaces</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryPress(cat.id)}
                activeOpacity={0.9}
                style={{
                  backgroundColor: `${cat.gradient[0]}0a`,
                  borderColor: `${cat.gradient[0]}22`,
                }}
                className="mr-3 flex-row items-center px-4 py-2 border rounded-full shadow-sm shadow-slate-100/30"
              >
                <View 
                  className="p-1.5 rounded-full" 
                  style={{ backgroundColor: `${cat.gradient[0]}15` }}
                >
                  <Ionicons name={cat.icon as any} size={13} color={cat.gradient[0]} />
                </View>
                <Text className="text-[11px] font-black text-slate-800 ml-2.5">
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FILTER CHIPS */}
        <View className="mt-7">
          <View className="px-5 mb-3 flex-row justify-between items-center">
            <Text className="text-xs font-black uppercase tracking-wider text-slate-400">Browse Verified Stays</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="mb-4"
          >
            {['All', 'PGs & Hostels', 'Hotels Only', 'Co-Living Hubs', 'Highly Rated', 'Work-Friendly', 'Highest Trust'].map((chip) => {
              const isActive = activeFilter === chip;
              return (
                <TouchableOpacity
                  key={chip}
                  onPress={() => setActiveFilter(chip)}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    isActive 
                      ? 'bg-primary-600 border-primary-600' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}>
                    {chip}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ONE-BY-ONE PROPERTY LIST WITH IMAGES */}
        <View className="px-5 space-y-5">
          {getFilteredProperties().map((prop) => {
            const propReviews = getPropertyReviews(prop.id);
            const latestReview = propReviews.length > 0 ? propReviews[0] : null;
            
            return (
              <TouchableOpacity
                key={prop.id}
                activeOpacity={0.95}
                onPress={() => navigation.navigate('PGDetails', { pgId: prop.id })}
                className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm shadow-slate-100/50 mb-4"
              >
                {/* Large Property Image */}
                <View className="h-48 w-full relative">
                  <Image 
                    source={{ uri: prop.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80' }} 
                    className="w-full h-full object-cover"
                  />
                  <View className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Category Pill Tag */}
                  <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons 
                      name={prop.type === 'Hotel' || prop.type === 'Service Apartment' ? 'bed-outline' : 'business-outline'} 
                      size={10} 
                      color="#ffffff" 
                    />
                    <Text className="text-white text-[8px] font-black uppercase ml-1 tracking-wider">{prop.type}</Text>
                  </View>

                  {/* Gender Restriction Badge */}
                  {prop.genderType !== 'none' && (
                    <View className="absolute top-4 right-4 bg-primary-600 px-3 py-1 rounded-full">
                      <Text className="text-white text-[8px] font-black uppercase tracking-wider">
                        {prop.genderType}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Property Detail Content */}
                <View className="p-5">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-md font-black text-slate-800 leading-5" numberOfLines={1}>
                        {prop.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={11} color="#64748b" />
                        <Text className="text-[10px] text-slate-500 ml-0.5 truncate">{prop.location}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Trust Score & Ratings summary */}
                  <View className="flex-row justify-between items-center mt-4 bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
                    <View className="flex-row items-center flex-1">
                      <Ionicons name="ribbon-outline" size={16} color="#10B981" />
                      <View className="ml-2 flex-1 pr-3">
                        <View className="flex-row justify-between items-center mb-0.5">
                          <Text className="text-[9px] font-bold text-slate-500 uppercase">Trust Score</Text>
                          <Text className="text-[10px] font-black text-emerald-600">{prop.trustScore}%</Text>
                        </View>
                        <View className="h-1 bg-slate-200 rounded-full w-full">
                          <View 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${prop.trustScore}%` }} 
                          />
                        </View>
                      </View>
                    </View>

                    <View className="h-6 w-[1px] bg-slate-200/80 mx-1" />

                    <View className="flex-row items-center pl-3">
                      <Ionicons name="star" size={12} color="#f59e0b" />
                      <Text className="text-xs font-black text-slate-800 ml-1">
                        {propReviews.length > 0 
                          ? (propReviews.reduce((acc, r) => acc + r.ratings.overall, 0) / propReviews.length).toFixed(1)
                          : 'N/A'
                        }
                      </Text>
                      <Text className="text-[9px] text-slate-400 font-medium ml-1">({propReviews.length})</Text>
                    </View>
                  </View>

                  {/* Quote Section showing Latest Review Snippet */}
                  {latestReview ? (
                    <View className="mt-4 bg-slate-50/40 border-l-2 border-slate-300 p-3 rounded-r-xl">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-[9px] font-black text-slate-400 uppercase">
                          Latest Resident Review
                        </Text>
                        {latestReview.verified && (
                          <View className="bg-emerald-50 px-1.5 py-0.5 rounded-md flex-row items-center">
                            <Ionicons name="shield-checkmark" size={8} color="#10B981" />
                            <Text className="text-emerald-600 text-[7px] font-extrabold uppercase ml-0.5">Verified</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-slate-600 italic mt-1.5 leading-4" numberOfLines={2}>
                        "{latestReview.comment}"
                      </Text>
                    </View>
                  ) : (
                    <View className="mt-4 bg-slate-50/40 border-l-2 border-slate-200 p-3 rounded-r-xl">
                      <Text className="text-xs text-slate-400 italic">No reviews posted yet. Be the first to share your experience!</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2
  }
});
