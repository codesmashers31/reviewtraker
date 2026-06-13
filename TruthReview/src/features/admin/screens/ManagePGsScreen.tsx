import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import { MockDb, ClaimRequest, Property } from '../../../services/mockDb';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ManagePGs'>;

export default function ManagePGsScreen({ navigation }: Props) {
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Merge Properties States
  const [primaryPropId, setPrimaryPropId] = useState('');
  const [duplicatePropId, setDuplicatePropId] = useState('');
  const [merging, setMerging] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const clms = await MockDb.getClaims();
    setClaims(clms.filter((c) => c.status === 'pending'));

    const props = await MockDb.getProperties();
    setProperties(props);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveClaim = async (id: string) => {
    try {
      await MockDb.adminApproveClaim(id);
      Toast.show({
        type: 'success',
        text1: 'Claim Approved',
        text2: 'Owner verification completed.',
        position: 'bottom',
      });
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Could not approve claim.',
        position: 'bottom',
      });
    }
  };

  const handleRejectClaim = async (id: string) => {
    try {
      await MockDb.adminRejectClaim(id);
      Toast.show({
        type: 'success',
        text1: 'Claim Declined',
        text2: 'Verification rejected.',
        position: 'bottom',
      });
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Could not decline claim.',
        position: 'bottom',
      });
    }
  };

  const handleMerge = async () => {
    if (!primaryPropId || !duplicatePropId) {
      Toast.show({
        type: 'error',
        text1: 'Selection Missing',
        text2: 'Please select both primary and duplicate properties to merge.',
        position: 'bottom',
      });
      return;
    }

    if (primaryPropId === duplicatePropId) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Selection',
        text2: 'Primary and duplicate properties cannot be the same.',
        position: 'bottom',
      });
      return;
    }

    setMerging(true);
    try {
      await MockDb.mergeDuplicateProperties(primaryPropId, duplicatePropId);
      Toast.show({
        type: 'success',
        text1: 'Properties Merged',
        text2: 'Duplicate removed. Reviews transferred to primary property.',
        position: 'bottom',
      });
      setPrimaryPropId('');
      setDuplicatePropId('');
      await loadData();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Merge Failed',
        text2: e.message || 'Could not merge properties.',
        position: 'bottom',
      });
    } finally {
      setMerging(false);
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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Manage Properties</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        {/* Claim requests */}
        <Text className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Owner Claim Requests</Text>
        {loading ? (
          <Text className="text-slate-400 font-bold text-xs mb-6">Loading claims...</Text>
        ) : claims.length === 0 ? (
          <View className="bg-slate-50 rounded-2xl p-4 mb-6">
            <Text className="text-slate-400 text-xs font-semibold text-center">No pending property claim requests.</Text>
          </View>
        ) : (
          <FlatList
            data={claims}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            className="mb-6"
            renderItem={({ item }) => (
              <View className="bg-slate-50 border border-slate-150 rounded-2xl p-4 mb-3">
                <Text className="text-slate-800 font-extrabold text-sm mb-1">{getPropName(item.propertyId)}</Text>
                <Text className="text-[10px] text-slate-400 font-bold mb-3">Claimed by User: {item.userId} on {item.date}</Text>
                
                {/* Proof */}
                <Image source={{ uri: item.businessProofUrl }} className="h-32 w-full rounded-xl mb-3 bg-slate-200" resizeMode="cover" />

                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => handleRejectClaim(item.id)}
                    className="flex-1 bg-slate-200 py-2.5 rounded-xl items-center"
                  >
                    <Text className="text-slate-700 text-xs font-bold">Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleApproveClaim(item.id)}
                    className="flex-1 bg-primary-500 py-2.5 rounded-xl items-center"
                  >
                    <Text className="text-white text-xs font-bold">Approve Claim</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Duplicate Property Merger Wizard */}
        <Text className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 mb-3">Merge Duplicate Properties</Text>
        <View className="bg-slate-50 border border-slate-150 rounded-3xl p-5 mb-8 shadow-sm">
          <Text className="text-xs text-slate-400 font-bold leading-5 mb-4">
            If users suggest duplicate properties, select the authoritative Primary property and the duplicate property to merge them.
          </Text>

          {/* Primary Select */}
          <Text className="text-xs font-black text-slate-500 mb-2">1. Select Primary Property (Authoritative)</Text>
          <FlatList
            data={properties}
            keyExtractor={(item) => `pri_${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            renderItem={({ item }) => {
              const selected = primaryPropId === item.id;
              return (
                <TouchableOpacity
                  onPress={() => setPrimaryPropId(selected ? '' : item.id)}
                  className={`px-3.5 py-2.5 rounded-xl border ${
                    selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-slate-200'
                  } mr-2`}
                >
                  <Text className={`text-xs font-bold ${selected ? 'text-white' : 'text-slate-700'}`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Duplicate Select */}
          <Text className="text-xs font-black text-slate-500 mb-2">2. Select Duplicate Property (To Merge and Remove)</Text>
          <FlatList
            data={properties}
            keyExtractor={(item) => `dup_${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            renderItem={({ item }) => {
              const selected = duplicatePropId === item.id;
              return (
                <TouchableOpacity
                  onPress={() => setDuplicatePropId(selected ? '' : item.id)}
                  className={`px-3.5 py-2.5 rounded-xl border ${
                    selected ? 'bg-red-500 border-red-500' : 'bg-white border-slate-200'
                  } mr-2`}
                >
                  <Text className={`text-xs font-bold ${selected ? 'text-white' : 'text-slate-700'}`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <Button
            title="Merge Selected Properties"
            loading={merging}
            onPress={handleMerge}
            variant="danger"
          />
        </View>

        {/* Directory List */}
        <Text className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">All Properties Directory ({properties.length})</Text>
        <FlatList
          data={properties}
          keyExtractor={(item) => `list_${item.id}`}
          scrollEnabled={false}
          className="mb-10"
          renderItem={({ item }) => (
            <View className="bg-white border border-slate-100 p-4 rounded-2xl mb-2 flex-row justify-between items-center shadow-sm">
              <View className="flex-1 mr-2">
                <Text className="text-slate-800 font-extrabold text-sm" numberOfLines={1}>{item.name}</Text>
                <Text className="text-slate-400 text-xs mt-0.5">{item.type} • {item.location}</Text>
              </View>
              <View className="bg-slate-50 px-3 py-1.5 rounded-xl items-center">
                <Text className="text-slate-400 text-[9px] font-bold">Trust Score</Text>
                <Text className="text-slate-800 text-sm font-black mt-0.5">{item.trustScore}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
