import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
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
  const { pgId } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [stayMonths, setStayMonths] = useState('8');
  const [stayStartPeriod, setStayStartPeriod] = useState('October 2025');

  // 9 Rating Dimensions State
  const [ratings, setRatings] = useState({
    food: 4,
    cleanliness: 4,
    water: 4,
    internet: 4,
    safety: 4,
    management: 4,
    deposit: 4,
    maintenance: 4,
    overall: 4,
  });

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
      text2: `Simulated upload for ${category} photo completed.`,
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
    if (comment.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Review too short',
        text2: 'Please write a review comment of at least 10 characters.',
        position: 'bottom',
      });
      return;
    }

    setSubmitting(true);
    try {
      await MockDb.addReview({
        propertyId: pgId,
        reviewerId: user?.id || 'guest_user',
        ratings,
        comment,
        photos,
        stayDuration: Number(stayMonths) || 1,
        stayStartDate: stayStartPeriod,
      });

      Toast.show({
        type: 'success',
        text1: 'Review Posted',
        text2: 'Thank you! Your anonymous review is now live.',
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

  const renderStarSelector = (label: string, key: keyof typeof ratings) => {
    const value = ratings[key];
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingChange(key, i)}
          className="mx-0.5 active:scale-95"
        >
          <Ionicons
            name={i <= value ? 'star' : 'star-outline'}
            size={18}
            color={i <= value ? '#f59e0b' : '#cbd5e1'}
          />
        </TouchableOpacity>
      );
    }
    return (
      <View className="flex-row justify-between items-center py-2.5 border-b border-slate-50">
        <Text className="text-slate-700 text-xs font-bold">{label}</Text>
        <View className="flex-row items-center">
          <View className="flex-row mr-2">{stars}</View>
          <View className="bg-slate-100/60 px-1.5 py-0.5 rounded">
            <Text className="text-[10px] font-black text-slate-600">{value}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-slate-50">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
        >
          <Ionicons name="close" size={20} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Write Resident Review</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        
        {/* Privacy Note */}
        <View className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 mb-6">
          <View className="flex-row items-center mb-1">
            <Ionicons name="shield-checkmark" size={16} color="#0ea5e9" />
            <Text className="text-xs font-extrabold text-slate-700 ml-1.5">Your Privacy is Protected</Text>
          </View>
          <Text className="text-[10px] text-slate-400 font-semibold leading-5 mt-1">
            We mask all reviewer identities. The public will never see your Name, Email, or Address. Your review will only show "Verified Resident" or "Resident" along with your length of stay.
          </Text>
        </View>

        {/* Stay parameters */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Stay Details</Text>
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1">
            <Input
              label="Stay Duration (Months)"
              placeholder="e.g. 8"
              keyboardType="numeric"
              value={stayMonths}
              onChangeText={setStayMonths}
            />
          </View>
          <View className="flex-1">
            <Input
              label="Stay Start Period"
              placeholder="e.g. October 2025"
              value={stayStartPeriod}
              onChangeText={setStayStartPeriod}
            />
          </View>
        </View>

        {/* 9 Dimensions Rating Grid */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Ratings Matrix</Text>
        <View className="bg-slate-50/50 border border-slate-100 rounded-3xl p-4.5 mb-6">
          {renderStarSelector('Overall Experience', 'overall')}
          {renderStarSelector('Food Quality', 'food')}
          {renderStarSelector('Cleanliness & Hygiene', 'cleanliness')}
          {renderStarSelector('Water Availability', 'water')}
          {renderStarSelector('Internet Quality', 'internet')}
          {renderStarSelector('Safety & Security', 'safety')}
          {renderStarSelector('Management Behaviour', 'management')}
          {renderStarSelector('Deposit Refund Speed', 'deposit')}
          {renderStarSelector('Maintenance Services', 'maintenance')}
        </View>

        {/* Review Comments */}
        <View className="mb-6">
          <Text className="text-slate-600 font-bold text-xs mb-2">Write detailed review comment (min 10 chars)</Text>
          <TextInput
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl text-slate-800 text-xs font-medium h-36"
            placeholder="Share your real experience. How was the hygiene, safety, food quality, behavior of owner/warden, refund of deposit, and Wi-Fi speeds?"
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
          <Text className="text-right text-slate-400 text-[10px] font-semibold mt-1">
            {comment.length} characters (minimum 10)
          </Text>
        </View>

        {/* Image Attachment Categories */}
        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Attach Photos</Text>
        <View className="space-y-3 gap-3 mb-8">
          {(['room', 'food', 'washroom', 'building'] as const).map((cat) => {
            const hasPhoto = photos[cat];
            return (
              <View key={cat} className="flex-row justify-between items-center bg-slate-50 border border-slate-150 p-3.5 rounded-2xl">
                <View className="flex-row items-center">
                  <View className="h-10 w-10 bg-slate-200 rounded-xl overflow-hidden justify-center items-center">
                    {hasPhoto ? (
                      <Image source={{ uri: hasPhoto }} className="h-full w-full" />
                    ) : (
                      <Ionicons name="image-outline" size={18} color="#94a3b8" />
                    )}
                  </View>
                  <Text className="text-slate-700 text-xs font-extrabold capitalize ml-3">{cat} Photo</Text>
                </View>

                {hasPhoto ? (
                  <TouchableOpacity
                    onPress={() => handleRemovePhoto(cat)}
                    className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg"
                  >
                    <Text className="text-[10px] font-black text-red-600 uppercase">Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleAttachPhoto(cat)}
                    className="bg-slate-200 px-3 py-1.5 rounded-lg active:bg-slate-350"
                  >
                    <Text className="text-[10px] font-black text-slate-700 uppercase">Attach</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Submit */}
        <Button
          title="Submit Verified Review"
          loading={submitting}
          onPress={onSubmitReview}
          className="mb-12"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
