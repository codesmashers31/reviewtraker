import React from 'react';
import { View, Text, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReviewItem } from '../utils/mockReviews';

interface ReviewCardProps {
  review: ReviewItem;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color="#f59e0b"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <View className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl mb-4">
      {/* Header Info */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            }}
            className="h-9 w-9 rounded-full bg-slate-200"
          />
          <View className="ml-3">
            <Text className="text-slate-800 text-sm font-bold">{review.userName}</Text>
            <View className="flex-row mt-0.5">{renderStars(review.rating)}</View>
          </View>
        </View>

        <Text className="text-slate-400 text-xs font-semibold">{review.date}</Text>
      </View>

      {/* Review Content */}
      <Text className="text-slate-600 text-sm font-medium leading-5 ml-1">
        {review.comment}
      </Text>
    </View>
  );
}
