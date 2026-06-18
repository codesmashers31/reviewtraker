import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import Svg, { Path as SvgPath, Circle as SvgCircle } from 'react-native-svg';
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
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-textMuted font-bold">Loading listing details...</Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-textMuted font-bold">Accommodation Listing Not Found</Text>
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
    if (score >= 90) return { label: 'Excellent', col: 'text-green-400', bg: 'bg-green-950/35 border border-green-500/20', stroke: '#10b981' };
    if (score >= 75) return { label: 'Good', col: 'text-secondary-500', bg: 'bg-secondary-950/35 border border-secondary-500/20', stroke: '#2563eb' };
    if (score >= 50) return { label: 'Average', col: 'text-orange-400', bg: 'bg-orange-950/35 border border-orange-500/20', stroke: '#f59e0b' };
    return { label: 'Poor', col: 'text-rose-400', bg: 'bg-rose-950/35 border border-rose-500/20', stroke: '#ef4444' };
  };

  const trustInfo = getTrustScoreInfo(property.trustScore);

  // Complaints Breakdown
  const complaints = MockDb.getComplaintsStats(reviews);

  const getGenderStyle = () => {
    switch (property.genderType) {
      case 'boys':
        return { text: 'Boys Only Hostel', textCol: 'text-blue-300', bg: 'bg-blue-950/60 border border-blue-500/35' };
      case 'girls':
        return { text: 'Girls Only Hostel', textCol: 'text-pink-300', bg: 'bg-pink-950/60 border border-pink-500/35' };
      case 'unisex':
        return { text: 'Co-Ed Accommodation', textCol: 'text-purple-300', bg: 'bg-purple-950/60 border border-purple-500/35' };
      default:
        return { text: 'Any Gender Accommodation', textCol: 'text-slate-300', bg: 'bg-slate-800 border border-slate-700' };
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
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Back & Save overlay */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between px-5 items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-black/60 rounded-full justify-center items-center border border-white/10 active:scale-95"
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleFavorite}
          className="h-10 w-10 bg-black/60 rounded-full justify-center items-center border border-white/10 active:scale-95"
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorited ? '#D4A5A5' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Gallery Image Carousel */}
        <View className="relative h-72 bg-surface">
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
            {property.images.map((image, idx) => (
              <Image
                key={idx}
                source={{ uri: image }}
                style={{ width, height: 288 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Dots */}
          {property.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2 gap-1.5">
              {property.images.map((_, idx) => (
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

        {/* Contents */}
        <View className="p-5">
          {/* Tag + Title */}
          <View className="flex-row items-center justify-between mb-2">
            <View className={`px-3 py-1 rounded-full ${gender.bg}`}>
              <Text className={`text-[10px] font-black uppercase tracking-wide ${gender.textCol}`}>
                {gender.text}
              </Text>
            </View>

            <Text className="text-[10px] text-textMuted font-extrabold uppercase">{property.type}</Text>
          </View>

          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-black text-text flex-1 mr-3 leading-8">
              {property.name}
            </Text>
            
            {/* Verified Badge */}
            {(property.claimedBy !== null || property.trustScore >= 80) && (
              <View className="bg-accent-500 rounded-full px-2.5 py-1 flex-row items-center mt-1 shadow-md">
                <Ionicons name="checkmark-circle" size={12} color="#1A1D29" />
                <Text className="text-[#1A1D29] text-[9px] font-black ml-1 uppercase">Verified Stay</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={16} color="#94A3B8" />
            <Text className="text-textMuted text-xs font-semibold ml-1.5 flex-1" numberOfLines={1}>
              {property.address}
            </Text>
            <TouchableOpacity onPress={handleOpenMap} className="ml-2">
              <Text className="text-secondary-500 font-black text-xs">View Map</Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Trust Score Section */}
          <View className="bg-card border border-borderSubtle rounded-3xl p-5 mb-6 flex-row justify-between items-center shadow-premium">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-extrabold text-text">Trust Score</Text>
                <View className={`px-2 py-0.5 rounded-md ${trustInfo.bg}`}>
                  <Text className={`text-[10px] font-black uppercase ${trustInfo.col}`}>{trustInfo.label}</Text>
                </View>
              </View>
              <Text className="text-xs text-textMuted font-semibold mt-1 leading-5">
                Calculated dynamically weighting verified stays, reviews freshness, and complaint ratios.
              </Text>
            </View>

            {/* Circular Gauge */}
            <View className="relative justify-center items-center h-20 w-20">
              <Svg height={80} width={80}>
                {/* Background arc */}
                <SvgCircle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#23283B"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Progress arc */}
                <SvgCircle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke={trustInfo.stroke}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - property.trustScore / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </Svg>
              <View className="absolute items-center">
                <Text className="text-text text-xl font-black">{property.trustScore}</Text>
                <Text className="text-textMuted text-[8px] font-black uppercase">out of 100</Text>
              </View>
            </View>
          </View>

          {/* Reusable Issue Trends Chart */}
          <View className="mb-6">
            <IssueTrends data={complaints} />
          </View>

          {/* Amenities */}
          <View className="mb-6">
            <Text className="text-base font-extrabold text-text mb-3">Facilities & Amenities</Text>
            <View className="flex-row flex-wrap gap-2">
              {property.facilities.map((fac, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center bg-card border border-borderSubtle px-3 py-2.5 rounded-xl min-w-[46%] m-0.5"
                >
                  <Ionicons name={getFacilityIcon(fac)} size={15} color="#D4A5A5" />
                  <Text className="text-textBody text-xs font-bold ml-2">{fac}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-base font-extrabold text-text mb-2">About this Property</Text>
            <Text className="text-textMuted text-xs leading-6 font-semibold">
              {property.description}
            </Text>
          </View>

          {/* Action CTAs */}
          <View className="flex-row gap-3 mb-8 border-t border-borderSubtle pt-6">
            <TouchableOpacity
              onPress={() => navigation.navigate('VerifyResidency', { pgId })}
              className="flex-1 bg-card border border-borderSubtle py-3.5 rounded-2xl flex-row items-center justify-center active:opacity-90"
            >
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text className="text-[#10B981] text-xs font-black ml-2 uppercase">Verify Stay</Text>
            </TouchableOpacity>

            {!property.claimedBy ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('ClaimProperty', { pgId })}
                className="flex-1 bg-card border border-borderSubtle py-3.5 rounded-2xl flex-row items-center justify-center active:opacity-90"
              >
                <Ionicons name="business" size={16} color="#D4A5A5" />
                <Text className="text-[#D4A5A5] text-xs font-black ml-2 uppercase">Claim ownership</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Reviews List */}
          <View className="border-t border-borderSubtle pt-6 mb-20">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-extrabold text-text">
                Resident Experiences ({reviews.length})
              </Text>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate('AddReview', { pgId })}
                className="bg-card border border-borderSubtle px-3 py-1.5 rounded-xl"
              >
                <Text className="text-xs font-black text-accent-500 uppercase">Write Review</Text>
              </TouchableOpacity>
            </View>

            {reviews.length === 0 ? (
              <View className="items-center py-8 bg-card rounded-2xl border border-borderSubtle">
                <Ionicons name="chatbox-ellipses-outline" size={36} color="#94A3B8" />
                <Text className="text-textMuted font-bold text-xs mt-2">No reviews written yet. Be the first!</Text>
              </View>
            ) : (
              reviews.map((item) => (
                <View key={item.id} className="border-b border-borderSubtle py-5">
                  
                  {/* Anonymous reviewer metadata */}
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                      <Ionicons
                        name={item.verified ? 'shield-checkmark' : 'person-circle-outline'}
                        size={20}
                        color={item.verified ? '#D4A5A5' : '#94a3b8'}
                      />
                      <View className="ml-2">
                        <Text className={`text-xs font-black ${item.verified ? 'text-accent-500' : 'text-text'}`}>
                          {item.verified ? 'Verified Resident' : 'Resident'}
                        </Text>
                        <Text className="text-[9px] text-textMuted font-bold mt-0.5">
                          Stayed: {item.stayDuration} Months • {item.stayStartDate}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-textMuted text-[9px] font-semibold">{item.date}</Text>
                  </View>

                  {/* Overall stars & flag button */}
                  <View className="flex-row justify-between items-center mb-3 bg-surface p-2 rounded-xl border border-borderSubtle">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={12} color="#D4A5A5" />
                      <Text className="text-textBody text-xs font-black ml-1.5">Overall rating: {item.ratings.overall}/5</Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => setReportingReviewId(item.id)} className="p-1">
                      <Ionicons name="flag-outline" size={13} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Ratings breakdown (collapsible design / grid) */}
                  <View className="flex-row flex-wrap gap-2.5 mb-3 px-1">
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
                      <View key={c.l} className="flex-row items-center bg-surface border border-borderSubtle px-2 py-1 rounded-md">
                        <Text className="text-textMuted text-[9px] font-bold uppercase">{c.l}:</Text>
                        <Text className={`text-[10px] font-black ml-1 ${c.v <= 2 ? 'text-red-400' : 'text-text'}`}>{c.v}</Text>
                      </View>
                    ))}
                  </View>

                  <Text className="text-textBody text-xs font-semibold leading-5 mb-4 px-1">{item.comment}</Text>

                  {/* Review gallery photos */}
                  {Object.keys(item.photos).length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4 px-1">
                      {Object.entries(item.photos).map(([key, uri]) => {
                        if (!uri) return null;
                        return (
                          <View key={key} className="mr-2 relative rounded-xl overflow-hidden bg-surface border border-borderSubtle">
                            <Image source={{ uri }} className="h-24 w-32" resizeMode="cover" />
                            <View className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded-md">
                              <Text className="text-[8px] text-white font-extrabold uppercase">{key}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  )}

                  {/* Admin inspection overlay */}
                  {user?.role === 'admin' && (
                    <View className="bg-red-950/20 border border-red-900/35 rounded-2xl p-3 mb-4">
                      <Text className="text-[10px] font-black text-red-400 uppercase">🛡️ Admin Inspector View</Text>
                      <Text className="text-textMuted text-[10px] font-semibold mt-1">Reviewer account ID: {item.reviewerId}</Text>
                    </View>
                  )}

                  {/* Owner replies response */}
                  {item.ownerReply && (
                    <View className="bg-surface border border-borderSubtle rounded-2xl p-4.5 ml-2 mt-2">
                      <View className="flex-row justify-between items-center mb-1.5">
                        <Text className="text-accent-500 text-[10px] font-black uppercase tracking-wider">Property Owner Response</Text>
                        <Text className="text-textMuted text-[9px] font-semibold">{item.ownerReply.date}</Text>
                      </View>
                      <Text className="text-textBody text-xs font-semibold leading-5">"{item.ownerReply.comment}"</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Booking and contact bottom drawer */}
      <View className="border-t border-borderSubtle bg-surface px-5 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-textMuted text-[10px] font-black uppercase tracking-wide">Trust Rating</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={16} color="#D4A5A5" />
            <Text className="text-text text-lg font-black ml-1">
              {reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.ratings.overall, 0) / reviews.length).toFixed(1)
                : 'N/A'
              }
            </Text>
            <Text className="text-textMuted text-[10px] font-bold ml-1.5">({reviews.length} reviews)</Text>
          </View>
        </View>

        <TouchableOpacity
          className="h-[48px] rounded-xl overflow-hidden shadow-premium active:opacity-90 px-6 justify-center"
          onPress={handleCall}
        >
          <LinearGradient
            colors={['#0A4D8C', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, borderRadius: 12 }}
          />
          <View className="flex-row items-center justify-center">
            <Ionicons name="call" size={16} color="#ffffff" />
            <Text className="text-white text-base font-extrabold ml-2">Contact Property</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Simple ABSOLUTE VIEW Modal overlay for Content Reporting */}
      {reportingReviewId !== null && (
        <View className="absolute inset-0 bg-black/75 z-30 justify-center items-center px-6">
          <View className="bg-card border border-borderSubtle rounded-3xl p-5 w-full shadow-2xl">
            <Text className="text-lg font-black text-text mb-1">Report Content</Text>
            <Text className="text-textMuted text-xs font-semibold mb-4">Select why you think this review violates guidelines</Text>

            {/* Type selector */}
            {(['Fake Review', 'Abusive Content', 'Spam', 'Wrong Property Information'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setReportType(t)}
                className={`py-3 px-4 rounded-xl border mb-2 flex-row justify-between items-center ${
                  reportType === t ? 'bg-red-950/20 border-red-500/30' : 'bg-surface border-borderSubtle'
                }`}
              >
                <Text className={`text-xs font-bold ${reportType === t ? 'text-red-400' : 'text-textMuted'}`}>{t}</Text>
                {reportType === t && <Ionicons name="checkmark" size={14} color="#ef4444" />}
              </TouchableOpacity>
            ))}

            <Text className="text-textMuted font-bold text-xs mt-3 mb-2">Detailed explanation</Text>
            <TextInput
              className="w-full bg-surface border border-borderSubtle rounded-xl px-3 py-2 text-text text-xs font-semibold h-20 mb-6"
              placeholder="e.g. This review is written by the competitor..."
              placeholderTextColor="#94A3B8"
              multiline
              value={reportComment}
              onChangeText={setReportComment}
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setReportingReviewId(null);
                    setReportComment('');
                  }}
                />
              </View>
              <View className="flex-1">
                <Button
                  title="Submit Report"
                  variant="danger"
                  loading={submittingReport}
                  onPress={handleReportSubmit}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
