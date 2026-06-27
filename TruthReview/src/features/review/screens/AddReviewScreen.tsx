import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { HomeStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { MockDb } from '../../../services/mockDb';
import { RootState } from '../../../store';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddReview'>;

export default function AddReviewScreen({ route, navigation }: Props) {
  const { pgId, pgName } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);

  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [stayMonths, setStayMonths] = useState('');
  const [stayStartPeriod, setStayStartPeriod] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [recommended, setRecommended] = useState<boolean>(true);

  // 9 Rating Dimensions State
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    food: 0,
    security: 0,
    wifi: 0,
    staff: 0,
    location: 0,
    water: 0,
    valueForMoney: 0,
    overall: 0,
  });

  const PROS_OPTIONS = ['Clean Rooms', 'Good Food', 'Fast WiFi', 'Helpful Staff', 'Extremely Secure', 'Good Location', 'Value for Money'];
  const CONS_OPTIONS = ['Limited Parking', 'Bad Food Quality', 'Slow WiFi at night', 'Deposit Issues', 'Water Issues', 'Strict Rules'];

  const togglePro = (pro: string) => setPros(prev => prev.includes(pro) ? prev.filter(p => p !== pro) : [...prev, pro]);
  const toggleCon = (con: string) => setCons(prev => prev.includes(con) ? prev.filter(c => c !== con) : [...prev, con]);

  // Attached Photos Simulation
  const [photos, setPhotos] = useState<{
    room?: string;
    food?: string;
    washroom?: string;
    building?: string;
  }>({});

  const handleRatingChange = (key: keyof typeof ratings, val: number) => {
    setRatings(prev => ({ ...prev, [key]: val }));
  };

  const handleAttachPhoto = (category: 'room' | 'food' | 'washroom' | 'building') => {
    const urls = {
      room: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80',
      food: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=300&q=80',
      washroom: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80',
      building: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80',
    };

    setPhotos(prev => ({ ...prev, [category]: urls[category] }));
    Toast.show({
      type: 'success',
      text1: 'Photo Attached',
      text2: `Simulated upload for ${category} completed.`,
      position: 'bottom',
    });
  };

  const handleRemovePhoto = (category: 'room' | 'food' | 'washroom' | 'building') => {
    setPhotos(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const onSubmitReview = async () => {
    if (ratings.overall === 0) {
      Toast.show({
        type: 'error',
        text1: 'Overall Rating Required',
        text2: 'Please provide at least an overall rating before submitting.',
        position: 'bottom',
      });
      return;
    }
    
    if (comment.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Review too short',
        text2: 'Please write a descriptive comment of at least 10 characters.',
        position: 'bottom',
      });
      return;
    }

    setSubmitting(true);
    try {
      await MockDb.addReview({
        propertyId: pgId,
        reviewerId: user?.id || 'guest_user',
        reviewerName: reviewerName.trim() || undefined,
        ratings,
        comment,
        pros,
        cons,
        recommended,
        photos,
        stayDuration: Number(stayMonths) || 1,
        stayStartDate: stayStartPeriod || 'Unknown',
      });

      Toast.show({
        type: 'success',
        text1: 'Review Posted 🎉',
        text2: 'Thank you! Your verified review is now live.',
        position: 'bottom',
      });

      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error.message || 'Something went wrong.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to dynamically color stars based on rating selected
  const getRatingColor = (val: number, currentStarIndex: number) => {
    if (currentStarIndex > val) return '#cbd5e1'; // Inactive slate-300
    if (val <= 2) return '#ef4444'; // Red for poor
    if (val === 3) return '#f59e0b'; // Amber for average
    return '#10b981'; // Emerald green for good/excellent
  };
  
  const getRatingBgColor = (val: number) => {
    if (val === 0) return 'bg-slate-100';
    if (val <= 2) return 'bg-red-50';
    if (val === 3) return 'bg-amber-50';
    return 'bg-emerald-50';
  };
  
  const getRatingTextColor = (val: number) => {
    if (val === 0) return 'text-slate-400';
    if (val <= 2) return 'text-red-600';
    if (val === 3) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const renderStarSelector = (label: string, key: keyof typeof ratings, isPrimary: boolean = false) => {
    const value = ratings[key];
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingChange(key, i)}
          className={`active:scale-90 transition-transform ${isPrimary ? 'mx-1' : 'mx-0.5'}`}
        >
          <Ionicons
            name={i <= value ? 'star' : 'star-outline'}
            size={isPrimary ? 28 : 20}
            color={getRatingColor(value, i)}
          />
        </TouchableOpacity>
      );
    }
    
    return (
      <View className={`flex-row justify-between items-center ${isPrimary ? 'pb-5 pt-2 border-b border-slate-100 mb-2' : 'py-3 border-b border-slate-50'}`}>
        <Text className={`${isPrimary ? 'text-slate-900 text-sm font-black' : 'text-slate-700 text-[13px] font-bold'}`}>{label}</Text>
        <View className="flex-row items-center">
          <View className="flex-row mr-3">{stars}</View>
          <View className={`px-2 py-1 rounded-md min-w-[28px] items-center ${getRatingBgColor(value)}`}>
            <Text className={`text-[11px] font-black ${getRatingTextColor(value)}`}>{value || '-'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      {/* Sticky Premium Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm z-10">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-full justify-center items-center active:bg-slate-100"
          >
            <Ionicons name="close" size={20} color="#0f172a" />
          </TouchableOpacity>
          <View className="ml-3">
            <Text className="text-xl font-black text-slate-900">Rate & Review</Text>
            <Text className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Verified Resident</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 pt-6 pb-20">

          {/* Privacy & Trust Card */}
          <View className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 mb-8 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="bg-emerald-100 p-1.5 rounded-full mr-2">
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
              </View>
              <Text className="text-sm font-extrabold text-emerald-800">100% Anonymous Review</Text>
            </View>
            <Text className="text-[11px] text-emerald-700 font-medium leading-5">
              Your identity is protected. We will mask your Name, Email, and exact details. The public will only see "Verified Resident" and your ratings to ensure you can speak the truth safely.
            </Text>
          </View>

          {/* Core Ratings Card */}
          <View className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="podium" size={16} color="#3b82f6" />
              <Text className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1.5">Rating Matrix</Text>
            </View>
            
            {renderStarSelector('Overall Experience', 'overall', true)}
            
            <View className="mt-2">
              {renderStarSelector('Cleanliness', 'cleanliness')}
              {renderStarSelector('Food Quality', 'food')}
              {renderStarSelector('Security', 'security')}
              {renderStarSelector('WiFi Speed', 'wifi')}
              {renderStarSelector('Staff & Management', 'staff')}
              {renderStarSelector('Location', 'location')}
              {renderStarSelector('Water Facility', 'water')}
              {renderStarSelector('Value For Money', 'valueForMoney')}
            </View>
          </View>

          {/* Recommendation Toggle */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setRecommended(!recommended)}
            className={`flex-row items-center justify-between p-5 rounded-3xl mb-8 shadow-sm border ${recommended ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}
          >
            <View className="flex-row items-center flex-1">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${recommended ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                <Ionicons name={recommended ? "checkmark-circle" : "close-circle"} size={24} color={recommended ? "white" : "#94a3b8"} />
              </View>
              <View>
                <Text className={`text-sm font-black ${recommended ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {recommended ? 'Yes, I recommend this place' : 'No, I do not recommend'}
                </Text>
                <Text className={`text-[10px] font-bold mt-0.5 ${recommended ? 'text-emerald-600' : 'text-slate-500'}`}>
                  Would you tell a friend to stay here?
                </Text>
              </View>
            </View>
            <View className={`w-12 h-6 rounded-full p-1 flex-row ${recommended ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}>
              <View className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </View>
          </TouchableOpacity>

          {/* Pros & Cons Selectors */}
          <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Key Highlights</Text>
          
          <View className="bg-white border border-slate-200 rounded-3xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Ionicons name="thumbs-up" size={16} color="#10b981" />
              <Text className="text-[13px] font-black text-slate-800 ml-2">What was good? (Pros)</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {PROS_OPTIONS.map(pro => {
                const isSelected = pros.includes(pro);
                return (
                  <TouchableOpacity
                    key={pro}
                    onPress={() => togglePro(pro)}
                    className={`px-3 py-1.5 rounded-full border ${isSelected ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <Text className={`text-[11px] font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>{pro}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="bg-white border border-slate-200 rounded-3xl p-4 mb-8 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Ionicons name="thumbs-down" size={16} color="#ef4444" />
              <Text className="text-[13px] font-black text-slate-800 ml-2">What was bad? (Cons)</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {CONS_OPTIONS.map(con => {
                const isSelected = cons.includes(con);
                return (
                  <TouchableOpacity
                    key={con}
                    onPress={() => toggleCon(con)}
                    className={`px-3 py-1.5 rounded-full border ${isSelected ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <Text className={`text-[11px] font-bold ${isSelected ? 'text-red-700' : 'text-slate-600'}`}>{con}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Stay Context Details */}
          <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Context of your stay</Text>
          <View className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mb-4">
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</Text>
            <TextInput
              className="w-full text-slate-900 text-sm font-bold border-b border-slate-100 pb-2 focus:border-blue-500"
              placeholder="Display Name (or leave blank to be Anonymous)"
              placeholderTextColor="#94a3b8"
              value={reviewerName}
              onChangeText={setReviewerName}
            />
          </View>
          <View className="flex-row gap-3 mb-8">
            <View className="flex-1 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Stayed Months</Text>
              <TextInput
                className="w-full text-slate-900 text-sm font-bold border-b border-slate-100 pb-2 focus:border-blue-500"
                placeholder="e.g. 8"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={stayMonths}
                onChangeText={setStayMonths}
              />
            </View>
            <View className="flex-1 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Started From</Text>
              <TextInput
                className="w-full text-slate-900 text-sm font-bold border-b border-slate-100 pb-2 focus:border-blue-500"
                placeholder="e.g. Oct 2025"
                placeholderTextColor="#94a3b8"
                value={stayStartPeriod}
                onChangeText={setStayStartPeriod}
              />
            </View>
          </View>

          {/* Detailed Written Review */}
          <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Your True Experience</Text>
          <View className="bg-white border border-slate-200 rounded-3xl p-1 mb-8 shadow-sm">
            <TextInput
              className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-slate-800 text-[13px] font-medium h-40 focus:bg-blue-50/30"
              placeholder="What was the reality of living here? Mention hygiene, safety, hidden costs, or anything a future resident should know before moving in."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
            <View className="px-4 py-3 flex-row justify-between items-center bg-white rounded-b-3xl">
              <Text className="text-[10px] font-bold text-slate-500">Minimum 10 characters required</Text>
              <Text className={`text-[10px] font-black ${comment.length >= 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {comment.length} / 500
              </Text>
            </View>
          </View>

          {/* Photo Evidence Section */}
          <View className="flex-row justify-between items-center mb-4 ml-1">
             <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Photographic Evidence</Text>
             <Text className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Optional</Text>
          </View>
          
          <View className="flex-row flex-wrap justify-between gap-y-3 mb-12">
            {(['room', 'food', 'washroom', 'building'] as const).map((cat) => {
              const hasPhoto = photos[cat];
              return (
                <View key={cat} className="w-[48%]">
                  {hasPhoto ? (
                    <View className="w-full aspect-square bg-white border border-slate-200 rounded-3xl p-1.5 relative shadow-sm">
                      <Image source={{ uri: hasPhoto }} style={{ width: '100%', height: '100%', borderRadius: 16 }} />
                      <View className="absolute bottom-3 left-3 bg-slate-900/70 px-2 py-1 rounded-md backdrop-blur-md">
                        <Text className="text-[9px] font-black text-white capitalize">{cat}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemovePhoto(cat)}
                        className="absolute top-3 right-3 bg-white/90 w-8 h-8 rounded-full items-center justify-center shadow-lg"
                      >
                        <Ionicons name="trash" size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAttachPhoto(cat)}
                      className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl justify-center items-center active:bg-slate-100"
                    >
                      <View className="bg-white w-10 h-10 rounded-full border border-slate-100 justify-center items-center shadow-sm mb-2">
                        <Ionicons name="camera" size={18} color="#3b82f6" />
                      </View>
                      <Text className="text-[11px] font-black text-slate-700 capitalize">{cat}</Text>
                      <Text className="text-[9px] font-bold text-slate-400 mt-0.5">Tap to upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          {/* Submit Action */}
          <Button
            title="Publish Verified Review"
            loading={submitting}
            onPress={onSubmitReview}
            className="mb-10 bg-blue-600 py-4 shadow-lg shadow-blue-500/30"
            textStyle="text-base"
          />
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
