import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../../navigation/types';
import { MockDb, Review, Property } from '../../../services/mockDb';
import { RootState } from '../../../store';
import ReviewCard from '../../../components/ReviewCard';
import EmptyState from '../../../components/EmptyState';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyReviews'>;

export default function MyReviewsScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const revs = await MockDb.getReviews();
    setReviews(revs.filter((r) => r.reviewerId === user.id));

    const props = await MockDb.getProperties();
    setProperties(props);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused && user) {
      loadData();
    }
  }, [user, isFocused]);

  const handleDelete = async (id: string) => {
    try {
      await MockDb.adminDeleteReview(id);
      Toast.show({
        type: 'success',
        text1: 'Review Removed',
        text2: 'Your review was deleted successfully.',
        position: 'bottom',
      });
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Could not delete review.',
        position: 'bottom',
      });
    }
  };

  const getPropName = (id: string) => {
    return properties.find((p) => p.id === id)?.name || 'Unknown Property';
  };

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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-slate-400 font-bold">Loading your reviews...</Text>
        </View>
      ) : reviews.length === 0 ? (
        <View className="flex-grow justify-center items-center">
          <EmptyState
            title="No Reviews Posted"
            description="You haven't written any reviews yet. Propose reviews on properties you have stayed at to help other residents."
            icon="star-outline"
          />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="bg-white border border-slate-100 rounded-3xl p-4 mb-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-slate-800 font-black text-sm">{getPropName(item.propertyId)}</Text>
                
                {item.verified ? (
                  <View className="bg-green-50 px-2 py-0.5 rounded-md border border-green-150">
                    <Text className="text-green-700 text-[8px] font-black uppercase">Verified stay</Text>
                  </View>
                ) : (
                  <View className="bg-amber-50 px-2 py-0.5 rounded-md border border-amber-150">
                    <Text className="text-amber-700 text-[8px] font-black uppercase">Pending Stay Verify</Text>
                  </View>
                )}
              </View>

              {/* Review Card */}
              <ReviewCard review={item} />

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="bg-red-50 py-2.5 rounded-2xl items-center mt-2 border border-red-100 active:bg-red-100"
              >
                <Text className="text-red-600 text-xs font-bold">Delete Review</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
