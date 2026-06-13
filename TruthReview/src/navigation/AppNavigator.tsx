import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';

import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { RootState } from '../store';
import { storage, STORAGE_KEYS } from '../services/storage';
import { setCredentials, logout } from '../features/auth/authSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Validate session on startup
    const checkSession = async () => {
      try {
        const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
        const user = await storage.getItem<any>(STORAGE_KEYS.USER_INFO);

        if (token && user) {
          dispatch(setCredentials({ user, token }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error checking authentication session:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();
  }, [dispatch]);

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
