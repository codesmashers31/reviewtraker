import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { Review, MockDb } from '../services/mockDb';

interface ReviewCardProps {
  review: Review;
  currentUserRole?: string;
  currentUserId?: string;
}

export default function ReviewCard({ review, currentUserRole, currentUserId }: ReviewCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [reportType, setReportType] = useState<'Fake Review' | 'Abusive Content' | 'Spam' | 'Wrong Property Information'>('Fake Review');

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={12}
          color="#F59E0B"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const handleReport = async () => {
    if (!reportComment.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Comment Required',
        text2: 'Please write a brief reason for flagging this review.',
        position: 'bottom',
      });
      return;
    }

    try {
      await MockDb.submitReport({
        userId: currentUserId || 'anonymous_flag',
        reviewId: review.id,
        type: reportType,
        comment: reportComment,
      });

      Toast.show({
        type: 'success',
        text1: 'Review Reported',
        text2: 'Content flagged for admin moderation.',
        position: 'bottom',
      });

      setFlagging(false);
      setReportComment('');
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: e.message || 'Could not submit report.',
        position: 'bottom',
      });
    }
  };

  return (
    <View className="bg-card p-5 rounded-4xl mb-6 shadow-premium border border-borderSubtle">
      {/* Reviewer Anonymized Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons
            name={review.verified ? 'shield-checkmark' : 'person-circle-outline'}
            size={20}
            color={review.verified ? '#2563EB' : '#94a3b8'}
          />
          <View className="ml-2.5">
            <Text className={`text-xs font-black ${review.verified ? 'text-primary-500' : 'text-text'}`}>
              {review.verified ? 'Verified Resident' : 'Resident'}
            </Text>
            <Text className="text-[9px] text-textMuted font-bold mt-0.5">
              Stayed: {review.stayDuration} Months • Started {review.stayStartDate}
            </Text>
          </View>
        </View>

        <Text className="text-textMuted text-[10px] font-semibold">{review.date}</Text>
      </View>

      {/* Overall Score stars & Flag Button */}
      <View className="flex-row justify-between items-center bg-surface px-4 py-3 rounded-2xl border border-borderSubtle mb-4">
        <View className="flex-row items-center">
          <View className="flex-row mr-2">{renderStars(review.ratings.overall)}</View>
          <Text className="text-[10px] font-black text-textBody">Overall: {review.ratings.overall}/5</Text>
        </View>

        <View className="flex-row items-center space-x-2 gap-2">
          <TouchableOpacity 
            onPress={() => setShowDetails(!showDetails)}
            className="bg-card px-2.5 py-1 rounded-lg border border-borderSubtle"
          >
            <Text className="text-[9px] font-black text-accent-500 uppercase">
              {showDetails ? 'Hide Details' : 'View Scores'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFlagging(!flagging)} className="p-1">
            <Ionicons name="flag-outline" size={12} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Flag / Report Section */}
      {flagging && (
        <View className="bg-red-950/20 border border-red-900/35 p-3 rounded-2xl mb-3">
          <Text className="text-[10px] font-black text-red-400 uppercase mb-2">Report Flagged Review</Text>
          
          <View className="flex-row gap-1.5 mb-2">
            {(['Fake Review', 'Spam', 'Abusive Content'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setReportType(t)}
                className={`px-2 py-1.5 rounded-lg border flex-1 ${
                  reportType === t ? 'bg-red-700 border-red-700' : 'bg-surface border-borderSubtle'
                }`}
              >
                <Text className={`text-[8px] font-black text-center ${reportType === t ? 'text-white' : 'text-textMuted'}`}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className="bg-surface border border-borderSubtle rounded-xl px-2.5 py-1 text-text text-[10px] font-semibold h-10 mb-2"
            placeholder="Explain why you are flagging..."
            placeholderTextColor="#94A3B8"
            value={reportComment}
            onChangeText={reportComment => setReportComment(reportComment)}
          />
          <View className="flex-row justify-end space-x-2 gap-2">
            <TouchableOpacity onPress={() => setFlagging(false)} className="bg-surface px-3 py-1 rounded border border-borderSubtle">
              <Text className="text-[9px] font-bold text-textMuted">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReport} className="bg-red-700 px-3 py-1 rounded">
              <Text className="text-[9px] font-bold text-white">Submit Flag</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Detailed Category ratings breakdown */}
      {showDetails && (
        <View className="flex-row flex-wrap gap-2 mb-3 bg-surface p-2.5 rounded-2xl border border-borderSubtle">
          {[
            { l: 'Food', v: review.ratings.food },
            { l: 'Clean', v: review.ratings.cleanliness },
            { l: 'Water', v: review.ratings.water },
            { l: 'Wi-Fi', v: review.ratings.internet },
            { l: 'Safety', v: review.ratings.safety },
            { l: 'Staff', v: review.ratings.management },
            { l: 'Refund', v: review.ratings.deposit },
            { l: 'Maint', v: review.ratings.maintenance },
          ].map((c) => (
            <View key={c.l} className="flex-row items-center bg-card px-2 py-1 rounded-md min-w-[22%] border border-borderSubtle">
              <Text className="text-textMuted text-[9px] font-bold uppercase">{c.l}:</Text>
              <Text className={`text-[10px] font-black ml-1 ${c.v <= 2 ? 'text-red-400' : 'text-text'}`}>{c.v}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Review Comment Text */}
      <Text className="text-textBody text-xs font-semibold leading-5 mb-3 px-0.5">
        {review.comment}
      </Text>

      {/* Review attached photos */}
      {Object.keys(review.photos).length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-2">
          {Object.entries(review.photos).map(([key, uri]) => {
            if (!uri) return null;
            return (
              <View key={key} className="mr-2 relative rounded-xl overflow-hidden bg-surface border border-borderSubtle">
                <Image source={{ uri }} className="h-20 w-28" resizeMode="cover" />
                <View className="absolute bottom-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded-md">
                  <Text className="text-[7px] text-white font-extrabold uppercase">{key}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Admin specific identifier check */}
      {currentUserRole === 'admin' && (
        <View className="bg-surface border border-borderSubtle p-2.5 rounded-2xl mt-2 mb-1">
          <Text className="text-[9px] font-black text-red-400 uppercase">🛡️ Admin Inspector View</Text>
          <Text className="text-textMuted text-[9px] font-bold mt-0.5">Reviewer user ID: {review.reviewerId}</Text>
        </View>
      )}

      {/* Owner response reply */}
      {review.ownerReply && (
        <View className="bg-surface border border-borderSubtle rounded-2xl p-3.5 mt-2.5">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-accent-500 text-[10px] font-black uppercase tracking-wider">Owner Response</Text>
            <Text className="text-textMuted text-[8px] font-semibold">{review.ownerReply.date}</Text>
          </View>
          <Text className="text-textBody text-xs font-semibold leading-5">"{review.ownerReply.comment}"</Text>
        </View>
      )}
    </View>
  );
}
