import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { HomeStackParamList } from '../../../navigation/types';
import { MockDb, Property, Review } from '../../../services/mockDb';
import { RootState } from '../../../store';
import { addToWishlist, removeFromWishlist } from '../../wishlist/wishlistSlice';
import Button from '../../../components/Button';
import IssueTrends from '../../../components/IssueTrends';

type Props = NativeStackScreenProps<HomeStackParamList, 'PGDetails'>;
const { width } = Dimensions.get('window');

export default function PGDetailsScreen({ route, navigation }: Props) {
  const { pgId } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { user } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Report Modal state
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'Fake Review' | 'Abusive Content' | 'Spam' | 'Wrong Property Information'>('Fake Review');
  const [reportComment, setReportComment] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const isFavorited = wishlistItems.includes(pgId);

  const loadPropertyData = async () => {
    setLoading(true);
    const props = await MockDb.getProperties();
    const found = props.find((p) => p.id === pgId);
    setProperty(found || null);

    const revs = await MockDb.getReviews();
    const propRevs = revs.filter((r) => r.propertyId === pgId);
    setReviews(propRevs);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      loadPropertyData();
    }
  }, [pgId, isFocused]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-slate-400 font-bold">Loading listing details...</Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-slate-500 font-bold">Accommodation Listing Not Found</Text>
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
    Linking.openURL(`tel:${property.contactNumber.replace(/\s+/g, '')}`);
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(`${property.name}, ${property.address || property.location}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  // Trust score formatting
  const getTrustScoreInfo = (score: number) => {
    if (score >= 90) return { label: 'Excellent', col: 'text-green-600', bg: 'bg-green-50', stroke: '#10b981' };
    if (score >= 75) return { label: 'Good', col: 'text-teal-600', bg: 'bg-teal-50', stroke: '#14B8A6' };
    if (score >= 50) return { label: 'Average', col: 'text-orange-600', bg: 'bg-orange-50', stroke: '#f59e0b' };
    return { label: 'Poor', col: 'text-red-600', bg: 'bg-red-50', stroke: '#ef4444' };
  };

  const trustInfo = getTrustScoreInfo(property.trustScore);

  // Complaints Breakdown
  const complaints = MockDb.getComplaintsStats(reviews);

  const getGenderStyle = () => {
    switch (property.genderType) {
      case 'boys':
        return { text: 'Boys Only Hostel', textCol: 'text-blue-600', bg: 'bg-blue-50' };
      case 'girls':
        return { text: 'Girls Only Hostel', textCol: 'text-pink-600', bg: 'bg-pink-50' };
      case 'unisex':
        return { text: 'Co-Ed Accommodation', textCol: 'text-purple-600', bg: 'bg-purple-50' };
      default:
        return { text: 'Any Gender Accommodation', textCol: 'text-slate-600', bg: 'bg-slate-50' };
    }
  };

  const gender = getGenderStyle();

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

  // Submit Content Report
  const handleReportSubmit = async () => {
    if (!reportingReviewId) return;
    if (!reportComment.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Comment Required',
        text2: 'Please describe why you are reporting this review.',
        position: 'bottom',
      });
      return;
    }

    setSubmittingReport(true);
    try {
      await MockDb.submitReport({
        userId: user?.id || 'guest_user',
        reviewId: reportingReviewId,
        type: reportType,
        comment: reportComment,
      });

      Toast.show({
        type: 'success',
        text1: 'Content Flagged',
        text2: 'Thank you. The review has been sent to administrators for moderation.',
        position: 'bottom',
      });

      setReportingReviewId(null);
      setReportComment('');
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Report Failed',
        text2: e.message || 'Something went wrong.',
        position: 'bottom',
      });
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" bounces={false}>
        {/* HERO SECTION */}
        <View className="relative w-full h-[400px] bg-slate-200">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slide !== activeImageIndex) setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {property.images.map((image, idx) => (
              <Image key={idx} source={{ uri: image }} style={{ width, height: 400 }} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* Gradient Overlay for text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(15,23,42,0.85)']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220 }}
          />

          {/* Header Action Buttons */}
          <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between px-5 items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="h-11 w-11 bg-white rounded-full justify-center items-center shadow-sm elevation-2 active:scale-95"
            >
              <Ionicons name="arrow-back" size={20} color="#0f172a" />
            </TouchableOpacity>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={toggleFavorite}
                className="h-11 w-11 bg-white rounded-full justify-center items-center shadow-sm elevation-2 active:scale-95"
              >
                <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={20} color={isFavorited ? '#1d4ed8' : '#0f172a'} />
              </TouchableOpacity>
              <TouchableOpacity className="h-11 w-11 bg-white rounded-full justify-center items-center shadow-sm elevation-2 active:scale-95">
                <Ionicons name="share-social" size={20} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Content (Pill, Title, Location, Floating Trust Card) */}
          <View className="absolute bottom-10 left-5 right-5 flex-row justify-between items-end">
            <View className="flex-1 pr-4">
              <View className="bg-white rounded-full px-3 py-1.5 flex-row items-center self-start mb-3">
                <Ionicons name="people" size={12} color="#1d4ed8" />
                <Text className="text-[9px] font-black uppercase text-blue-700 ml-1.5 tracking-wider">{gender.text}</Text>
              </View>
              <Text className="text-2xl font-black text-white leading-8 mb-2 shadow-sm">{property.name}</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 pr-2">
                  <Ionicons name="location-outline" size={14} color="#e2e8f0" />
                  <Text className="text-slate-200 text-[11px] font-semibold ml-1 flex-1" numberOfLines={1}>{property.address}</Text>
                </View>
                <TouchableOpacity onPress={handleOpenMap}>
                  <Text className="text-white text-[10px] font-bold">View on Map &gt;</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Floating Trust Score Card inside Hero */}
            <View className="bg-white rounded-2xl p-3 w-[100px] items-center shadow-md elevation-4">
              <View className="flex-row items-center mb-1">
                <Ionicons name="shield-checkmark" size={12} color="#1d4ed8" />
                <Text className="text-[9px] font-bold text-slate-700 ml-1">Trust Score</Text>
              </View>
              <View className="flex-row items-baseline mb-1">
                <Text className="text-2xl font-black text-slate-800 tracking-tighter">{property.trustScore}</Text>
                <Text className="text-[10px] font-bold text-slate-500">/100</Text>
              </View>
              <Text className="text-[10px] font-bold text-green-600 mb-2">{trustInfo.label}</Text>
              <View className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <View className="h-full bg-blue-600 rounded-full" style={{ width: `${property.trustScore}%` }} />
              </View>
            </View>
          </View>
        </View>

        {/* Floating Stats Row */}
        <View className="px-5 -mt-6 z-20">
          <View className="bg-white rounded-3xl p-4 flex-row justify-between items-center shadow-sm elevation-2 border border-slate-100">
            {/* Trust Rating */}
            <View className="flex-1 items-center border-r border-slate-100">
              <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mb-1.5">
                <Ionicons name="star" size={14} color="#1d4ed8" />
              </View>
              <Text className="text-[15px] font-black text-slate-800">
                {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.ratings.overall, 0) / reviews.length).toFixed(1) : '5.0'}
              </Text>
              <Text className="text-[9px] font-semibold text-slate-500 mt-0.5">Trust Rating</Text>
              <Text className="text-[8px] text-slate-400 mt-0.5">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</Text>
            </View>

            {/* Total Reviews */}
            <View className="flex-1 items-center border-r border-slate-100">
              <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mb-1.5">
                <Ionicons name="chatbubble-ellipses" size={14} color="#1d4ed8" />
              </View>
              <Text className="text-[15px] font-black text-slate-800">{reviews.length > 0 ? `${reviews.length}+` : '0'}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 mt-0.5">Total Reviews</Text>
            </View>

            {/* Trust Score */}
            <View className="flex-1 items-center border-r border-slate-100">
              <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mb-1.5">
                <Ionicons name="shield-checkmark" size={14} color="#1d4ed8" />
              </View>
              <Text className="text-[15px] font-black text-slate-800">{property.trustScore}%</Text>
              <Text className="text-[9px] font-semibold text-slate-500 mt-0.5">Trust Score</Text>
            </View>

            {/* Prime Location */}
            <View className="flex-1 items-center">
              <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mb-1.5">
                <Ionicons name="location" size={14} color="#1d4ed8" />
              </View>
              <Text className="text-[12px] font-black text-slate-800" numberOfLines={1}>{property.location}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 mt-0.5">Prime Location</Text>
            </View>
          </View>
        </View>


        {/* ── BODY CONTENT ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>

          {/* Verified Complaint Trends */}
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <IssueTrends data={complaints} />
          </View>

          {/* Facilities & Amenities */}
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 12 }}>Facilities & Amenities</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {property.facilities.map((fac, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, minWidth: '46%', flex: 1, margin: 2 }}
                >
                  <Ionicons name={getFacilityIcon(fac)} size={16} color="#1d4ed8" />
                  <Text style={{ color: '#334155', fontSize: 12, fontWeight: '600', marginLeft: 8 }}>{fac}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* About this Property */}
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 8 }}>About this Property</Text>
            <Text style={{ color: '#64748b', fontSize: 12, lineHeight: 20, fontWeight: '500' }}>{property.description}</Text>
          </View>

          {/* Action CTAs */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('VerifyResidency', { pgId })}
              style={{ flex: 1, backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="shield-checkmark" size={15} color="#1d4ed8" />
              <Text style={{ color: '#1d4ed8', fontSize: 11, fontWeight: '800', marginLeft: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Verify Stay</Text>
            </TouchableOpacity>

            {!property.claimedBy ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('ClaimProperty', { pgId })}
                style={{ flex: 1, backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="business" size={15} color="#1d4ed8" />
                <Text style={{ color: '#1d4ed8', fontSize: 11, fontWeight: '800', marginLeft: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Claim Ownership</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Reviews List */}
          <View style={{ marginBottom: 100 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#0f172a' }}>Resident Experiences ({reviews.length})</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddReview', { pgId })}
                style={{ backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
              >
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase' }}>VIEW ALL REVIEWS &gt;</Text>
              </TouchableOpacity>
            </View>

            {reviews.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32, backgroundColor: '#f8fafc', borderRadius: 20 }}>
                <Ionicons name="chatbox-ellipses-outline" size={36} color="#cbd5e1" />
                <Text style={{ color: '#94a3b8', fontWeight: '600', fontSize: 12, marginTop: 8 }}>No reviews written yet. Be the first!</Text>
              </View>
            ) : (
              reviews.map((item) => (
                <View key={item.id} style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>

                  {/* Reviewer Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: item.verified ? '#dcfce7' : '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                        <Ionicons name={item.verified ? 'shield-checkmark' : 'person'} size={18} color={item.verified ? '#16a34a' : '#94a3b8'} />
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: item.verified ? '#16a34a' : '#334155' }}>
                          {item.verified ? '✓ Verified Resident' : 'Resident'}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '500', marginTop: 1 }}>Stayed: {item.stayDuration} Months</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '500' }}>{item.date}</Text>
                  </View>

                  {/* Star Rating Row */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Ionicons key={s} name={s <= item.ratings.overall ? 'star' : 'star-outline'} size={14} color="#f59e0b" style={{ marginRight: 2 }} />
                    ))}
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#334155', marginLeft: 6 }}>{item.ratings.overall}/5</Text>
                  </View>

                  {/* Ratings breakdown grid */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {[
                      { l: 'Food', v: item.ratings.food },
                      { l: 'Clean', v: item.ratings.cleanliness },
                      { l: 'Water', v: item.ratings.water },
                      { l: 'Wi-Fi', v: item.ratings.internet },
                      { l: 'Safety', v: item.ratings.safety },
                      { l: 'Staff', v: item.ratings.management },
                      { l: 'Refund', v: item.ratings.deposit },
                      { l: 'Maint', v: item.ratings.maintenance },
                    ].map((c) => (
                      <View key={c.l} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                        <Text style={{ fontSize: 9, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{c.l} </Text>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: c.v <= 2 ? '#ef4444' : '#0f172a' }}>{c.v}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={{ color: '#475569', fontSize: 12, lineHeight: 20, fontWeight: '500', marginBottom: 10 }}>{item.comment}</Text>

                  {/* Review gallery photos */}
                  {Object.keys(item.photos).length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                      {Object.entries(item.photos).map(([key, uri]) => {
                        if (!uri) return null;
                        return (
                          <View key={key} style={{ marginRight: 8, borderRadius: 12, overflow: 'hidden' }}>
                            <Image source={{ uri }} style={{ height: 80, width: 100 }} resizeMode="cover" />
                          </View>
                        );
                      })}
                    </ScrollView>
                  )}

                  {/* Report button */}
                  <TouchableOpacity onPress={() => setReportingReviewId(item.id)} style={{ alignSelf: 'flex-end', padding: 4 }}>
                    <Ionicons name="flag-outline" size={14} color="#ef4444" />
                  </TouchableOpacity>

                  {/* Admin inspection overlay */}
                  {user?.role === 'admin' && (
                    <View style={{ backgroundColor: 'rgba(254,242,242,0.5)', borderWidth: 1, borderColor: 'rgba(254,202,202,0.4)', borderRadius: 14, padding: 10, marginTop: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#b91c1c', textTransform: 'uppercase' }}>🛡️ Admin Inspector View</Text>
                      <Text style={{ color: '#475569', fontSize: 10, fontWeight: '500', marginTop: 4 }}>Reviewer ID: {item.reviewerId}</Text>
                    </View>
                  )}

                  {/* Owner reply */}
                  {item.ownerReply && (
                    <View style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 14, marginLeft: 8, marginTop: 10 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ color: '#1d4ed8', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>Property Owner Response</Text>
                        <Text style={{ color: '#94a3b8', fontSize: 9, fontWeight: '500' }}>{item.ownerReply.date}</Text>
                      </View>
                      <Text style={{ color: '#334155', fontSize: 11, fontWeight: '500', lineHeight: 18 }}>"{item.ownerReply.comment}"</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── STICKY BOTTOM CONTACT BAR ── */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 8 }}>
        <TouchableOpacity
          onPress={handleCall}
          style={{ backgroundColor: '#1d4ed8', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#1d4ed8', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
        >
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', marginLeft: 8, letterSpacing: 0.3 }}>Contact Property</Text>
        </TouchableOpacity>
      </View>

      {/* Report Modal */}
      {reportingReviewId !== null && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 30, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 20, width: '100%', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: '900', color: '#0f172a', marginBottom: 4 }}>Report Content</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '500', marginBottom: 16 }}>Select why you think this review violates guidelines</Text>

            {(['Fake Review', 'Abusive Content', 'Spam', 'Wrong Property Information'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setReportType(t)}
                style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: reportType === t ? '#fca5a5' : '#e2e8f0', backgroundColor: reportType === t ? '#fef2f2' : '#f8fafc', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: reportType === t ? '#b91c1c' : '#334155' }}>{t}</Text>
                {reportType === t && <Ionicons name="checkmark" size={14} color="#ef4444" />}
              </TouchableOpacity>
            ))}

            <Text style={{ color: '#475569', fontWeight: '700', fontSize: 12, marginTop: 12, marginBottom: 8 }}>Detailed explanation</Text>
            <TextInput
              style={{ width: '100%', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#0f172a', fontSize: 12, fontWeight: '500', height: 80, marginBottom: 20 }}
              placeholder="e.g. This review is written by the competitor..."
              multiline
              value={reportComment}
              onChangeText={setReportComment}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Button title="Cancel" variant="outline" onPress={() => { setReportingReviewId(null); setReportComment(''); }} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Submit Report" variant="danger" loading={submittingReport} onPress={handleReportSubmit} />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
