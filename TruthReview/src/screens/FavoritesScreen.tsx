import React from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '../store';
import { mockPGs } from '../utils/mockData';
import PGCard from '../components/PGCard';
import EmptyState from '../components/EmptyState';

export default function FavoritesScreen() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // Filter local PG database by IDs stored in Redux wishlist
  const favoritedPGs = mockPGs.filter((pg) => wishlistItems.includes(pg.id));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-2 border-b border-slate-50">
        <Text className="text-2xl font-extrabold text-slate-800 mb-2">My Favorites</Text>
      </View>

      <FlatList
        data={favoritedPGs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PGCard item={item} />}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <EmptyState
            title="Your Wishlist is Empty"
            description="You haven't added any PG listings to your favorites yet. Tap the heart icon on any PG card to save it."
            icon="heart-outline"
          />
        }
      />
    </SafeAreaView>
  );
}
