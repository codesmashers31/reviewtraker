import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_INFO: '@user_info',
  WISHLIST: '@wishlist',
  THEME: '@theme',
  HAS_LAUNCHED: '@has_launched',
};

export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error writing key ${key} to AsyncStorage:`, error);
    }
  },

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;
      
      // Attempt to parse JSON. If it fails, return as string.
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading key ${key} from AsyncStorage:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key ${key} from AsyncStorage:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },
};
