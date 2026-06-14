import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../navigation/types';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { setCredentials, setLoading } from '../authSlice';
import { storage, STORAGE_KEYS } from '../../../services/storage';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email address is required');
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateEmail(email)) return;

    setSendingOtp(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Generate a mock 6-digit OTP
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setIsOtpSent(true);
      setCountdown(30);

      // Display the OTP in a toast so they can type it in
      Toast.show({
        type: 'info',
        text1: 'Verification Code Sent',
        text2: `Use mock code: ${mockOtp} to sign in`,
        position: 'top',
        visibilityTime: 6000,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Send OTP',
        text2: 'Something went wrong, please try again.',
        position: 'bottom',
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    if (otpCode !== generatedOtp) {
      setOtpError('Incorrect verification code. Please try again.');
      return;
    }

    setOtpError('');
    setVerifyingOtp(true);
    dispatch(setLoading(true));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const loggedUser = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split('@')[0],
        email: email,
        role: 'user' as const,
        phoneNumber: '',
      };
      const token = 'mock_jwt_token_for_user';

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await storage.setItem(STORAGE_KEYS.USER_INFO, loggedUser);

      dispatch(setCredentials({ user: loggedUser, token }));
      
      Toast.show({
        type: 'success',
        text1: 'Logged In Successfully',
        text2: `Welcome to Truth Review, ${loggedUser.name}!`,
        position: 'bottom',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingOtp(false);
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(setLoading(true));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const googleUser = {
        id: 'user_google123',
        name: 'Google User',
        email: 'google.user@gmail.com',
        role: 'user' as const,
        phoneNumber: '',
      };
      const token = 'mock_jwt_token_for_google';

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await storage.setItem(STORAGE_KEYS.USER_INFO, googleUser);

      dispatch(setCredentials({ user: googleUser, token }));
      
      Toast.show({
        type: 'success',
        text1: 'Signed In with Google',
        text2: 'Welcome to Truth Review!',
        position: 'bottom',
      });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDemoLogin = async () => {
    dispatch(setLoading(true));
    try {
      const demoUser = {
        id: 'user_demo99',
        name: 'Demo Account',
        email: 'demo@truthreview.com',
        role: 'user' as const,
        phoneNumber: '+91 99999 88888',
      };
      const demoToken = 'mock_jwt_token_for_demo';

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoToken);
      await storage.setItem(STORAGE_KEYS.USER_INFO, demoUser);

      dispatch(setCredentials({ user: demoUser, token: demoToken }));
      
      Toast.show({
        type: 'success',
        text1: 'Logged In as Demo Account',
        text2: 'Explore hotels & PGs!',
        position: 'bottom',
      });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between px-6 py-8">
          
          <View>
            {/* Header / Title */}
            <View className="mt-8 mb-8">
              <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">Sign In</Text>
              <Text className="text-sm text-slate-500 mt-2 font-medium">
                Access verified reviews for Hotels & PGs.
              </Text>
            </View>

            {/* Email OTP Verification Section */}
            {!isOtpSent ? (
              <View>
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                  }}
                  error={emailError}
                />

                <Button
                  title="Send Verification Code"
                  loading={sendingOtp}
                  onPress={handleSendOtp}
                  className="mt-4"
                />
              </View>
            ) : (
              <View>
                <View className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-xs text-slate-400 font-bold uppercase">Sending to</Text>
                    <Text className="text-sm font-semibold text-slate-800 mt-0.5">{email}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => {
                      setIsOtpSent(false);
                      setOtpCode('');
                      setOtpError('');
                    }}
                    className="bg-slate-200/60 px-3 py-1.5 rounded-lg"
                  >
                    <Text className="text-xs font-bold text-slate-600">Change</Text>
                  </TouchableOpacity>
                </View>

                <Input
                  label="Verification Code (OTP)"
                  placeholder="Enter 6-digit code"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={(text) => {
                    setOtpCode(text);
                    if (otpError) setOtpError('');
                  }}
                  error={otpError}
                />

                <Button
                  title="Verify & Sign In"
                  loading={verifyingOtp}
                  onPress={handleVerifyOtp}
                  className="mt-4"
                />

                {/* Resend Timer */}
                <View className="items-center mt-5">
                  {countdown > 0 ? (
                    <Text className="text-xs text-slate-400 font-semibold">
                      Resend code in {countdown}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendOtp}>
                      <Text className="text-xs font-bold text-primary-600">
                        Resend verification code
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-slate-100" />
              <Text className="text-xs font-bold text-slate-450 uppercase px-4">or</Text>
              <View className="flex-1 h-[1px] bg-slate-100" />
            </View>

            {/* Google Login Action */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              style={styles.googleButton}
              className="border border-slate-200 rounded-xl py-3 px-4 flex-row items-center justify-center mb-4"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={16} color="#DB4437" />
              <Text className="text-slate-800 text-sm font-bold ml-2">Continue with Google</Text>
            </TouchableOpacity>

            {/* Demo Account Bypass Button */}
            <TouchableOpacity
              onPress={handleDemoLogin}
              style={styles.demoButton}
              className="border border-slate-200 rounded-xl py-3 px-4 flex-row items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name="flash" size={16} color="#2563eb" />
              <Text className="text-primary-600 text-sm font-bold ml-2">Instant Demo Login</Text>
            </TouchableOpacity>

          </View>

          {/* Footer Text */}
          <Text className="text-center text-xs text-slate-400 font-medium leading-4 px-6 mt-8">
            By continuing, you agree to the Terms of Service and Privacy Policy of Truth Review.
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#ffffff',
  },
  demoButton: {
    backgroundColor: '#f8fafc',
    borderStyle: 'dashed',
  }
});
