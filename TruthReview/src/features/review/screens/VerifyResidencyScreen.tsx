import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { HomeStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { MockDb, Property, Review } from '../../../services/mockDb';
import { RootState } from '../../../store';

type Props = NativeStackScreenProps<HomeStackParamList, 'VerifyResidency'>;

export default function VerifyResidencyScreen({ route, navigation }: Props) {
  const { pgId } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [property, setProperty] = useState<Property | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<string>('');
  
  const [docType, setDocType] = useState<'Rent Receipt' | 'Hostel ID' | 'Utility Bill' | 'Room Photograph' | 'Booking Confirmation'>('Rent Receipt');
  const [stayMonths, setStayMonths] = useState('8');
  const [attachedUri, setAttachedUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      const props = await MockDb.getProperties();
      const p = props.find((x) => x.id === pgId);
      if (p) setProperty(p);

      const reviews = await MockDb.getReviews();
      // Find reviews written by this user for this property
      const filtered = reviews.filter((r) => r.propertyId === pgId && r.reviewerId === user?.id);
      setUserReviews(filtered);
      if (filtered.length > 0) {
        setSelectedReviewId(filtered[0].id);
      }
    };
    loadDetails();
  }, [pgId, user?.id]);

  const handleAttachDocument = () => {
    // Simulate picking a file
    const docPlaceholders = [
      'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    ];
    const picked = docPlaceholders[Math.floor(Math.random() * docPlaceholders.length)];
    setAttachedUri(picked);
    Toast.show({
      type: 'success',
      text1: 'Document Attached',
      text2: 'Proof file loaded successfully!',
      position: 'bottom',
    });
  };

  const handleSubmit = async () => {
    if (!attachedUri) {
      Toast.show({
        type: 'error',
        text1: 'Attachment Required',
        text2: 'Please upload or take a photo of your residency proof.',
        position: 'bottom',
      });
      return;
    }

    if (!selectedReviewId) {
      Toast.show({
        type: 'error',
        text1: 'Review Required',
        text2: 'You must write a review for this property before submitting residency verification.',
        position: 'bottom',
      });
      return;
    }

    setSubmitting(true);
    try {
      await MockDb.submitVerification({
        userId: user?.id || 'guest',
        propertyId: pgId,
        reviewId: selectedReviewId,
        documentType: docType,
        documentUri: attachedUri,
        stayDuration: Number(stayMonths) || 1,
      });

      Toast.show({
        type: 'success',
        text1: 'Verification Submitted',
        text2: 'Our administrators will review your residency proof within 24 hours.',
        position: 'bottom',
      });

      navigation.goBack();
    } catch (e: any) {
      console.error(e);
      Toast.show({
        type: 'error',
        text1: 'Failed to Submit',
        text2: e.message || 'Something went wrong.',
        position: 'bottom',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-slate-400 font-bold">Loading Property Info...</Text>
      </SafeAreaView>
    );
  }

  const docOptions: ('Rent Receipt' | 'Hostel ID' | 'Utility Bill' | 'Room Photograph' | 'Booking Confirmation')[] = [
    'Rent Receipt',
    'Hostel ID',
    'Utility Bill',
    'Room Photograph',
    'Booking Confirmation',
  ];

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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Verify Residency</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <Text className="text-2xl font-black text-slate-800 mb-2">Get Verified badge</Text>
        <Text className="text-slate-400 font-semibold text-xs leading-5 mb-6">
          Prove your stay at <Text className="text-primary-500 font-black">{property.name}</Text> to receive a verified resident badge. Your verification document is kept strictly confidential and accessible only to administrators.
        </Text>

        {/* Check Review Written */}
        {userReviews.length === 0 ? (
          <View className="bg-red-50 border border-red-100/50 p-5 rounded-2xl mb-6 items-center">
            <Ionicons name="warning-outline" size={24} color="#ef4444" />
            <Text className="text-red-700 font-extrabold text-sm text-center mt-2">No Review Found</Text>
            <Text className="text-red-500 text-xs font-semibold text-center mt-1 mb-4 leading-5">
              You must write an accommodation review first before you can submit residency verification details.
            </Text>
            <Button
              title="Write Review First"
              onPress={() => navigation.replace('AddReview', { pgId })}
            />
          </View>
        ) : (
          <View className="bg-green-50 border border-green-100/50 p-4 rounded-2xl mb-6">
            <Text className="text-green-800 font-extrabold text-xs">✓ Active Review Linked</Text>
            <Text className="text-green-600 text-[11px] font-semibold mt-1">
              Your stay verification will be attached to your review posted on this property.
            </Text>
          </View>
        )}

        {/* Verification Method */}
        <Text className="text-slate-600 font-bold text-xs mb-3">Residency Proof Document Type</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {docOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setDocType(option)}
              className={`px-4 py-3 rounded-2xl border ${
                docType === option
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-slate-50 border-slate-200'
              } flex-grow m-0.5`}
            >
              <Text
                className={`text-xs font-bold text-center ${
                  docType === option ? 'text-white' : 'text-slate-600'
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Length of stay input */}
        <View className="mb-6">
          <Input
            label="Duration of Stay (Months)"
            placeholder="e.g. 8"
            keyboardType="numeric"
            value={stayMonths}
            onChangeText={setStayMonths}
          />
        </View>

        {/* File attachment simulator */}
        <View className="mb-8">
          <Text className="text-slate-600 font-bold text-xs mb-3">Upload Supporting Document</Text>
          
          {attachedUri ? (
            <View className="relative bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden items-center p-3">
              <Image source={{ uri: attachedUri }} className="h-44 w-full rounded-xl" resizeMode="cover" />
              <TouchableOpacity
                onPress={() => setAttachedUri(null)}
                className="absolute top-5 right-5 h-9 w-9 bg-black/60 rounded-full justify-center items-center"
              >
                <Ionicons name="trash" size={16} color="#ffffff" />
              </TouchableOpacity>
              <Text className="text-xs text-slate-400 font-semibold mt-2">Attached file: {docType.replace(/\s/g, '_').toLowerCase()}.jpg</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleAttachDocument}
              className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl py-8 items-center justify-center active:bg-slate-100"
            >
              <Ionicons name="document-attach-outline" size={32} color="#94a3b8" />
              <Text className="text-slate-700 font-extrabold text-sm mt-3">Upload proof file</Text>
              <Text className="text-slate-400 text-[10px] font-semibold mt-1">Select PNG, JPG, or PDF (Receipt, agreement copy, etc.)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Button */}
        {userReviews.length > 0 && (
          <Button
            title="Submit Verification Request"
            loading={submitting}
            onPress={handleSubmit}
            className="mb-10"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
