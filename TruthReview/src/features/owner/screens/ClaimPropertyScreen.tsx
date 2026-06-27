import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

import { HomeStackParamList } from '../../../navigation/types';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { MockDb, Property } from '../../../services/mockDb';
import { RootState } from '../../../store';

type Props = NativeStackScreenProps<HomeStackParamList, 'ClaimProperty'>;

export default function ClaimPropertyScreen({ route, navigation }: Props) {
  const { pgId } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [property, setProperty] = useState<Property | null>(null);
  const [regNumber, setRegNumber] = useState('');
  const [businessProof, setBusinessProof] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      const props = await MockDb.getProperties();
      const p = props.find((x) => x.id === pgId);
      if (p) setProperty(p);
    };
    loadDetails();
  }, [pgId]);

  const handleUploadProof = () => {
    // Simulate photo/document attachment
    setBusinessProof('https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80');
    Toast.show({
      type: 'success',
      text1: 'Document Attached',
      text2: 'Business proof has been loaded.',
      position: 'bottom',
    });
  };

  const handleSubmit = async () => {
    if (!regNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Registration Required',
        text2: 'Please enter your business registration number.',
        position: 'bottom',
      });
      return;
    }

    if (!businessProof) {
      Toast.show({
        type: 'error',
        text1: 'Proof Document Required',
        text2: 'Please upload owner verification or property registry proof.',
        position: 'bottom',
      });
      return;
    }

    setSubmitting(true);
    try {
      await MockDb.submitClaim({
        userId: user?.id || 'guest_owner',
        propertyId: pgId,
        businessProofUrl: businessProof,
      });

      Toast.show({
        type: 'success',
        text1: 'Claim Submitted',
        text2: 'Your claim request is pending approval. Track it in your Profile panel.',
        position: 'bottom',
      });
      
      navigation.goBack();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
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
        <Text className="text-slate-400 font-bold">Loading Property Details...</Text>
      </SafeAreaView>
    );
  }

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
        <Text className="text-xl font-extrabold text-slate-800 ml-3">Claim Property</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <Text className="text-2xl font-black text-slate-800 mb-2">Verify Property Ownership</Text>
        <Text className="text-slate-400 font-semibold text-xs leading-5 mb-6">
          Submit official business documentation for <Text className="text-primary-500 font-black">{property.name}</Text> to gain rights to upload official gallery images, respond to user reviews, and view detail analytics.
        </Text>

        <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 mb-6">
          <Text className="text-xs text-slate-400 font-bold uppercase tracking-wide">Property Selected</Text>
          <Text className="text-slate-800 font-extrabold text-base mt-1">{property.name}</Text>
          <Text className="text-slate-500 text-xs mt-0.5">{property.location}</Text>
        </View>

        {/* Input Registration Code */}
        <View className="mb-4">
          <Input
            label="Business Registration ID / Tax Number"
            placeholder="e.g. GSTIN1234567890"
            value={regNumber}
            onChangeText={setRegNumber}
          />
        </View>

        {/* Upload Certificate Card */}
        <View className="mb-8">
          <Text className="text-slate-600 font-bold text-xs mb-3">Owner Agreement / Trade License Proof</Text>
          {businessProof ? (
            <View className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden items-center p-3 relative">
              <Image source={{ uri: businessProof }} style={{ height: 176, width: '100%', borderRadius: 12 }} resizeMode="cover" />
              <TouchableOpacity
                onPress={() => setBusinessProof(null)}
                className="absolute top-5 right-5 h-9 w-9 bg-black/60 rounded-full justify-center items-center"
              >
                <Ionicons name="trash" size={16} color="#ffffff" />
              </TouchableOpacity>
              <Text className="text-[10px] text-slate-400 font-semibold mt-2">license_document_proof.jpg</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleUploadProof}
              className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl py-8 items-center justify-center active:bg-slate-100"
            >
              <Ionicons name="cloud-upload-outline" size={32} color="#94a3b8" />
              <Text className="text-slate-700 font-extrabold text-sm mt-3">Upload business registration file</Text>
              <Text className="text-slate-400 text-[10px] font-semibold mt-1">Select PNG or JPG certificate copy</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button
          title="Submit Claim Request"
          loading={submitting}
          onPress={handleSubmit}
          className="mb-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
