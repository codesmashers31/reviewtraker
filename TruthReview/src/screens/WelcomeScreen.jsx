import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-background relative justify-center items-center overflow-hidden">
      {/* Luxury Ambient Glow Orbs */}
      <View className="absolute -top-20 -left-20 w-72 h-72 bg-secondary-500 rounded-full opacity-10" />
      <View className="absolute bottom-10 -right-20 w-80 h-80 bg-primary-500 rounded-full opacity-10" />

      <View className="bg-card border border-borderSubtle p-8 rounded-4xl shadow-premium items-center w-5/6 max-w-sm z-10">
        {/* Icon Capsule */}
        <View className="h-16 w-16 bg-surface border border-borderSubtle rounded-full items-center justify-center shadow-premium mb-6">
          <Text className="text-3xl">🛡️</Text>
        </View>

        <Text className="text-3xl font-black text-text mb-3 text-center">
          Truth Review
        </Text>
        <Text className="text-textMuted text-center font-medium mb-10 leading-6 px-2">
          Discover premium stays and co-living spaces with verified resident reviews.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Main")}
          className="w-full overflow-hidden rounded-2xl shadow-premium active:opacity-90 h-[52px]"
        >
          <LinearGradient
            colors={['#0A4D8C', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text className="text-white font-bold text-base tracking-wide">Get Started →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}