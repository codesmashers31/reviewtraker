import { api } from '../../services/api';
import { User } from './authSlice';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(name: string, email: string, phoneNumber: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      phoneNumber,
      password,
    });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  async updateProfile(profileData: Partial<User>): Promise<{ user: User }> {
    const response = await api.put<{ user: User }>('/user/profile', profileData);
    return response.data;
  },
};
export default authService;
