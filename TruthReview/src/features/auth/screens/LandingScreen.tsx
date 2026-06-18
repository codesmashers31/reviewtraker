import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
import { LinearGradient } from 'expo-linear-gradient';
=======
import { useTheme } from '../../theme/ThemeContext';
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf

type Props = NativeStackScreenProps<AuthStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');

<<<<<<< HEAD
// Banners for different categories (Top of landing screen)
const HERO_BANNERS = [
  {
    id: 'b1',
    title: 'Rental & Stay Verification',
    subtitle: 'Hostels, PGs, Hotels & Service Apartments',
    desc: 'Unbiased reviews on utilities, food, and safety standards.',
    gradientColors: ['#0A4D8C', '#2563EB'],
    icon: 'home'
  },
  {
    id: 'b2',
    title: 'Dining & Café Truths',
    subtitle: 'Restaurants, Cafes, Lounges & Bakeries',
    desc: 'Genuine community ratings on taste, hygiene, and pricing.',
    gradientColors: ['#23283B', '#2D3654'],
    icon: 'cafe'
  },
  {
    id: 'b3',
    title: 'Work & Workspace Ratings',
    subtitle: 'Coworking Spaces, Offices & Study Halls',
    desc: 'Honest reviews on internet speeds, comfort, and environment.',
    gradientColors: ['#2D3654', '#0A4D8C'],
    icon: 'briefcase'
  }
=======
const LANDING_CATEGORIES = [
  { id: 'PG', name: 'PG', icon: 'home-outline' as const, color: '#3b82f6', bg: '#eff6ff', bgDark: '#1e293b' },
  { id: 'Hostel', name: 'Hostel', icon: 'business-outline' as const, color: '#10b981', bg: '#ecfdf5', bgDark: '#1e293b' },
  { id: 'Hotel', name: 'Hotel', icon: 'bed-outline' as const, color: '#8b5cf6', bg: '#f5f3ff', bgDark: '#1e293b' },
  { id: 'Rental', name: 'Rental', icon: 'home-outline' as const, color: '#f97316', bg: '#fff7ed', bgDark: '#1e293b' },
  { id: 'Co-living', name: 'Co-living', icon: 'people-outline' as const, color: '#eab308', bg: '#fef9c3', bgDark: '#1e293b' },
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
];

const RECENT_REVIEWS = [
  {
    id: '1',
    name: 'Stanza Living Amrit',
    location: 'Koramangala, Bangalore',
    rating: '4.4',
    comment: 'Great stay overall. Food is good, WiFi needs improvement.',
    stayDuration: 'Stayed 6 Months',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80',
    verified: true
  },
  {
    id: '2',
    name: 'Zolo Stay Coliving',
    location: 'HSR Layout, Bangalore',
    rating: '4.2',
    comment: 'Friendly housekeepers and well-maintained rooms. The gym facility is a nice bonus.',
    stayDuration: 'Stayed 1 Year',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80',
    verified: true
  },
  {
    id: '3',
    name: 'Isthara Parks Hostel',
    location: 'Whitefield, Bangalore',
    rating: '4.5',
    comment: 'Very quiet environment, perfect for studying and remote work. Highly recommend the single sharing rooms.',
    stayDuration: 'Stayed 3 Months',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80',
    verified: true
  }
];

export default function LandingScreen({ navigation }: Props) {
<<<<<<< HEAD
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
=======
  const { isDark, toggleTheme } = useTheme();
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

<<<<<<< HEAD
  // Automatic scrolling for Banners
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      let nextIndex = activeBannerIndex + 1;
      if (nextIndex >= HERO_BANNERS.length) {
        nextIndex = 0;
      }
      setActiveBannerIndex(nextIndex);
      bannerListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4500);

    return () => clearInterval(bannerInterval);
  }, [activeBannerIndex]);

  // Automatic scrolling for Reviews
  useEffect(() => {
    const reviewInterval = setInterval(() => {
=======
  useEffect(() => {
    const timer = setInterval(() => {
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
      let nextIndex = activeReviewIndex + 1;
      if (nextIndex >= RECENT_REVIEWS.length) {
        nextIndex = 0;
      }
      setActiveReviewIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [activeReviewIndex]);

  const handleAuthRedirect = () => {
    navigation.navigate('Login');
  };

<<<<<<< HEAD
  const getIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pg': return '#2563eb';
      case 'hotel': return '#D4A5A5';
      case 'cafe': return '#22c55e';
      case 'office': return '#ea580c';
      default: return '#94a3b8';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <View className="flex-row items-center space-x-2">
          <View className="bg-card p-2 rounded-xl flex-row items-center justify-center border border-borderSubtle">
            <Ionicons name="shield-checkmark" size={18} color="#D4A5A5" />
          </View>
          <Text className="text-lg font-black tracking-tight ml-2 text-text">
            Truth Review
          </Text>
        </View>
=======
  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50/30'}`}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Section */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <View className="flex-row items-center">
          <Ionicons
            name="shield-checkmark"
            size={28}
            color={isDark ? '#3b82f6' : '#0b1a30'}
          />
          <View className="ml-2">
            <View className="flex-row items-center">
              <Text className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Truth
              </Text>
              <Text className="text-blue-600 text-lg font-black tracking-tight ml-1">
                Review
              </Text>
            </View>
            <Text className="text-[8px] text-slate-400 font-semibold tracking-tighter mt-0.5">
              India's Verified Accommodation Reality Platform
            </Text>
          </View>
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity
          className={`p-2 rounded-full border ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-100 shadow-sm shadow-slate-200'
          }`}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={18}
            color={isDark ? '#ffffff' : '#0f172a'}
          />
        </TouchableOpacity>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
<<<<<<< HEAD
        renderItem={() => (
          <View>
            
            {/* 1. Category / Feature Gilded Banners */}
            <View className="mt-4">
              <FlatList
                ref={bannerListRef}
                data={HERO_BANNERS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                  const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                  if (newIndex !== activeBannerIndex) {
                    setActiveBannerIndex(newIndex);
                  }
                }}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                renderItem={({ item }) => (
                  <View 
                    style={{ width: CARD_WIDTH, backgroundColor: item.gradientColors[0] }}
                    className="p-6 mr-6 rounded-3xl justify-between h-[155px] relative overflow-hidden shadow-premium border border-borderSubtle"
                  >
                    {/* Background Decorative Icon */}
                    <View className="absolute right-[-20] bottom-[-20] opacity-15">
                      <Ionicons name={item.icon as any} size={150} color="#ffffff" />
                    </View>
=======
      >
        {/* Hero Section */}
        <View className="flex-row justify-between items-start mt-6 px-6 relative">
          <View className="flex-1 pr-4">
            {/* Verified Badge */}
            <View
              className={`border rounded-full px-2.5 py-1 flex-row items-center self-start mb-3 ${
                isDark ? 'bg-blue-950/20 border-blue-900/30' : 'bg-blue-50/70 border-blue-100/50'
              }`}
            >
              <Ionicons name="shield-checkmark" size={11} color="#3b82f6" />
              <Text className="text-blue-600 font-black text-[9px] ml-1.5 uppercase tracking-wider">
                Verified by Real Residents
              </Text>
            </View>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf

            <Text
              className={`font-black text-3xl leading-tight tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Find the Truth Before You <Text className="text-blue-600">Stay</Text>
            </Text>

            <Text className="text-slate-400 font-semibold text-xs mt-3 leading-relaxed">
              Real reviews. Real experiences.{'\n'}Better choices.
            </Text>
          </View>

          {/* Building Illustration Asset */}
          <View className="w-28 h-36 justify-center items-center">
            <Image
              source={require('../../../../assets/buildings.png')}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Search Pill UI */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleAuthRedirect}
          className={`mx-6 mt-6 border rounded-full py-2 pl-5 pr-2 flex-row justify-between items-center ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-100 shadow-md shadow-slate-100'
          }`}
        >
          <View className="flex-row items-center">
            <Ionicons name="search" size={18} color="#94a3b8" />
            <Text className="text-slate-400 font-semibold text-[12px] ml-3">
              Search PGs, Hostels, Hotels...
            </Text>
          </View>
          <View className="bg-blue-600 w-9 h-9 rounded-full items-center justify-center shadow-sm shadow-blue-500/35">
            <Ionicons name="search" size={15} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Categories Row */}
        <View className="flex-row justify-between px-6 mt-7">
          {LANDING_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={handleAuthRedirect}
              className="items-center"
              activeOpacity={0.8}
            >
              <View
                style={{ backgroundColor: isDark ? cat.bgDark : cat.bg }}
                className="w-12 h-12 rounded-2xl items-center justify-center border border-slate-100/5 dark:border-slate-800"
              >
                <Ionicons name={cat.icon} size={20} color={cat.color} />
              </View>
              <Text
                className={`font-black text-[10px] mt-2 ${
                  isDark ? 'text-slate-350' : 'text-slate-800'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trust Highlights Section */}
        <View
          className={`mx-6 mt-8 border rounded-2xl p-4 flex-row justify-between items-center ${
            isDark
              ? 'bg-slate-900/40 border-slate-900'
              : 'bg-slate-50/50 border-slate-100'
          }`}
        >
          {/* Highlight 1 */}
          <View className="flex-1 flex-row items-center pr-2">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isDark ? 'bg-emerald-950/20' : 'bg-emerald-50'
              }`}
            >
              <Ionicons name="shield-checkmark-outline" size={16} color="#10b981" />
            </View>
            <View className="ml-2 flex-1">
              <Text
                className={`font-extrabold text-[9px] leading-tight ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                Verified Reviews
              </Text>
              <Text className="text-slate-400 font-bold text-[8px] mt-0.5">
                By Real Residents
              </Text>
            </View>
          </View>

          <View className={`h-6 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Highlight 2 */}
          <View className="flex-1 flex-row items-center px-2">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isDark ? 'bg-blue-950/20' : 'bg-blue-50'
              }`}
            >
              <Ionicons name="document-text-outline" size={16} color="#3b82f6" />
            </View>
            <View className="ml-2 flex-1">
              <Text
                className={`font-extrabold text-[9px] leading-tight ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                Trust Score
              </Text>
              <Text className="text-slate-400 font-bold text-[8px] mt-0.5">
                0-100 Rating
              </Text>
            </View>
          </View>

          <View className={`h-6 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Highlight 3 */}
          <View className="flex-1 flex-row items-center pl-2">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isDark ? 'bg-orange-950/20' : 'bg-orange-50'
              }`}
            >
              <Ionicons name="chatbox-ellipses-outline" size={16} color="#f97316" />
            </View>
            <View className="ml-2 flex-1">
              <Text
                className={`font-extrabold text-[9px] leading-tight ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                Complaint Insights
              </Text>
              <Text className="text-slate-400 font-bold text-[8px] mt-0.5">
                See Real Issues
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Reviews Carousel */}
        <View className="mt-6">
          <FlatList
            ref={flatListRef}
            data={RECENT_REVIEWS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              if (newIndex !== activeReviewIndex) {
                setActiveReviewIndex(newIndex);
              }
            }}
            renderItem={({ item }) => (
              <View style={{ width }} className="px-6">
                <View
                  className={`border rounded-3xl p-5 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-white border-slate-100/80 shadow-sm shadow-slate-100'
                  }`}
                >
                  {/* Card Top Pill Details */}
                  <View className="flex-row justify-between items-center mb-3">
                    <View
                      className={`px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-blue-950/40' : 'bg-blue-50'
                      }`}
                    >
                      <Text className="text-blue-600 font-black text-[9px] uppercase tracking-wider">
                        Recent Review
                      </Text>
                    </View>
                    <View className="bg-emerald-500 px-2.5 py-0.5 rounded-full flex-row items-center">
                      <Text className="text-white font-black text-[9px] mr-0.5">{item.rating}</Text>
                      <Ionicons name="star" size={8} color="#ffffff" />
                    </View>
                  </View>

                  {/* Card Main Body */}
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-3">
                      <Text
                        className={`font-black text-sm leading-snug ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {item.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={10} color="#94a3b8" />
                        <Text className="text-slate-400 font-bold text-[9px] ml-0.5">
                          {item.location}
                        </Text>
                      </View>
                      <Text
                        className={`font-bold text-xs italic mt-3 leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        "{item.comment}"
                      </Text>

<<<<<<< HEAD
                    <View className="flex-row justify-between items-center border-t border-white/10 pt-2.5 mt-2">
                      <View className="flex-row items-center bg-white/15 px-2.5 py-0.5 rounded-full">
                        <Ionicons name="ribbon" size={10} color="#ffffff" />
                        <Text className="text-white text-[8px] font-black uppercase tracking-wider ml-1">Verified Platform</Text>
                      </View>
                    </View>
                  </View>
                )}
              />

              {/* Banner Indicators */}
              <View className="flex-row justify-center mt-3 space-x-1.5">
                {HERO_BANNERS.map((_, i) => (
                  <View 
                    key={i} 
                    className={`h-1.5 rounded-full ${
                      activeBannerIndex === i 
                        ? 'w-5 bg-accent-500' 
                        : 'w-1.5 bg-surface'
                    }`} 
                  />
                ))}
              </View>
            </View>

            {/* 2. Reviews Section */}
            <View className="mt-8">
              <View className="px-6 mb-4 flex-row justify-between items-end">
                <View>
                  <Text className="text-md font-black tracking-tight text-text">
                    Recent Community Reviews
                  </Text>
                  <Text className="text-[10px] text-textMuted font-medium mt-0.5">
                    Unbiased, anonymous ratings shared by real residents.
                  </Text>
                </View>
                <View className="bg-accent-500/10 px-2 py-0.5 rounded-md flex-row items-center border border-accent-500/20">
                  <Ionicons name="shield-checkmark" size={10} color="#D4A5A5" />
                  <Text className="text-[#D4A5A5] text-[8px] font-black uppercase ml-1">Live Feed</Text>
                </View>
              </View>

              <FlatList
                ref={reviewListRef}
                data={REVIEWS_DATA}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                  const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                  if (newIndex !== activeReviewIndex) {
                    setActiveReviewIndex(newIndex);
                  }
                }}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                renderItem={({ item }) => (
                  <View 
                    style={{ width: CARD_WIDTH }}
                    className="p-5 mr-6 rounded-2xl border justify-between min-h-[175px] bg-card border-borderSubtle shadow-premium"
                  >
                    <View>
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <View 
                              style={{ backgroundColor: `${getIconColor(item.type)}15` }}
                              className="px-2 py-0.5 rounded-md border border-borderSubtle"
                            >
                              <Text 
                                style={{ color: getIconColor(item.type) }}
                                className="text-[9px] font-black uppercase"
                              >
                                {item.type}
                              </Text>
                            </View>
                            <Text className="text-[10px] text-textMuted ml-2">{item.location}</Text>
                          </View>
                          
                          <Text className="text-sm font-black mt-1.5 text-text">
                            {item.name}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center bg-surface border border-borderSubtle px-2 py-0.5 rounded-md">
                          <Text className="text-[10px] font-black text-accent-500 mr-1">{item.rating}</Text>
                          <Ionicons name="star" size={10} color="#D4A5A5" />
                        </View>
                      </View>

                      <Text className="text-xs mt-3.5 leading-5 italic text-textBody">
                        "{item.review}"
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center border-t border-borderSubtle pt-3 mt-4">
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={14} color="#D4A5A5" />
                        <Text className="text-[9px] font-bold text-accent-500 ml-1 uppercase">Verified Stay</Text>
                      </View>
                      <Text className="text-[10px] text-textMuted font-semibold">{item.stayDuration}</Text>
                    </View>
=======
                      {/* Verified Resident status row */}
                      <View className="flex-row items-center mt-4 flex-wrap gap-2">
                        {item.verified && (
                          <View
                            className={`border px-2 py-0.5 rounded-full flex-row items-center ${
                              isDark
                                ? 'bg-emerald-950/20 border-emerald-900/30'
                                : 'bg-emerald-50 border-emerald-100/50'
                            }`}
                          >
                            <View className="bg-emerald-500 w-3 h-3 rounded-full items-center justify-center mr-1">
                              <Ionicons name="checkmark" size={7} color="#ffffff" />
                            </View>
                            <Text className="text-emerald-600 font-black text-[8px] uppercase tracking-wider">
                              Verified Resident
                            </Text>
                          </View>
                        )}
                        <Text className="text-slate-400 font-bold text-[9px] ml-1">
                          {item.stayDuration}
                        </Text>
                      </View>
                    </View>

                    <Image
                      source={{ uri: item.image }}
                      className="w-24 h-24 rounded-2xl"
                    />
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        {/* Carousel Indicators */}
        <View className="flex-row justify-center items-center mt-3 space-x-1.5">
          {RECENT_REVIEWS.map((_, idx) => {
            const isActive = activeReviewIndex === idx;
            return (
              <View
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-4 bg-blue-600'
                    : `w-1.5 ${isDark ? 'bg-slate-800' : 'bg-slate-350'}`
                }`}
              />
            );
          })}
        </View>

<<<<<<< HEAD
              {/* Review Indicators */}
              <View className="flex-row justify-center mt-4 space-x-1.5">
                {REVIEWS_DATA.map((_, i) => (
                  <View 
                    key={i} 
                    className={`h-1.5 rounded-full ${
                      activeReviewIndex === i 
                        ? 'w-5 bg-accent-500' 
                        : 'w-1.5 bg-surface'
                    }`} 
                  />
                ))}
              </View>
            </View>

            {/* 3. Bottom Hero & Tagline */}
            <View className="px-6 items-center mt-10">
              <View className="mb-6">
                <Text className="text-lg font-black text-center tracking-tight uppercase text-text">
                  Stop guessing.
                </Text>
                <Text className="text-lg font-black text-center text-secondary-500 uppercase tracking-tight">
                  Start knowing.
                </Text>
              </View>

              <TouchableOpacity
                className="w-full h-[52px] rounded-2xl overflow-hidden shadow-premium active:opacity-90"
                onPress={handleAuthRedirect}
              >
                <LinearGradient
                  colors={['#0A4D8C', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                >
                  <Text className="text-white text-xs font-bold uppercase tracking-wider mr-2">Get Started</Text>
                  <Ionicons name="arrow-forward" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

=======
        {/* Stats Row */}
        <View
          className={`mx-6 mt-8 flex-row justify-between items-center py-4 border-t border-b ${
            isDark
              ? 'border-slate-900 bg-slate-950/20'
              : 'border-slate-100 bg-white'
          } px-2`}
        >
          {/* Stat 1 */}
          <View className="flex-1 items-center px-1">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                isDark ? 'bg-blue-950/20' : 'bg-blue-50'
              }`}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#3b82f6" />
            </View>
            <Text
              className={`font-black text-xs leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              12,540+
            </Text>
            <Text className="text-slate-400 font-semibold text-[8px] mt-1 text-center">
              Verified Reviews
            </Text>
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
          </View>

          <View className={`h-8 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Stat 2 */}
          <View className="flex-1 items-center px-1">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                isDark ? 'bg-emerald-950/20' : 'bg-emerald-50'
              }`}
            >
              <Ionicons name="business-outline" size={18} color="#10b981" />
            </View>
            <Text
              className={`font-black text-xs leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              3,210+
            </Text>
            <Text className="text-slate-400 font-semibold text-[8px] mt-1 text-center">
              Properties Listed
            </Text>
          </View>

          <View className={`h-8 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Stat 3 */}
          <View className="flex-1 items-center px-1">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                isDark ? 'bg-amber-950/20' : 'bg-amber-50'
              }`}
            >
              <Ionicons name="people-outline" size={18} color="#eab308" />
            </View>
            <Text
              className={`font-black text-xs leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              92%
            </Text>
            <Text className="text-slate-400 font-semibold text-[8px] mt-1 text-center">
              Verified Residents
            </Text>
          </View>
        </View>

        {/* Highlight Callout Box */}
        <View
          className={`mx-6 mt-6 border rounded-2xl p-4 flex-row items-center ${
            isDark
              ? 'bg-emerald-950/20 border-emerald-900/30'
              : 'bg-emerald-50/70 border-emerald-100/50'
          }`}
        >
          <View className="bg-emerald-550 w-8 h-8 rounded-full items-center justify-center mr-3 bg-emerald-500">
            <Ionicons name="shield-checkmark" size={16} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text
              className={`font-semibold text-[10px] leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-650'
              }`}
            >
              No fake reviews. No paid promotions. {'\n'}
              <Text className="text-emerald-700 dark:text-emerald-500 font-black">
                Only the truth from real residents.
              </Text>
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleAuthRedirect}
          activeOpacity={0.9}
          className={`mx-6 mt-6 py-4 rounded-2xl items-center justify-center flex-row shadow-lg ${
            isDark
              ? 'bg-blue-600 shadow-blue-500/20'
              : 'bg-[#081325] shadow-slate-950/15'
          }`}
        >
          <Text className="text-white text-xs font-black uppercase tracking-wider mr-2">
            Explore Properties
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#ffffff" />
        </TouchableOpacity>

        {/* Footer */}
        <View className="flex-row justify-center items-center mt-6 mb-8">
          <Ionicons name="lock-closed-outline" size={12} color="#94a3b8" />
          <Text className="text-slate-400 font-bold text-[10px] ml-1">
            100% Anonymous  •  Your Privacy is Our Priority
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
