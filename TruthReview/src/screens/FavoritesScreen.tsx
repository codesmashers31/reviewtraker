import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import { RootState } from '../store';
import { MockDb, Property } from '../services/mockDb';
import PGCard from '../components/PGCard';
import EmptyState from '../components/EmptyState';
import { useTheme } from '../features/theme/ThemeContext';

export default function FavoritesScreen({ navigation }: { navigation: any }) {
  const { isDark } = useTheme();
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
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <View className={`px-4 pt-6 pb-2 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
        <Text className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>My Favorites</Text>
      </View>

      {loading ? (
        <View className="flex-grow justify-center items-center">
          <Text className="text-slate-400 font-bold">Loading favorites...</Text>
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
