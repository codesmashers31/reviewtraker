import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<AuthStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Full width card with padding

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
];

// General Mock review data for different places
const REVIEWS_DATA = [
  {
    id: '1',
    type: 'PG',
    name: 'Stanza Living Munich PG',
    rating: 4.8,
    review: 'Super clean rooms, highly responsive warden, and stable high-speed WiFi. Food quality is excellent.',
    stayDuration: 'Stayed 8 months',
    location: 'Sector 62, Noida'
  },
  {
    id: '2',
    type: 'Hotel',
    name: 'Grand Palace Hotel',
    rating: 4.5,
    review: 'Exceptional room service, highly professional staff, and verified location. Proximity to metro was extremely convenient.',
    stayDuration: 'Stayed 3 nights',
    location: 'MG Road, Bangalore'
  },
  {
    id: '3',
    type: 'Cafe',
    name: 'The Roast Coffee Shop',
    rating: 4.6,
    review: 'Excellent cold brew and quiet work friendly environment. Sockets are available at almost every table.',
    stayDuration: 'Regular Visitor',
    location: 'Koramangala, Bangalore'
  },
  {
    id: '4',
    type: 'Office',
    name: 'WeWork Apex Workspace',
    rating: 4.4,
    review: 'Great ergonomics and super fast fiber internet. Conference rooms are easy to book, and pantry is well stocked.',
    stayDuration: 'Member for 6 months',
    location: 'Okhla, New Delhi'
  }
];

export default function LandingScreen({ navigation }: Props) {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  
  const bannerListRef = useRef<FlatList>(null);
  const reviewListRef = useRef<FlatList>(null);

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
      let nextIndex = activeReviewIndex + 1;
      if (nextIndex >= REVIEWS_DATA.length) {
        nextIndex = 0;
      }
      setActiveReviewIndex(nextIndex);
      reviewListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(reviewInterval);
  }, [activeReviewIndex]);

  const handleAuthRedirect = () => {
    navigation.navigate('Login');
  };

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
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
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

                    <View>
                      <View className="flex-row items-center space-x-2">
                        <Ionicons name={item.icon as any} size={16} color="#ffffff" />
                        <Text className="text-white text-[10px] font-black uppercase tracking-widest ml-1 opacity-90">
                          {item.subtitle}
                        </Text>
                      </View>
                      
                      <Text className="text-white text-lg font-black tracking-tight mt-2 leading-6">
                        {item.title}
                      </Text>
                      
                      <Text className="text-white/80 text-[11px] font-medium leading-4 mt-1.5 pr-8">
                        {item.desc}
                      </Text>
                    </View>

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
                  </View>
                )}
              />

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

          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
