import axios from 'axios';
import { storage, STORAGE_KEYS } from './storage';

// Base URL for the Express backend
// Update with your local IP if testing on a physical device, e.g., 'http://192.168.1.100:5000/api'
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach JWT Access Token
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiration & Global Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired token (401) and request has not been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while token is refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await storage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh token endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, newAccessToken);
        if (newRefreshToken) {
          await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Session has expired, clear local auth storage and let the state manager know
        await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        await storage.removeItem(STORAGE_KEYS.USER_INFO);

        // We can hook into Redux or dispatch a custom event to force redirect to login
        if (typeof window !== 'undefined') {
          // Native/Web redirect or event trigger
          const event = new CustomEvent('auth:unauthorized');
          window.dispatchEvent(event);
        }

        return Promise.reject(refreshError);
      }
    }

    // Standardize the error response structure
    const errorResponse = {
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(errorResponse);
  }
);
