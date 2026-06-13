import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../../navigation/types';
import { MockDb, UserReport, Review, Property } from '../../../services/mockDb';
import Button from '../../../components/Button';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ManageReports'>;

export default function ManageReportsScreen({ navigation }: Props) {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const rpts = await MockDb.getReports();
    setReports(rpts.filter((r) => r.status === 'pending'));

    const revs = await MockDb.getReviews();
    setReviews(revs);

    const props = await MockDb.getProperties();
    setProperties(props);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await MockDb.adminDeleteReview(reviewId);
      Toast.show({
        type: 'success',
        text1: 'Review Deleted',
        text2: 'The flagged review was permanently removed.',
        position: 'bottom',
      });
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Could not delete review',
        position: 'bottom',
      });
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await MockDb.adminResolveReport(reportId);
      Toast.show({
        type: 'success',
        text1: 'Report Dismissed',
        text2: 'The report was resolved without changes.',
        position: 'bottom',
      });
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Action failed',
        position: 'bottom',
      });
    }
  };

  const getReviewText = (id: string) => {
    const rev = reviews.find((r) => r.id === id);
    return rev ? `"${rev.comment}"` : 'Review has already been deleted.';
  };

  const getReviewProperty = (id: string) => {
    const rev = reviews.find((r) => r.id === id);
    if (!rev) return 'Unknown Property';
    return properties.find((p) => p.id === rev.propertyId)?.name || 'Unknown Property';
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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Manage Reports</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <Text className="text-2xl font-black text-slate-800 mb-2">Content Moderation</Text>
        <Text className="text-slate-400 font-semibold text-xs leading-5 mb-6">
          Moderate review comments reported by users. Verify if they violate guidelines (fake reviews, abusive statements, wrong information, spam).
        </Text>

        {loading ? (
          <Text className="text-center text-slate-400 font-bold my-8">Loading moderation reports...</Text>
        ) : reports.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="checkmark-circle-outline" size={64} color="#cbd5e1" />
            <Text className="text-slate-800 font-extrabold text-base mt-4">Reports Clean</Text>
            <Text className="text-slate-400 text-xs font-semibold text-center mt-2 leading-5">
              All flagged items have been handled.
            </Text>
          </View>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const reviewExists = reviews.some((r) => r.id === item.reviewId);
              return (
                <View className="bg-slate-50 border border-slate-150 rounded-3xl p-5 mb-4 shadow-sm">
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="bg-red-50 border border-red-100/50 px-3 py-1 rounded-xl">
                      <Text className="text-red-700 text-[10px] font-black uppercase tracking-wider">{item.type}</Text>
                    </View>
                    <Text className="text-slate-400 text-[10px] font-semibold">{item.date}</Text>
                  </View>

                  {/* Flagged Review detail */}
                  <Text className="text-slate-800 font-black text-xs uppercase tracking-wide mb-1">Flagged Review on Property</Text>
                  <Text className="text-slate-700 font-extrabold text-sm mb-2">{getReviewProperty(item.reviewId)}</Text>

                  <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-4">
                    <Text className="text-slate-500 text-xs font-semibold leading-5 italic">{getReviewText(item.reviewId)}</Text>
                  </View>

                  {/* Report Comment */}
                  <View className="mb-4">
                    <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Reporter Complaint Reason</Text>
                    <Text className="text-slate-700 text-xs font-bold leading-5">"{item.comment}"</Text>
                  </View>

                  {/* Actions */}
                  <View className="flex-row gap-2 mt-2">
                    <View className="flex-grow flex-shrink flex-1">
                      <Button
                        title="Dismiss"
                        variant="outline"
                        onPress={() => handleDismissReport(item.id)}
                      />
                    </View>
                    {reviewExists && (
                      <View className="flex-grow flex-shrink flex-1">
                        <Button
                          title="Delete Review"
                          variant="danger"
                          onPress={() => handleDeleteReview(item.reviewId)}
                        />
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
