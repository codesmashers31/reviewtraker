import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../navigation/types';
import { mockReviews, ReviewItem } from '../../../utils/mockReviews';
import { RootState } from '../../../store';
import ReviewCard from '../../../components/ReviewCard';
import EmptyState from '../../../components/EmptyState';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyReviews'>;

export default function MyReviewsScreen({ navigation }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  // Filter reviews by the current user's name
  const [myReviews, setMyReviews] = useState<ReviewItem[]>(() =>
    mockReviews.filter((r) => r.userName === user?.name)
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-slate-50">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full justify-center items-center active:bg-slate-100"
        >
          <Ionicons name="arrow-back" size={20} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800 ml-3">My Reviews</Text>
      </View>

      <FlatList
        data={myReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No Reviews Found"
            description="You haven't posted any reviews yet. Browse PGs and submit reviews to see them here!"
            icon="star-outline"
          />
        }
      />
    </SafeAreaView>
  );
}
