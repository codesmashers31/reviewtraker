import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Svg, { Rect, G, Line, Circle, Text as SvgText } from 'react-native-svg';

import { ProfileStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { MockDb, Property, Review } from '../../../services/mockDb';
import { RootState } from '../../../store';

type Props = NativeStackScreenProps<ProfileStackParamList, 'OwnerPanel'>;

export default function OwnerPanelScreen({ navigation }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const [replyText, setReplyText] = useState<{ [reviewId: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [loading, setLoading] = useState(true);

  // Load owner properties and reviews
  const loadData = async () => {
    setLoading(true);
    const props = await MockDb.getProperties();
    const ownerProps = props.filter((p) => p.claimedBy === user?.id);
    setProperties(ownerProps);
    
    if (ownerProps.length > 0) {
      const active = selectedProperty ? ownerProps.find(p => p.id === selectedProperty.id) || ownerProps[0] : ownerProps[0];
      setSelectedProperty(active);
      
      const revs = await MockDb.getReviews();
      const activeRevs = revs.filter((r) => r.propertyId === active.id);
      setReviews(activeRevs);
    } else {
      setSelectedProperty(null);
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleSelectProperty = async (prop: Property) => {
    setSelectedProperty(prop);
    const revs = await MockDb.getReviews();
    const activeRevs = revs.filter((r) => r.propertyId === prop.id);
    setReviews(activeRevs);
    setEditingProperty(null);
  };

  const handleReplySubmit = async (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text || !text.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Reply Empty',
        text2: 'Please write a message to submit.',
        position: 'bottom',
      });
      return;
    }

    setSubmittingReply(true);
    try {
      await MockDb.addOwnerReply(reviewId, text);
      Toast.show({
        type: 'success',
        text1: 'Reply Posted',
        text2: 'Your response was added successfully.',
        position: 'bottom',
      });
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      setReplyingTo(null);
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Post',
        text2: e.message || 'Something went wrong',
        position: 'bottom',
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleStartEditing = (prop: Property) => {
    setEditingProperty(prop);
    setEditPrice(String(prop.price));
    setEditDesc(prop.description);
  };

  const handleSavePropertyDetails = async () => {
    if (!editingProperty) return;
    try {
      await MockDb.updatePropertyInfo(editingProperty.id, {
        price: Number(editPrice) || editingProperty.price,
        description: editDesc,
      });

      Toast.show({
        type: 'success',
        text1: 'Listing Updated',
        text2: 'Changes have been saved successfully.',
        position: 'bottom',
      });
      setEditingProperty(null);
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: e.message || 'Could not save changes.',
        position: 'bottom',
      });
    }
  };

  // SVG Analytics helpers
  const getAnalyticsSVG = () => {
    if (!selectedProperty) return null;
    const complaints = MockDb.getComplaintsStats(reviews);
    
    const maxVal = Math.max(complaints.food, complaints.water, complaints.safety, complaints.deposit, complaints.maintenance, 3);
    const data = [
      { label: 'Food', val: complaints.food },
      { label: 'Water', val: complaints.water },
      { label: 'Safety', val: complaints.safety },
      { label: 'Refund', val: complaints.deposit },
      { label: 'Maint', val: complaints.maintenance },
    ];

    const chartHeight = 120;
    const barWidth = 25;
    const spacing = 18;
    const startX = 30;

    return (
      <View className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6 shadow-sm">
        <Text className="text-base font-extrabold text-slate-800 mb-1">Issue Distribution</Text>
        <Text className="text-xs font-semibold text-slate-400 mb-4">Frequency of negative ratings (&lt;= 2) by category</Text>

        <View className="items-center">
          <Svg height={chartHeight + 30} width={280}>
            {/* Grid lines */}
            <Line x1={20} y1={chartHeight} x2={260} y2={chartHeight} stroke="#cbd5e1" strokeWidth={1} />
            <Line x1={20} y1={chartHeight / 2} x2={260} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth={1} />
            <Line x1={20} y1={10} x2={260} y2={10} stroke="#f1f5f9" strokeWidth={1} />

            {/* Y axis text */}
            <SvgText x={5} y={chartHeight} fill="#94a3b8" fontSize="8" fontWeight="bold">0</SvgText>
            <SvgText x={5} y={chartHeight / 2 + 3} fill="#94a3b8" fontSize="8" fontWeight="bold">{Math.round(maxVal / 2)}</SvgText>
            <SvgText x={5} y={13} fill="#94a3b8" fontSize="8" fontWeight="bold">{maxVal}</SvgText>

            {data.map((d, index) => {
              const x = startX + index * (barWidth + spacing);
              const barHeight = (d.val / maxVal) * (chartHeight - 20);
              const y = chartHeight - barHeight;

              return (
                <G key={index}>
                  {/* Bar */}
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barHeight, 4)}
                    rx={4}
                    fill={d.val > 0 ? '#ef4444' : '#e2e8f0'}
                  />
                  {/* Category label */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight + 15}
                    fill="#64748b"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {d.label}
                  </SvgText>
                  {/* Count value */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 5}
                    fill={d.val > 0 ? '#ef4444' : '#64748b'}
                    fontSize="9"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    {d.val}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>
      </View>
    );
  };

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
          <Text className="text-xl font-extrabold text-slate-800 ml-3">Owner Panel</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('MyReviews')} 
          className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg"
        >
          <Text className="text-xs font-bold text-slate-600">My Reviews</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        {loading ? (
          <Text className="text-center text-slate-400 font-semibold my-8">Loading Owner Dashboard...</Text>
        ) : properties.length === 0 ? (
          <View className="items-center py-12 px-6">
            <Ionicons name="business-outline" size={64} color="#cbd5e1" />
            <Text className="text-lg font-extrabold text-slate-800 mt-4 text-center">No Claimed Properties</Text>
            <Text className="text-sm text-slate-400 font-semibold mt-2 text-center leading-5 mb-8">
              You haven't claimed ownership of any listings. Navigate to a property details page and click "Claim Property" to get started.
            </Text>
            <Button
              title="Browse Properties"
              onPress={() => navigation.navigate('Profile')}
            />
          </View>
        ) : (
          <View>
            {/* Properties Selector List */}
            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Select Property</Text>
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
              renderItem={({ item }) => {
                const isActive = selectedProperty?.id === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectProperty(item)}
                    className={`px-4 py-3 rounded-2xl border ${
                      isActive ? 'bg-primary-500 border-primary-500' : 'bg-slate-50 border-slate-200'
                    } mr-2`}
                  >
                    <Text className={`text-xs font-extrabold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {selectedProperty && (
              <View>
                {/* Active Property Status Card */}
                <View className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6 flex-row justify-between items-center">
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Text className="text-[10px] text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-md uppercase">Claimed & Verified</Text>
                      <View className="bg-primary-500 rounded-full p-0.5">
                        <Ionicons name="checkmark" size={10} color="#ffffff" />
                      </View>
                    </View>
                    <Text className="text-lg font-extrabold text-slate-800">{selectedProperty.name}</Text>
                    <Text className="text-xs text-slate-400 font-bold mt-0.5">{selectedProperty.location}</Text>
                  </View>

                  <View className="items-center bg-white border border-slate-100 px-4 py-3.5 rounded-2xl shadow-sm">
                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Trust Score</Text>
                    <Text className="text-primary-600 text-2xl font-black mt-0.5">{selectedProperty.trustScore}</Text>
                  </View>
                </View>

                {/* SVG Analytics Section */}
                {getAnalyticsSVG()}

                {/* Edit Property Details Section */}
                <View className="bg-white border border-slate-100 rounded-3xl p-5 mb-6 shadow-sm">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-base font-extrabold text-slate-800">Manage Property Info</Text>
                    {!editingProperty ? (
                      <TouchableOpacity 
                        onPress={() => handleStartEditing(selectedProperty)}
                        className="bg-primary-50 px-3 py-1.5 rounded-lg"
                      >
                        <Text className="text-xs font-bold text-primary-600">Edit Details</Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-row gap-2">
                        <TouchableOpacity 
                          onPress={handleSavePropertyDetails}
                          className="bg-green-50 px-3 py-1.5 rounded-lg"
                        >
                          <Text className="text-xs font-bold text-green-600">Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => setEditingProperty(null)}
                          className="bg-slate-100 px-3 py-1.5 rounded-lg"
                        >
                          <Text className="text-xs font-bold text-slate-600">Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {editingProperty ? (
                    <View className="space-y-4 gap-4">
                      <Input
                        label="Monthly Rent Price (₹)"
                        value={editPrice}
                        onChangeText={setEditPrice}
                        keyboardType="numeric"
                      />
                      <View>
                        <Text className="text-slate-600 font-bold text-xs mb-2">Description</Text>
                        <TextInput
                          className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-slate-800 text-sm font-medium h-28"
                          value={editDesc}
                          onChangeText={setEditDesc}
                          multiline
                          numberOfLines={4}
                          textAlignVertical="top"
                        />
                      </View>
                    </View>
                  ) : (
                    <View className="space-y-3 gap-3">
                      <View className="flex-row justify-between items-center py-2 border-b border-slate-50">
                        <Text className="text-slate-400 text-xs font-bold">Base Pricing</Text>
                        <Text className="text-slate-800 text-sm font-black">₹{selectedProperty.price.toLocaleString('en-IN')}/month</Text>
                      </View>
                      <View className="py-2">
                        <Text className="text-slate-400 text-xs font-bold mb-1">Description</Text>
                        <Text className="text-slate-600 text-xs leading-5 font-semibold" numberOfLines={3}>
                          {selectedProperty.description}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Review Replies Management Section */}
                <View className="bg-white border border-slate-100 rounded-3xl p-5 mb-10 shadow-sm">
                  <Text className="text-base font-extrabold text-slate-800 mb-4">Resident Reviews & Responses</Text>
                  
                  {reviews.length === 0 ? (
                    <Text className="text-center text-slate-400 font-bold text-xs py-4">No reviews posted for this property yet.</Text>
                  ) : (
                    <FlatList
                      data={reviews}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View className="border-b border-slate-50 py-4">
                          <View className="flex-row justify-between items-center mb-2">
                            <View className="flex-row items-center">
                              <Text className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">
                                {item.verified ? 'Verified Resident' : 'Anonymous Resident'}
                              </Text>
                              <Text className="text-[10px] text-slate-400 font-semibold ml-2">Stayed: {item.stayDuration} mo</Text>
                            </View>
                            <View className="flex-row items-center">
                              <Ionicons name="star" size={12} color="#f59e0b" />
                              <Text className="text-slate-700 text-xs font-extrabold ml-1">{item.ratings.overall}/5</Text>
                            </View>
                          </View>

                          <Text className="text-slate-600 text-xs font-semibold leading-5 mb-3">{item.comment}</Text>

                          {/* Render Replies */}
                          {item.ownerReply ? (
                            <View className="bg-primary-50/20 border border-primary-50 rounded-2xl p-3 mb-2">
                              <Text className="text-[10px] font-bold text-primary-700 uppercase tracking-wide">Owner Response</Text>
                              <Text className="text-slate-700 text-xs font-semibold mt-1 leading-5">{item.ownerReply.comment}</Text>
                              <Text className="text-[9px] text-slate-400 font-semibold text-right mt-1">{item.ownerReply.date}</Text>
                            </View>
                          ) : (
                            replyingTo === item.id ? (
                              <View className="mt-2 bg-slate-50 p-3 rounded-2xl">
                                <TextInput
                                  className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 text-xs font-semibold h-16"
                                  placeholder="Write response message..."
                                  value={replyText[item.id] || ''}
                                  onChangeText={(txt) => setReplyText(prev => ({ ...prev, [item.id]: txt }))}
                                  multiline
                                  textAlignVertical="top"
                                />
                                <View className="flex-row justify-end space-x-2 gap-2 mt-2">
                                  <TouchableOpacity
                                    onPress={() => setReplyingTo(null)}
                                    className="bg-slate-200 px-3 py-1.5 rounded-lg"
                                  >
                                    <Text className="text-[10px] font-extrabold text-slate-600">Cancel</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => handleReplySubmit(item.id)}
                                    className="bg-primary-500 px-3 py-1.5 rounded-lg"
                                    disabled={submittingReply}
                                  >
                                    <Text className="text-[10px] font-extrabold text-white">Post Reply</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => setReplyingTo(item.id)}
                                className="flex-row items-center border border-slate-100 bg-slate-50/50 self-start px-3 py-1.5 rounded-lg active:bg-slate-100"
                              >
                                <Ionicons name="chatbubble-outline" size={12} color="#0ea5e9" />
                                <Text className="text-[10px] font-black text-primary-600 ml-1.5">Reply to Review</Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      )}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
