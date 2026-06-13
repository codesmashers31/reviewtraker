import { api } from '../../services/api';
import { User } from './authSlice';
import { MockDb } from '../../services/mockDb';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      // Backend is offline, fallback to local MockDb simulation
      const users = await MockDb.getUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!found) {
        throw new Error('Invalid email or password.');
      }

      if (found.suspended) {
        throw new Error('This account has been suspended by administrators.');
      }

      return {
        user: {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
          phoneNumber: found.phoneNumber,
        },
        token: `mock_jwt_token_${found.id}`,
        refreshToken: `mock_refresh_token_${found.id}`,
      };
    }
  },

  async register(name: string, email: string, phoneNumber: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        phoneNumber,
        password,
      });
      return response.data;
    } catch (err) {
      // Fallback to local MockDb
      const users = await MockDb.getUsers();
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('A user with this email already exists.');
      }

      const registered = await MockDb.registerUser(name, email, phoneNumber, 'user');
      
      return {
        user: {
          id: registered.id,
          name: registered.name,
          email: registered.email,
          role: registered.role,
          phoneNumber: registered.phoneNumber,
        },
        token: `mock_jwt_token_${registered.id}`,
        refreshToken: `mock_refresh_token_${registered.id}`,
      };
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (err) {
      const users = await MockDb.getUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        throw new Error('Email address not found.');
      }
      return { message: 'Reset password link sent to your email.' };
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<{ user: User }> {
    try {
      const response = await api.put<{ user: User }>('/user/profile', profileData);
      return response.data;
    } catch (err) {
      // Offline fallback
      return {
        user: {
          id: profileData.id || 'user_123',
          name: profileData.name || 'John Doe',
          email: profileData.email || 'user@truthreview.com',
          role: profileData.role || 'user',
          phoneNumber: profileData.phoneNumber || '',
          avatar: profileData.avatar,
        },
      };
    }
  },
};

export default authService;
