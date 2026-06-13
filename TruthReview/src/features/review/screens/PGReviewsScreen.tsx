import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../../../navigation/types';
import { mockPGs } from '../../../utils/mockData';
import { mockReviews, ReviewItem } from '../../../utils/mockReviews';
import ReviewCard from '../../../components/ReviewCard';
import EmptyState from '../../../components/EmptyState';

type Props = NativeStackScreenProps<HomeStackParamList, 'PGReviews'>;

export default function PGReviewsScreen({ route, navigation }: Props) {
  const { pgId } = route.params;
  const pg = mockPGs.find((p) => p.id === pgId);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() =>
    mockReviews.filter((r) => r.pgId === pgId)
  );

  if (!pg) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-50">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
          >
            <Ionicons name="arrow-back" size={20} color="#475569" />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-slate-800 ml-3">Reviews</Text>
        </View>
        <Text className="text-slate-400 font-semibold text-xs truncate max-w-[150px]">{pg.name}</Text>
      </View>

      {/* Main Reviews List */}
      <FlatList
        data={reviewsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          reviewsList.length > 0 ? (
            <View className="flex-row items-center bg-sky-50/20 border border-sky-100/40 p-5 rounded-2xl mb-6">
              <View className="items-center pr-6 border-r border-slate-100">
                <Text className="text-5xl font-black text-slate-800">{pg.rating.toFixed(1)}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text className="text-slate-500 text-xs font-bold ml-1">Out of 5</Text>
                </View>
              </View>
              <View className="flex-1 pl-6">
                <Text className="text-slate-800 font-extrabold text-sm mb-0.5">Rating Summary</Text>
                <Text className="text-slate-400 font-medium text-xs leading-4">
                  All reviews are submitted by verified tenants who have stayed at this PG location.
                </Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            title="No Reviews Yet"
            description="Be the first to share your experience about this PG listing. Your feedback helps others make informed choices!"
            icon="star-outline"
          />
        }
      />

      {/* Floating Add Review CTA */}
      <View className="absolute bottom-5 left-5 right-5">
        <TouchableOpacity
          className="w-full bg-primary-500 py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary-500/20 active:opacity-90"
          onPress={() => navigation.navigate('AddReview', { pgId })}
        >
          <Ionicons name="create-outline" size={18} color="#ffffff" />
          <Text className="text-white text-base font-bold ml-2">Write a Review</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
