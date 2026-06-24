import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Svg, { Rect, G, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

import { ProfileStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
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

  // SVG Analytics helpers for Light Theme
  const getAnalyticsSVG = () => {
    if (!selectedProperty) return null;
    const complaints = MockDb.getComplaintsStats(reviews);

    const maxVal = Math.max(complaints.food, complaints.water, complaints.security, complaints.staff, complaints.valueForMoney, 3);
    const data = [
      { label: 'Food', val: complaints.food },
      { label: 'Water', val: complaints.water },
      { label: 'Security', val: complaints.security },
      { label: 'Staff', val: complaints.staff },
      { label: 'Value', val: complaints.valueForMoney },
    ];

    const chartHeight = 120;
    const barWidth = 25;
    const spacing = 18;
    const startX = 30;

    return (
      <View className="bg-white border border-[#e2e8f0] rounded-3xl p-5 mb-6 shadow-sm">
        <Text className="text-base font-extrabold text-[#0f172a] mb-1">Issue Distribution</Text>
        <Text className="text-[10px] font-semibold text-[#64748b] mb-5">Frequency of negative ratings (≤ 2) by category</Text>

        <View className="items-center">
          <Svg height={chartHeight + 30} width={280}>
            <Defs>
              <LinearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0" stopColor="#3b82f6" stopOpacity="0.8" />
                <Stop offset="1" stopColor="#60a5fa" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="alertGrad" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0" stopColor="#ef4444" stopOpacity="0.8" />
                <Stop offset="1" stopColor="#f87171" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            {/* Grid lines */}
            <Line x1={20} y1={chartHeight} x2={260} y2={chartHeight} stroke="#e2e8f0" strokeWidth={1} />
            <Line x1={20} y1={chartHeight / 2} x2={260} y2={chartHeight / 2} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
            <Line x1={20} y1={10} x2={260} y2={10} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />

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
                    fill={d.val > 0 ? "url(#alertGrad)" : "#f1f5f9"}
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
                    fill={d.val > 0 ? '#ef4444' : '#94a3b8'}
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
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      {/* Premium Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#e2e8f0] bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 bg-white border border-[#e2e8f0] rounded-full justify-center items-center active:bg-[#f1f5f9]"
          >
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
          </TouchableOpacity>
          <View className="ml-3">
            <Text className="text-xl font-black text-[#0f172a]">Owner Dashboard</Text>
            <Text className="text-[10px] font-bold text-[#d97706] tracking-widest uppercase">Management Console</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 pt-4">
        {loading ? (
          <Text className="text-center text-[#64748b] font-semibold my-8">Authenticating Owner Identity...</Text>
        ) : properties.length === 0 ? (
          <View className="items-center py-16 px-6 bg-white rounded-3xl border border-[#e2e8f0] mt-10 shadow-sm">
            <View className="bg-[#f1f5f9] p-4 rounded-full mb-4 border border-[#e2e8f0]">
              <Ionicons name="business-outline" size={48} color="#475569" />
            </View>
            <Text className="text-xl font-black text-[#0f172a] text-center">No Claimed Properties</Text>
            <Text className="text-xs text-[#64748b] font-semibold mt-2 text-center leading-5 mb-8">
              You haven't claimed ownership of any listings. Navigate to a property details page and click "Claim Property" to get started.
            </Text>
            <Button
              title="Browse Properties"
              onPress={() => navigation.navigate('Profile')}
              className="bg-[#3b82f6]"
            />
          </View>
        ) : (
          <View>
            {/* Properties Selector List */}
            <Text className="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-3">Portfolio Selection</Text>
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
                    className={`px-5 py-3.5 rounded-2xl border mr-3 shadow-sm ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-[#60a5fa] bg-[#3b82f6]' 
                        : 'bg-white border-[#e2e8f0]'
                    }`}
                  >
                    <Text className={`text-xs font-black ${isActive ? 'text-white' : 'text-[#475569]'}`}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {selectedProperty && (
              <View>
                {/* Active Property Status Card */}
                <View className="bg-white border border-[#e2e8f0] rounded-3xl p-5 mb-6 flex-row justify-between items-center shadow-sm">
                  <View className="flex-1 mr-4">
                    <View className="flex-row items-center gap-1.5 mb-1.5">
                      <View className="bg-[#fef3c7] border border-[#fde68a] px-2 py-0.5 rounded-md flex-row items-center">
                        <Ionicons name="shield-checkmark" size={10} color="#d97706" />
                        <Text className="text-[9px] text-[#b45309] font-black uppercase tracking-wider ml-1">Verified Owner</Text>
                      </View>
                    </View>
                    <Text className="text-xl font-black text-[#0f172a] leading-tight">{selectedProperty.name}</Text>
                    <Text className="text-xs text-[#64748b] font-bold mt-1" numberOfLines={1}>{selectedProperty.location}</Text>
                  </View>

                  <View className="items-center bg-[#f8fafc] border border-[#e2e8f0] px-4 py-3 rounded-2xl shadow-inner">
                    <Text className="text-[#64748b] text-[9px] font-black uppercase tracking-widest">Trust Score</Text>
                    <Text className="text-[#2563eb] text-3xl font-black mt-0.5">{selectedProperty.trustScore}</Text>
                  </View>
                </View>

                {/* Quick Stats Grid */}
                <View className="flex-row gap-3 mb-6">
                  <View className="flex-1 bg-white border border-[#e2e8f0] p-4 rounded-3xl items-center shadow-sm">
                    <Ionicons name="star" size={20} color="#d97706" />
                    <Text className="text-2xl font-black text-[#0f172a] mt-2">
                      {(reviews.reduce((acc, r) => acc + r.ratings.overall, 0) / (reviews.length || 1)).toFixed(1)}
                    </Text>
                    <Text className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider mt-1">Avg Rating</Text>
                  </View>
                  <View className="flex-1 bg-white border border-[#e2e8f0] p-4 rounded-3xl items-center shadow-sm">
                    <Ionicons name="chatbubbles" size={20} color="#3b82f6" />
                    <Text className="text-2xl font-black text-[#0f172a] mt-2">{reviews.length}</Text>
                    <Text className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider mt-1">Total Reviews</Text>
                  </View>
                </View>

                {/* SVG Analytics Section */}
                {getAnalyticsSVG()}

                {/* Edit Property Details Section */}
                <View className="bg-white border border-[#e2e8f0] rounded-3xl p-5 mb-6 shadow-sm">
                  <View className="flex-row justify-between items-center mb-5 border-b border-[#e2e8f0] pb-3">
                    <Text className="text-base font-extrabold text-[#0f172a]">Listing Details</Text>
                    {!editingProperty ? (
                      <TouchableOpacity
                        onPress={() => handleStartEditing(selectedProperty)}
                        className="bg-[#eff6ff] border border-[#bfdbfe] px-3 py-1.5 rounded-lg flex-row items-center active:bg-[#dbeafe]"
                      >
                        <Ionicons name="pencil" size={12} color="#2563eb" />
                        <Text className="text-[11px] font-black text-[#2563eb] ml-1.5">Edit Info</Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={handleSavePropertyDetails}
                          className="bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-1.5 rounded-lg flex-row items-center active:bg-[#d1fae5]"
                        >
                          <Ionicons name="checkmark" size={12} color="#059669" />
                          <Text className="text-[11px] font-black text-[#059669] ml-1.5">Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setEditingProperty(null)}
                          className="bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-1.5 rounded-lg active:bg-[#e2e8f0]"
                        >
                          <Text className="text-[11px] font-black text-[#475569]">Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {editingProperty ? (
                    <View className="space-y-4 gap-4">
                      <View>
                        <Text className="text-[#64748b] font-black text-[10px] uppercase tracking-wider mb-2 ml-1">Monthly Rent (₹)</Text>
                        <TextInput
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] px-4 py-3.5 rounded-2xl text-[#0f172a] text-sm font-semibold focus:border-[#3b82f6]"
                          value={editPrice}
                          onChangeText={setEditPrice}
                          keyboardType="numeric"
                          placeholderTextColor="#94a3b8"
                        />
                      </View>
                      <View>
                        <Text className="text-[#64748b] font-black text-[10px] uppercase tracking-wider mb-2 ml-1">Property Description</Text>
                        <TextInput
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] px-4 py-3.5 rounded-2xl text-[#0f172a] text-sm font-medium h-32 focus:border-[#3b82f6]"
                          value={editDesc}
                          onChangeText={setEditDesc}
                          multiline
                          numberOfLines={5}
                          textAlignVertical="top"
                          placeholderTextColor="#94a3b8"
                        />
                      </View>
                    </View>
                  ) : (
                    <View className="space-y-4 gap-4">
                      <View className="flex-row justify-between items-center bg-[#f8fafc] px-4 py-3 rounded-2xl border border-[#e2e8f0]">
                        <Text className="text-[#64748b] text-[11px] font-black uppercase tracking-wider">Base Pricing</Text>
                        <Text className="text-[#0f172a] text-sm font-black">₹{selectedProperty.price.toLocaleString('en-IN')}<Text className="text-[#64748b] text-[10px]"> /mo</Text></Text>
                      </View>
                      <View className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
                        <Text className="text-[#64748b] text-[11px] font-black uppercase tracking-wider mb-2">Description</Text>
                        <Text className="text-[#334155] text-xs leading-5 font-medium" numberOfLines={4}>
                          {selectedProperty.description}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Review Replies Management Section */}
                <View className="bg-white border border-[#e2e8f0] rounded-3xl p-5 mb-10 shadow-sm">
                  <Text className="text-base font-extrabold text-[#0f172a] mb-1">Resident Feedback</Text>
                  <Text className="text-[#64748b] text-[10px] font-bold mb-5">Engage with your verified residents</Text>

                  {reviews.length === 0 ? (
                    <Text className="text-center text-[#64748b] font-bold text-xs py-6 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">No reviews posted yet.</Text>
                  ) : (
                    <FlatList
                      data={reviews}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View className="bg-[#f8fafc] rounded-2xl p-4 mb-3 border border-[#e2e8f0]">
                          <View className="flex-row justify-between items-start mb-3 border-b border-[#e2e8f0] pb-3">
                            <View>
                              <View className="flex-row items-center mb-1">
                                {item.verified && <Ionicons name="checkmark-circle" size={12} color="#10b981" className="mr-1" />}
                                <Text className={`text-xs font-black ${item.verified ? 'text-[#059669]' : 'text-[#64748b]'}`}>
                                  {item.verified ? 'Verified Resident' : 'Anonymous'}
                                </Text>
                              </View>
                              <Text className="text-[9px] text-[#64748b] font-bold uppercase tracking-wider">Stayed: {item.stayDuration} mo</Text>
                            </View>
                            <View className="bg-white px-2 py-1 rounded-lg border border-[#e2e8f0] flex-row items-center shadow-sm">
                              <Ionicons name="star" size={10} color="#fbbf24" />
                              <Text className="text-[#0f172a] text-xs font-black ml-1">{item.ratings.overall}<Text className="text-[#64748b] text-[10px]">/5</Text></Text>
                            </View>
                          </View>

                          <Text className="text-[#334155] text-xs font-medium leading-5 mb-4">{item.comment}</Text>

                          {/* Render Replies */}
                          {item.ownerReply ? (
                            <View className="bg-[#eff6ff] border-l-4 border-[#3b82f6] rounded-r-xl p-3.5">
                              <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest">Your Response</Text>
                                <Text className="text-[8px] text-[#64748b] font-bold">{item.ownerReply.date}</Text>
                              </View>
                              <Text className="text-[#1e293b] text-xs font-medium leading-5">{item.ownerReply.comment}</Text>
                            </View>
                          ) : (
                            replyingTo === item.id ? (
                              <View className="mt-2 bg-white p-3 rounded-2xl border border-[#bfdbfe]">
                                <TextInput
                                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] px-3 py-3 rounded-xl text-[#0f172a] text-xs font-medium h-20 focus:border-[#3b82f6]"
                                  placeholder="Write response message..."
                                  placeholderTextColor="#64748b"
                                  value={replyText[item.id] || ''}
                                  onChangeText={(txt) => setReplyText(prev => ({ ...prev, [item.id]: txt }))}
                                  multiline
                                  textAlignVertical="top"
                                />
                                <View className="flex-row justify-end space-x-2 gap-2 mt-3">
                                  <TouchableOpacity
                                    onPress={() => setReplyingTo(null)}
                                    className="bg-[#f1f5f9] border border-[#cbd5e1] px-4 py-2 rounded-lg active:bg-[#e2e8f0]"
                                  >
                                    <Text className="text-[10px] font-black text-[#475569]">Cancel</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => handleReplySubmit(item.id)}
                                    className="bg-[#3b82f6] px-4 py-2 rounded-lg flex-row items-center"
                                    disabled={submittingReply}
                                  >
                                    <Text className="text-[10px] font-black text-white mr-1.5">Post Reply</Text>
                                    <Ionicons name="paper-plane" size={10} color="white" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => setReplyingTo(item.id)}
                                className="flex-row items-center border border-[#cbd5e1] bg-white self-start px-3 py-2 rounded-lg active:bg-[#f1f5f9] shadow-sm"
                              >
                                <Ionicons name="chatbubble-ellipses" size={12} color="#2563eb" />
                                <Text className="text-[10px] font-black text-[#2563eb] ml-1.5">Reply to Review</Text>
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
