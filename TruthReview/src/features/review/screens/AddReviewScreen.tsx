import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { HomeStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import { mockReviews, ReviewItem } from '../../../utils/mockReviews';
import { RootState } from '../../../store';

const reviewSchema = zod.object({
  rating: zod.number().min(1, 'Please select a rating of at least 1 star').max(5),
  comment: zod
    .string()
    .min(10, 'Your review description must be at least 10 characters')
    .max(500, 'Keep review text under 500 characters'),
});

type FormData = zod.infer<typeof reviewSchema>;
type Props = NativeStackScreenProps<HomeStackParamList, 'AddReview'>;

export default function AddReviewScreen({ route, navigation }: Props) {
  const { pgId } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const ratingValue = watch('rating');

  const onSubmitReview = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview: ReviewItem = {
        id: `rev_${Date.now()}`,
        pgId,
        userName: user?.name || 'Anonymous User',
        rating: data.rating,
        comment: data.comment,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      // Push locally into mock database for immediate UI representation
      mockReviews.unshift(newReview);

      Toast.show({
        type: 'success',
        text1: 'Review Posted',
        text2: 'Thank you for your valuable feedback!',
        position: 'bottom',
      });

      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to submit review',
        text2: error.message || 'Something went wrong.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setValue('rating', i, { shouldValidate: true })}
          className="mx-1 active:scale-90"
        >
          <Ionicons
            name={i <= ratingValue ? 'star' : 'star-outline'}
            size={36}
            color={i <= ratingValue ? '#f59e0b' : '#cbd5e1'}
          />
        </TouchableOpacity>
      );
    }
    return <View className="flex-row justify-center py-4">{stars}</View>;
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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Write a Review</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="p-5 flex-1 justify-between">
          <View>
            {/* Rating Star Section */}
            <View className="items-center mt-6 mb-8">
              <Text className="text-base font-extrabold text-slate-800 mb-1">
                How was your experience?
              </Text>
              <Text className="text-xs font-semibold text-slate-400">
                Tap on stars to select your rating score
              </Text>

              {renderStarSelector()}

              {errors.rating && (
                <Text className="text-red-500 text-xs font-bold mt-1">
                  {errors.rating.message}
                </Text>
              )}
            </View>

            {/* Comment Section */}
            <View className="mb-6">
              <Text className="text-slate-600 font-semibold text-sm mb-2">
                Write your review
              </Text>
              <Controller
                control={control}
                name="comment"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="w-full">
                    <TextInput
                      className={`w-full bg-slate-50 border ${
                        errors.comment
                          ? 'border-red-500 bg-red-50/10'
                          : 'border-slate-200 focus:border-primary-500'
                      } px-4 py-3.5 rounded-2xl text-slate-800 text-sm font-medium h-40`}
                      placeholder="Share details about the cleanliness, food quality, owner behavior, safety, water supply..."
                      placeholderTextColor="#94a3b8"
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    <Text className="text-right text-slate-400 text-xs font-semibold mt-1">
                      {value.length}/500
                    </Text>
                  </View>
                )}
              />
              {errors.comment && (
                <Text className="text-red-500 text-xs font-bold mt-1">
                  {errors.comment.message}
                </Text>
              )}
            </View>
          </View>

          <Button
            title="Submit Review"
            loading={submitting}
            onPress={handleSubmit(onSubmitReview)}
            className="mb-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
