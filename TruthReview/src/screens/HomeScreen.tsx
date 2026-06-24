import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';
import { useTheme } from '../features/theme/ThemeContext';
import { MockDb, Property, Review } from '../services/mockDb';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const LOCATION_CHIPS = [
  { label: 'Nearby', icon: 'navigate-outline' },
  { label: 'Adyar', icon: 'location-outline' },
  { label: 'Velachery', icon: 'location-outline' },
  { label: 'T Nagar', icon: 'location-outline' },
  { label: 'OMR', icon: 'location-outline' },
  { label: 'More', icon: 'grid-outline' },
];

const PROPERTY_TYPES = [
  { label: 'PG', icon: 'home-outline', color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Hostel', icon: 'business-outline', color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Hotel', icon: 'bed-outline', color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Co-living', icon: 'people-outline', color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Rental', icon: 'key-outline', color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Service Apt.', icon: 'briefcase-outline', color: '#1d4ed8', bg: '#eff6ff' },
];

const LOCATIONS = [
  { name: 'Adyar', count: '520+ Stays', rating: '4.3', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400' },
  { name: 'Velachery', count: '410+ Stays', rating: '4.4', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' },
  { name: 'T Nagar', count: '380+ Stays', rating: '4.2', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400' },
  { name: 'OMR', count: '620+ Stays', rating: '4.5', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' },
];

const EXPLORE_TYPES = [
  { label: 'PG', sub: 'Paying Guest', icon: 'home-outline', color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Hostel', sub: 'Student Hostel', icon: 'business-outline', color: '#8b5cf6', bg: '#f5f3ff' },
  { label: 'Hotel', sub: 'Hotels', icon: 'bed-outline', color: '#ec4899', bg: '#fdf2f8' },
  { label: 'Co-living', sub: 'Co-living Spaces', icon: 'people-outline', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Rental Rooms', sub: 'Rooms', icon: 'key-outline', color: '#10b981', bg: '#ecfdf5' },
  { label: 'Service Apt.', sub: 'Serviced', icon: 'briefcase-outline', color: '#6366f1', bg: '#eef2ff' },
];

const POPULAR_ADYAR = [
  { name: 'Royal Inn Hotel', location: 'Adyar, Chennai', rating: '4.2', reviews: 76, price: '₹2,200 - ₹3,500', priceSuffix: '/night', facilities: ['Wi-Fi', 'AC', 'Room Service'], img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
  { name: 'Co-Live Adyar', location: 'Adyar, Chennai', rating: '4.6', reviews: 112, price: '₹9,000 - ₹12,000', priceSuffix: '/mo', facilities: ['Community', 'Events'], img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400' },
  { name: 'Adyar Student Hostel', location: 'Adyar, Chennai', rating: '4.4', reviews: 80, price: '₹4,500 - ₹6,000', priceSuffix: '/mo', facilities: ['Wi-Fi', 'Mess'], img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' },
];

const TOP_RATED = [
  { name: 'Green Leaf PG', location: 'Velachery', rating: '4.6', reviews: 112, img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=300' },
  { name: 'Zolo Regent', location: 'OMR', rating: '4.6', reviews: 56, img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300' },
  { name: 'Stanza Living', location: 'Whitefield', rating: '4.7', reviews: 132, img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300' },
  { name: 'Blossom Hostel', location: 'Koramangala', rating: '4.4', reviews: 88, img: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=300' },
];

const BUDGET_STAYS = [
  { name: 'Budget PG', sub: 'Starts from', price: '₹3,500/mo', icon: 'home-outline', color: '#10b981', bg: '#ecfdf5' },
  { name: 'Student Hostel', sub: 'Starts from', price: '₹3,000/mo', icon: 'business-outline', color: '#8b5cf6', bg: '#f5f3ff' },
  { name: 'Economy Hotel', sub: 'Starts from', price: '₹1,200/night', icon: 'bed-outline', color: '#f59e0b', bg: '#fffbeb' },
  { name: 'Shared Rooms', sub: 'Starts from', price: '₹2,500/mo', icon: 'people-outline', color: '#3b82f6', bg: '#eff6ff' },
];

const METRO_STATIONS = [
  { name: 'Whitefield Metro', count: '80+ Stays', img: 'https://images.unsplash.com/photo-1541410965313-d53b3b16ef3f?w=300' },
  { name: 'Kundalahalli Metro', count: '120+ Stays', img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300' },
  { name: 'Indiranagar Metro', count: '100+ Stays', img: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300' },
  { name: 'MG Road Metro', count: '150+ Stays', img: 'https://images.unsplash.com/photo-1552560200-a03586ee739d?w=300' },
];

const RECENTLY_ADDED = [
  { name: 'New Horizon PG', location: 'Adyar, Chennai', price: '₹5,500/mo', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
  { name: 'Skyline Hostel', location: 'OMR, Chennai', price: '₹4,800/mo', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
  { name: 'Urban Stay Hotel', location: 'T Nagar, Chennai', price: '₹2,800/night', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
];

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [locationName, setLocationName] = useState('Whitefield, Bangalore');
  const [overallTrustScore, setOverallTrustScore] = useState(89);
  const [totalReviewsCount, setTotalReviewsCount] = useState(124);
  const [selectedChip, setSelectedChip] = useState('Adyar');

  useEffect(() => {
    const loadData = async () => {
      const allProps = await MockDb.getProperties();
      const allRevs = await MockDb.getReviews();
      setProperties(allProps);
      setReviews(allRevs);
      if (allProps.length > 0) {
        const sumTrust = allProps.reduce((acc, p) => acc + p.trustScore, 0);
        setOverallTrustScore(Math.round(sumTrust / allProps.length));
      }
      setTotalReviewsCount(124);
    };
    loadData();
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) return;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getLastKnownPositionAsync({});
      if (!location) location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocode = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      if (geocode?.length > 0) {
        const a = geocode[0];
        setLocationName(`${a.district || a.name || 'Whitefield'}, ${a.city || 'Bangalore'}`);
      }
    } catch (_) {}
  };

  const goSearch = (query?: string | any) => {
    if (query && typeof query === 'string') {
      navigation.navigate('SearchStack', {
        screen: 'Search',
        params: { location: query, query }
      });
    } else {
      navigation.navigate('SearchStack', { screen: 'Search' });
    }
  };
  const goDetails = (id: string) => navigation.navigate('PGDetails', { pgId: id });

  const bg = isDark ? '#0f172a' : '#f8faff';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '#334155' : '#f1f5f9';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const sectionBg = isDark ? '#1e293b' : '#ffffff';

  const SectionHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
      <Text style={{ fontSize: 15, fontWeight: '900', color: textMain, letterSpacing: -0.3 }}>{title}</Text>
      <TouchableOpacity onPress={onPress || goSearch}>
        <Text style={{ color: '#3b82f6', fontSize: 12, fontWeight: '700' }}>View all</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ── 1. HEADER ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#1d4ed8', borderRadius: 12, width: 34, height: 34, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="shield-checkmark" size={18} color="#fff" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 17, fontWeight: '900', color: textMain, letterSpacing: -0.5 }}>Truth </Text>
                <Text style={{ fontSize: 17, fontWeight: '900', color: '#1d4ed8', letterSpacing: -0.5 }}>Review</Text>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" size={10} color="#1d4ed8" />
                <Text style={{ fontSize: 11, color: textSub, marginLeft: 3, fontWeight: '600' }}>{locationName}</Text>
                <Ionicons name="chevron-down" size={10} color={textSub} style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => Toast.show({ type: 'info', text1: 'Notifications' })} style={{ position: 'relative', padding: 2 }}>
              <Ionicons name="notifications-outline" size={22} color={textMain} />
              <View style={{ position: 'absolute', right: 2, top: 2, width: 8, height: 8, backgroundColor: '#1d4ed8', borderRadius: 4, borderWidth: 1.5, borderColor: '#fff' }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#e2e8f0' }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 2. SEARCH BAR ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <TouchableOpacity onPress={goSearch} activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: sectionBg, borderRadius: 14, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: cardBorder, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
            <Ionicons name="search-outline" size={18} color="#94a3b8" />
            <Text style={{ flex: 1, marginLeft: 10, fontSize: 13, color: '#94a3b8', fontWeight: '500' }}>Search PGs, Hostels, Hotels...</Text>
            <View style={{ backgroundColor: '#1d4ed8', width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="options-outline" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── 3. LOCATION CHIPS ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }} style={{ marginBottom: 16 }}>
          {LOCATION_CHIPS.map((chip) => {
            const active = selectedChip === chip.label;
            return (
              <TouchableOpacity
                key={chip.label}
                onPress={() => setSelectedChip(chip.label)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: active ? '#1d4ed8' : sectionBg,
                  borderWidth: 1,
                  borderColor: active ? '#1d4ed8' : cardBorder,
                }}
              >
                <Ionicons
                  name={chip.icon as any}
                  size={12}
                  color={active ? '#fff' : '#1d4ed8'}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#fff' : textSub }}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── 4. HERO BANNER ── */}
        <TouchableOpacity
          onPress={goSearch}
          activeOpacity={0.95}
          style={{
            marginHorizontal: 20,
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 20,
            elevation: 8,
            shadowColor: '#1d4ed8',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 }
          }}
        >
          <Image
            source={require('../../assets/hero_banner.jpg')}
            style={{ width: '100%', height: 194 }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* ── 5. PROPERTY TYPE ICON ROW ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }} style={{ marginBottom: 20 }}>
          {PROPERTY_TYPES.map((pt) => (
            <TouchableOpacity key={pt.label} onPress={goSearch} style={{ alignItems: 'center', width: 60 }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: pt.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 6, borderWidth: 1, borderColor: pt.bg }}>
                <Ionicons name={pt.icon as any} size={24} color={pt.color} />
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: textMain, textAlign: 'center' }}>{pt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── 6. STATS ROW ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', backgroundColor: sectionBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}>
            {[
              { value: '12,450+', label: 'Verified Reviews', icon: 'star', color: '#f59e0b' },
              { value: '3,210+', label: 'Properties Listed', icon: 'business', color: '#3b82f6' },
              { value: '92%', label: 'Verified Residents', icon: 'shield-checkmark', color: '#10b981' },
              { value: '4.6/5', label: 'Avg. Rating', icon: 'people', color: '#8b5cf6' },
            ].map((stat, i, arr) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: cardBorder }}>
                <Ionicons name={stat.icon as any} size={16} color={stat.color} />
                <Text style={{ fontSize: 13, fontWeight: '900', color: textMain, marginTop: 4, letterSpacing: -0.3 }}>{stat.value}</Text>
                <Text style={{ fontSize: 8, color: textSub, fontWeight: '600', textAlign: 'center', marginTop: 2, lineHeight: 11 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 7. BROWSE BY LOCATION ── */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader title="Browse by Location" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {LOCATIONS.map((loc, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.9}
                onPress={() => goSearch(loc.name)}
                style={{
                  width: 120,
                  height: 160,
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <Image
                  source={{ uri: loc.img }}
                  style={{ width: '100%', height: '100%', position: 'absolute' }}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(15,23,42,0.85)']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 100,
                  }}
                />
                <View style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#ffffff', marginBottom: 2 }}>
                    {loc.name}
                  </Text>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 }}>
                    {loc.count}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="star" size={11} color="#fbbf24" style={{ marginRight: 2 }} />
                    <Text style={{ fontSize: 10, fontWeight: '900', color: '#fbbf24' }}>
                      {loc.rating}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 8. EXPLORE BY PROPERTY TYPE ── */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader title="Explore by Property Type" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {EXPLORE_TYPES.map((type, i) => (
              <TouchableOpacity key={i} onPress={goSearch} style={{ width: 90, alignItems: 'center', backgroundColor: sectionBg, borderRadius: 20, borderWidth: 1, borderColor: cardBorder, paddingVertical: 14, paddingHorizontal: 6, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: type.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name={type.icon as any} size={20} color={type.color} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: '800', color: textMain, textAlign: 'center' }}>{type.label}</Text>
                <Text style={{ fontSize: 9, color: textSub, fontWeight: '500', textAlign: 'center', marginTop: 2 }}>{type.sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 9. POPULAR STAYS IN ADYAR ── */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader title="Popular Stays in Adyar" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
            {POPULAR_ADYAR.map((prop, i) => (
              <TouchableOpacity key={i} activeOpacity={0.9} style={{ width: 220, backgroundColor: sectionBg, borderRadius: 24, borderWidth: 0, overflow: 'hidden', shadowColor: '#1d4ed8', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 }}>
                <View style={{ height: 130, position: 'relative' }}>
                  <Image source={{ uri: prop.img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  {/* Verified badge */}
                  <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="checkmark-circle" size={9} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800', marginLeft: 3 }}>VERIFIED</Text>
                  </View>
                  {/* Heart */}
                  <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="heart-outline" size={14} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: textMain, marginBottom: 3 }} numberOfLines={1}>{prop.name}</Text>
                  <Text style={{ fontSize: 10, color: textSub, marginBottom: 6 }} numberOfLines={1}>{prop.location}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="star" size={11} color="#f59e0b" />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#f59e0b', marginLeft: 3 }}>{prop.rating}</Text>
                    <Text style={{ fontSize: 10, color: textSub, marginLeft: 4 }}>({prop.reviews})</Text>
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: textMain, marginBottom: 8 }}>{prop.price}<Text style={{ fontSize: 9, fontWeight: '500', color: textSub }}> {prop.priceSuffix}</Text></Text>
                  <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                    {prop.facilities.map((f, fi) => (
                      <View key={fi} style={{ backgroundColor: '#f0f9ff', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, borderWidth: 1, borderColor: '#bae6fd' }}>
                        <Text style={{ fontSize: 8, color: '#0369a1', fontWeight: '700' }}>{f}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 10. TOP RATED STAYS ── */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader title="Top Rated Stays" />
          <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {TOP_RATED.map((prop, idx) => (
              <TouchableOpacity key={idx} onPress={goSearch} activeOpacity={0.9} style={{ width: (width - 52) / 2, backgroundColor: sectionBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, overflow: 'hidden' }}>
                <View style={{ height: 100, position: 'relative' }}>
                  <Image source={{ uri: prop.img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: textMain, marginBottom: 2 }} numberOfLines={1}>{prop.name}</Text>
                  <Text style={{ fontSize: 10, color: textSub, marginBottom: 4 }} numberOfLines={1}>{prop.location}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="star" size={10} color="#f59e0b" />
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#f59e0b', marginLeft: 3 }}>{prop.rating}</Text>
                    <Text style={{ fontSize: 9, color: textSub, marginLeft: 3 }}>({prop.reviews})</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 11. BUDGET FRIENDLY STAYS ── */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader title="Budget Friendly Stays" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {BUDGET_STAYS.map((item, i) => (
              <TouchableOpacity key={i} onPress={goSearch} style={{ width: 130, backgroundColor: sectionBg, borderRadius: 16, borderWidth: 1, borderColor: cardBorder, padding: 14, alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: item.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: textMain, textAlign: 'center', marginBottom: 4 }}>{item.name}</Text>
                <Text style={{ fontSize: 9, color: textSub, marginBottom: 4 }}>{item.sub}</Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#1d4ed8' }}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 12. REFER & EARN BANNER ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ backgroundColor: sectionBg, borderRadius: 18, borderWidth: 1, borderColor: cardBorder, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: textMain }}>Refer & Earn Rewards </Text>
                <Text style={{ fontSize: 14 }}>🎁</Text>
              </View>
              <Text style={{ fontSize: 10, color: textSub, fontWeight: '500', marginBottom: 12, lineHeight: 15 }}>Refer your friends and earn exciting rewards.</Text>
              <TouchableOpacity style={{ backgroundColor: '#1d4ed8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', shadowColor: '#1d4ed8', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>Refer Now</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', paddingLeft: 12 }}>
              <Text style={{ fontSize: 44 }}>🎁</Text>
              <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                {['🌟','✨','💫'].map((s, i) => <Text key={i} style={{ fontSize: 10 }}>{s}</Text>)}
              </View>
            </View>
          </View>
        </View>

        {/* ── 13. NEAR METRO STATIONS ── */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader title="Near Metro Stations" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
            {METRO_STATIONS.map((item, i) => (
              <TouchableOpacity key={i} activeOpacity={0.9} style={{ width: 140, backgroundColor: sectionBg, borderRadius: 20, borderWidth: 0, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 }}>
                <View style={{ height: 90, position: 'relative' }}>
                  <Image source={{ uri: item.img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: textMain, marginBottom: 2 }} numberOfLines={1}>{item.name}</Text>
                  <Text style={{ fontSize: 10, color: textSub }} numberOfLines={1}>{item.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 14. RECENTLY ADDED ── */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader title="Recently Added" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
            {RECENTLY_ADDED.map((item, i) => (
              <TouchableOpacity key={i} activeOpacity={0.9} style={{ width: 180, backgroundColor: sectionBg, borderRadius: 20, borderWidth: 0, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 }}>
                <View style={{ height: 110, position: 'relative' }}>
                  <Image source={{ uri: item.img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  <TouchableOpacity style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="heart-outline" size={13} color="#ef4444" />
                  </TouchableOpacity>
                  <View style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: '#1d4ed8', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 }}>
                    <Text style={{ fontSize: 8, color: '#fff', fontWeight: '800' }}>NEW</Text>
                  </View>
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: textMain, marginBottom: 2 }} numberOfLines={1}>{item.name}</Text>
                  <Text style={{ fontSize: 9, color: textSub, marginBottom: 4 }} numberOfLines={1}>{item.location}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#1d4ed8' }}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 15. STUDENT RECOMMENDED ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionHeader title="Student Recommended" />
          <View style={{ backgroundColor: sectionBg, borderRadius: 18, borderWidth: 1, borderColor: cardBorder, padding: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#dbeafe', marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: textSub, fontWeight: '500', fontStyle: 'italic', lineHeight: 18, marginBottom: 10 }}>
                  "Stanza Living has the best environment for students. Safe, clean and comfortable."
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '800', color: textMain }}>– Priya Sharma</Text>
                <Text style={{ fontSize: 9, color: textSub, marginTop: 2 }}>Christ University</Text>
              </View>
              <View style={{ alignItems: 'center', marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', gap: 2, marginBottom: 4 }}>
                  {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={10} color="#f59e0b" />)}
                </View>
                <Text style={{ fontSize: 14, fontWeight: '900', color: textMain }}>4.8</Text>
              </View>
            </View>
            {/* Dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 12 }}>
              {[1,2,3,4].map((d, i) => (
                <View key={d} style={{ width: i === 0 ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? '#1d4ed8' : '#e2e8f0' }} />
              ))}
            </View>
          </View>
        </View>

        {/* ── 16. COMPLAINTS & SAFETY INSIGHTS ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionHeader title="Complaints & Safety Insights" />
          <View style={{ backgroundColor: sectionBg, borderRadius: 18, borderWidth: 1, borderColor: cardBorder, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[
                { label: 'Food Issues', count: '46', icon: 'restaurant-outline', color: '#ef4444', bg: '#fef2f2' },
                { label: 'Water Problems', count: '28', icon: 'water-outline', color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Deposit Delay', count: '14', icon: 'hourglass-outline', color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Safety Concerns', count: '5', icon: 'shield-checkmark-outline', color: '#10b981', bg: '#ecfdf5' },
              ].map((item, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name={item.icon as any} size={16} color={item.color} />
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: textMain }}>{item.count}</Text>
                  <Text style={{ fontSize: 8, color: textSub, textAlign: 'center', marginTop: 2, lineHeight: 11 }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 17. WHY CHOOSE TRUTH REVIEW? ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionHeader title="Why Choose Truth Review?" onPress={() => {}} />
          <View style={{ backgroundColor: sectionBg, borderRadius: 18, borderWidth: 1, borderColor: cardBorder, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[
                { label: '100% Verified\nProperties', icon: 'shield-checkmark-outline', color: '#1d4ed8', bg: '#eff6ff' },
                { label: 'Real Reviews\nBy Residents', icon: 'chatbubble-ellipses-outline', color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Trusted by\nStudents', icon: 'school-outline', color: '#10b981', bg: '#ecfdf5' },
                { label: 'Safe & Secure\nPlatform', icon: 'lock-closed-outline', color: '#8b5cf6', bg: '#f5f3ff' },
              ].map((item, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: item.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={{ fontSize: 8, color: textMain, textAlign: 'center', fontWeight: '700', lineHeight: 12 }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── 18. ADD REVIEW CTA BANNER ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <View style={{ backgroundColor: '#1d4ed8', borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#1d4ed8', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#fff', marginBottom: 4 }}>Add Your Review & Help Others</Text>
              <Text style={{ fontSize: 11, color: '#bfdbfe', fontWeight: '500' }}>Your review can help someone choose better</Text>
            </View>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('AddReviewTab')}
              style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}
            >
              <Ionicons name="create-outline" size={14} color="#1d4ed8" />
              <Text style={{ fontSize: 11, fontWeight: '900', color: '#1d4ed8', marginLeft: 4 }}>Add Review</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
