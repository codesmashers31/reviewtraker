import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LandingScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background relative justify-center items-center overflow-hidden">
      {/* Luxury Ambient Orbs */}
      <View className="absolute top-10 left-10 w-64 h-64 bg-secondary-500 rounded-full opacity-10" />
      <View className="absolute bottom-20 right-10 w-72 h-72 bg-primary-500 rounded-full opacity-10" />

      <View className="bg-card border border-borderSubtle p-8 rounded-4xl shadow-premium items-center w-5/6 max-w-sm z-10">
        <View className="h-16 w-16 bg-surface border border-borderSubtle rounded-full items-center justify-center shadow-premium mb-6">
          <Text className="text-3xl">🛡️</Text>
        </View>
        <Text className="text-2xl font-black text-text mb-3 text-center">
          Find Your Perfect Stay
        </Text>
        <Text className="text-textMuted text-center font-medium leading-6">
          Search and explore stays with trusted reviews from verified residents.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;