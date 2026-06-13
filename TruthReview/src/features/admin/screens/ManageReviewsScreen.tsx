import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import { MockDb, Review, Property } from '../../../services/mockDb';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ManageReviews'>;

export default function ManageReviewsScreen({ navigation }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const revs = await MockDb.getReviews();
    setReviews(revs);
    
    const props = await MockDb.getProperties();
    setProperties(props);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await MockDb.adminDeleteReview(id);
      Toast.show({
        type: 'success',
        text1: 'Review Deleted',
        text2: 'Flagged content was permanently removed.',
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

  const filteredReviews = reviews.filter((r) => 
    r.comment.toLowerCase().includes(searchQuery.toLowerCase()) || 
    getPropName(r.propertyId).toLowerCase().includes(searchQuery.toLowerCase())
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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Manage Reviews</Text>
      </View>

      <View className="p-5 flex-1">
        {/* Search */}
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 mb-6">
          <Ionicons name="search" size={16} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-xs font-semibold h-9"
            placeholder="Search reviews or property name..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <Text className="text-center text-slate-400 font-bold my-8">Loading review directory...</Text>
        ) : filteredReviews.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="chatbox-ellipses-outline" size={64} color="#cbd5e1" />
            <Text className="text-slate-800 font-extrabold text-base mt-4">No reviews found</Text>
            <Text className="text-slate-400 text-xs font-semibold text-center mt-1">Adjust search parameters.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredReviews}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{getPropName(item.propertyId)}</Text>
                  <View className="flex-row items-center bg-white px-2 py-0.5 rounded-md border border-slate-100">
                    <Ionicons name="star" size={10} color="#f59e0b" />
                    <Text className="text-[10px] font-black text-slate-700 ml-1">{item.ratings.overall}/5</Text>
                  </View>
                </View>

                <Text className="text-slate-700 text-xs font-semibold leading-5 mb-3">"{item.comment}"</Text>

                <View className="flex-row justify-between items-center mt-1 pt-3 border-t border-slate-100/50">
                  <View>
                    <Text className="text-[10px] text-slate-400 font-bold">Stayed: {item.stayDuration} months</Text>
                    <Text className="text-[9px] text-slate-400 font-semibold mt-0.5">Author ID: {item.reviewerId}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    className="bg-red-50 px-3 py-1.5 rounded-lg active:bg-red-100"
                  >
                    <Text className="text-[10px] font-black text-red-600">Delete Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
