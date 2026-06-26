import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../../navigation/types';
import { MockDb, VerificationRequest, Property, Review } from '../../../services/mockDb';
import Button from '../../../components/Button';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ManageVerifications'>;

export default function ManageVerificationsScreen({ navigation }: Props) {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const veris = await MockDb.getVerifications();
    setRequests(veris.filter((v) => v.status === 'pending'));

    const props = await MockDb.getProperties();
    setProperties(props);

    const revs = await MockDb.getReviews();
    setReviews(revs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await MockDb.adminApproveVerification(id);
      Toast.show({
        type: 'success',
        text1: 'Verification Approved',
        text2: 'Residency verified! Badge granted.',
        position: 'bottom',
      });
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Could not approve request',
        position: 'bottom',
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await MockDb.adminRejectVerification(id);
      Toast.show({
        type: 'success',
        text1: 'Verification Rejected',
        text2: 'Request declined.',
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

  const getPropName = (id: string) => {
    return properties.find((p) => p.id === id)?.name || 'Unknown Property';
  };

  const getReviewComment = (id: string) => {
    return reviews.find((r) => r.id === id)?.comment || 'Review comment not found.';
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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Manage Verifications</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <Text className="text-2xl font-black text-slate-800 mb-2">Residency Requests</Text>
        <Text className="text-slate-400 font-semibold text-xs leading-5 mb-6">
          Approve or decline user residency proof submissions. Approving automatically attaches a verified resident badge to their review and increases the property trust score.
        </Text>

        {loading ? (
          <Text className="text-center text-slate-400 font-bold my-8">Loading verification queue...</Text>
        ) : requests.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="shield-checkmark-outline" size={64} color="#cbd5e1" />
            <Text className="text-slate-800 font-extrabold text-base mt-4">Queue Clear</Text>
            <Text className="text-slate-400 text-xs font-semibold text-center mt-2 leading-5">
              All residency verification requests have been handled.
            </Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="bg-slate-50 border border-slate-150 rounded-3xl p-5 mb-4 shadow-sm">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="bg-primary-50 px-3 py-1 rounded-xl">
                    <Text className="text-primary-700 text-[10px] font-black uppercase tracking-wider">{item.documentType}</Text>
                  </View>
                  <Text className="text-slate-400 text-[10px] font-semibold">{item.date}</Text>
                </View>

                {/* Property & Review Preview */}
                <Text className="text-slate-800 font-extrabold text-sm mb-1">{getPropName(item.propertyId)}</Text>
                <Text className="text-slate-500 text-xs font-bold mb-3">Stayed: {item.stayDuration} months</Text>

                <View className="bg-white border border-slate-100 rounded-xl p-3 mb-4">
                  <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Attached Review</Text>
                  <Text className="text-slate-600 text-xs font-semibold leading-5" numberOfLines={2}>{getReviewComment(item.reviewId)}</Text>
                </View>

                {/* Uploaded proof image */}
                <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Uploaded Document Proof</Text>
                <Image source={{ uri: item.documentUri }} style={{ height: 160, width: '100%', borderRadius: 16, marginBottom: 16, backgroundColor: '#e2e8f0' }} resizeMode="cover" />

                {/* Action buttons */}
                <View className="flex-row gap-2 mt-2">
                  <View className="flex-1">
                    <Button
                      title="Decline"
                      variant="outline"
                      onPress={() => handleReject(item.id)}
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      title="Approve stay"
                      onPress={() => handleApprove(item.id)}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
