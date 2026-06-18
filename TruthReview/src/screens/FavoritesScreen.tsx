import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import { RootState } from '../store';
import { MockDb, Property } from '../services/mockDb';
import PGCard from '../components/PGCard';
import EmptyState from '../components/EmptyState';

export default function FavoritesScreen({ navigation }: { navigation: any }) {
  const isFocused = useIsFocused();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    setLoading(false);
    const props = await MockDb.getProperties();
    setProperties(props);
  };

  useEffect(() => {
    if (isFocused) {
      loadProperties();
    }
  }, [isFocused]);

  // Filter local PG database by IDs stored in Redux wishlist
  const favoritedPGs = properties.filter((pg) => wishlistItems.includes(pg.id));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-6 pb-2 border-b border-borderSubtle">
        <Text className="text-2xl font-black text-text mb-2">My Favorites</Text>
      </View>

      {loading ? (
        <View className="flex-grow justify-center items-center">
          <Text className="text-textMuted font-bold">Loading favorites...</Text>
        </View>
      ) : (
        <FlatList
          data={favoritedPGs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PGCard item={item} navigation={navigation} />}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <EmptyState
              title="Your Wishlist is Empty"
              description="You haven't added any listings to your favorites yet. Tap the heart icon on any card to save it."
              icon="heart-outline"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
