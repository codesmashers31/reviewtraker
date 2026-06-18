import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../theme/ThemeContext';
import { setCredentials, setLoading } from '../authSlice';
import { storage, STORAGE_KEYS } from '../../../services/storage';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const OTP_LENGTH = 6;

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [otpError, setOtpError] = useState('');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ── OTP digit state ─────────────────────────────────────────────────────────
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const otpCode = digits.join('');

  // Reset OTP digits when modal closes
  useEffect(() => {
    if (!isOtpSent) {
      setDigits(Array(OTP_LENGTH).fill(''));
      setOtpError('');
    }
  }, [isOtpSent]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isOtpSent) {
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [isOtpSent]);

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateIdentifier = (text: string) => {
    if (!text.trim()) {
      setIdentifierError('Please enter your email or mobile number');
      return false;
    }
    if (text.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setIdentifierError('Please enter a valid email address');
        return false;
      }
    } else {
      const cleanPhone = text.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        setIdentifierError('Please enter a valid 10-digit mobile number');
        return false;
      }
    }
    setIdentifierError('');
    return true;
  };

  // ── OTP digit handlers ──────────────────────────────────────────────────────
  const handleDigitChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setOtpError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!validateIdentifier(identifier)) return;
    setSendingOtp(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setIsOtpSent(true);
      setCountdown(180); // 3 minutes
      Toast.show({
        type: 'info',
        text1: 'Verification Code Sent',
        text2: `Use code: ${mockOtp} to sign in`,
        position: 'top',
        visibilityTime: 180000, // stays for 3 minutes
      });
    } catch {
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

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const googleUser = {
        id: `google_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'user' as const,
        phoneNumber: '',
      };
      const token = 'mock_google_jwt_token';
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await storage.setItem(STORAGE_KEYS.USER_INFO, googleUser);
      dispatch(setCredentials({ user: googleUser, token }));
      Toast.show({
        type: 'success',
        text1: 'Signed in with Google!',
        text2: `Welcome, ${googleUser.name}`,
        position: 'bottom',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In Failed',
        text2: 'Something went wrong. Please try again.',
        position: 'bottom',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Verify OTP & Login ──────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otpCode.length !== OTP_LENGTH) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    if (otpCode !== generatedOtp) {
      setOtpError('Incorrect code. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      return;
    }
    setOtpError('');
    setVerifyingOtp(true);
    dispatch(setLoading(true));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const loggedUser = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Resident User',
        email: identifier.includes('@') ? identifier : `${identifier}@truthreview.com`,
        role: 'user' as const,
        phoneNumber: identifier.includes('@') ? '' : identifier,
      };
      const token = 'mock_jwt_token_for_user';
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await storage.setItem(STORAGE_KEYS.USER_INFO, loggedUser);
      setIsOtpSent(false);
      dispatch(setCredentials({ user: loggedUser, token }));
      Toast.show({
        type: 'success',
        text1: 'Welcome to Truth Review!',
        text2: `Signed in as ${loggedUser.name}`,
        position: 'bottom',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingOtp(false);
      dispatch(setLoading(false));
    }
  };

  // ── Theme helpers ───────────────────────────────────────────────────────────
  const bg      = isDark ? '#020617' : '#f8faff';
  const card    = isDark ? '#0f172a' : '#ffffff';
  const border  = isDark ? '#1e293b' : '#e2e8f0';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted   = '#94a3b8';
  const inputBg     = isDark ? '#0f172a' : '#ffffff';

  // ── OTP Boxes ───────────────────────────────────────────────────────────────
  const renderOtpBoxes = () => (
    <View style={styles.otpRow}>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => {
        const isFilled = digits[i] !== '';
        return (
          <TextInput
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            value={digits[i]}
            onChangeText={(val) => handleDigitChange(val, i)}
            onKeyPress={({ nativeEvent }) => handleDigitKeyPress(nativeEvent.key, i)}
            keyboardType="number-pad"
            maxLength={2}
            textAlign="center"
            caretHidden
            selectTextOnFocus
            style={[
              styles.otpBox,
              {
                borderColor: isFilled ? '#2563eb' : border,
                backgroundColor: isFilled ? (isDark ? '#1e3a8a22' : '#eff6ff') : inputBg,
                color: textPrimary,
              },
            ]}
          />
        );
      })}
    </View>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <Ionicons name="shield-checkmark" size={28} color={isDark ? '#3b82f6' : '#0b1a30'} />
          <View style={styles.headerBrandText}>
            <View style={styles.headerBrandRow}>
              <Text style={[styles.brandTruth, { color: textPrimary }]}>Truth</Text>
              <Text style={styles.brandReview}> Review</Text>
            </View>
            <Text style={styles.brandSub}>India's Verified Accommodation Reality Platform</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeToggle, { backgroundColor: card, borderColor: border }]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={18}
            color={isDark ? '#fbbf24' : '#0f172a'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          <View>
            {/* Welcome text */}
            <View style={styles.welcomeBlock}>
              <Text style={[styles.welcomeTitle, { color: textPrimary }]}>Welcome Back 👋</Text>
              <Text style={[styles.welcomeSub, { color: textMuted }]}>
                Enter your email or phone number to sign in with OTP
              </Text>
            </View>

            {/* Identifier input */}
            <View style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: textPrimary }]}>
                Email Address or Mobile Number
              </Text>
              <View style={[styles.inputRow, { backgroundColor: inputBg, borderColor: identifierError ? '#ef4444' : border }]}>
                <Ionicons name="phone-portrait-outline" size={18} color={textMuted} />
                <TextInput
                  value={identifier}
                  onChangeText={(t) => { setIdentifier(t); if (identifierError) setIdentifierError(''); }}
                  placeholder="Enter email or 10-digit mobile number"
                  placeholderTextColor={textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.textInput, { color: textPrimary }]}
                />
              </View>
              {!!identifierError && <Text style={styles.errorText}>{identifierError}</Text>}
            </View>

            {/* Helper text */}
            <View style={[styles.helperBox, { backgroundColor: isDark ? '#0f172a' : '#eff6ff', borderColor: isDark ? '#1e3a8a44' : '#bfdbfe' }]}>
              <Ionicons name="information-circle-outline" size={14} color="#3b82f6" />
              <Text style={[styles.helperText, { color: isDark ? '#93c5fd' : '#1d4ed8' }]}>
                We'll send a 6-digit verification code to your email or phone
              </Text>
            </View>

            {/* Send OTP CTA */}
            <TouchableOpacity
              onPress={handleSendOtp}
              style={[styles.ctaButton, sendingOtp && { opacity: 0.7 }]}
              activeOpacity={0.9}
              disabled={sendingOtp}
            >
              {sendingOtp ? (
                <View style={styles.ctaRow}>
                  <Ionicons name="hourglass-outline" size={16} color="#ffffff" />
                  <Text style={[styles.ctaText, { marginLeft: 8 }]}>Sending Code…</Text>
                </View>
              ) : (
                <View style={styles.ctaRow}>
                  <Ionicons name="send-outline" size={16} color="#ffffff" />
                  <Text style={[styles.ctaText, { marginLeft: 8 }]}>Send Verification Code</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* ── Divider ── */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: border }]} />
              <Text style={[styles.dividerText, { color: textMuted }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: border }]} />
            </View>

            {/* ── Google Sign-In (icon only) ── */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                style={[styles.googleIconBtn, { backgroundColor: card, borderColor: border }]}
                activeOpacity={0.8}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#4285F4" />
                ) : (
                  <Text style={styles.googleG}>G</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Building illustration + footer */}
          <View style={styles.illustrationBlock}>
            <View style={styles.illustrationWrap}>
              <Image
                source={require('../../../../assets/buildings.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
              <View style={[styles.shieldBadge, { borderColor: bg }]}>
                <Ionicons name="checkmark-sharp" size={20} color="#ffffff" />
              </View>
            </View>
            <View style={styles.footerRow}>
              <Ionicons name="lock-closed-outline" size={12} color={textMuted} />
              <Text style={[styles.footerText, { color: textMuted }]}>
                {'  '}100% Anonymous  •  Your privacy is our priority
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* OTP Verification Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent
        visible={isOtpSent}
        onRequestClose={() => setIsOtpSent(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsOtpSent(false)}
          />
          <View style={[styles.sheetContainer, { backgroundColor: isDark ? '#020617' : '#ffffff' }]}>
            {/* Drag handle */}
            <View style={styles.dragHandle}>
              <View style={[styles.dragBar, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]} />
            </View>

            {/* Back */}
            <TouchableOpacity onPress={() => setIsOtpSent(false)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={textPrimary} />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.sheetScroll}
            >
              <Text style={[styles.verifyTitle, { color: textPrimary }]}>Verify Your Code</Text>
              <Text style={[styles.verifySub, { color: textMuted }]}>
                Enter the 6-digit code sent to{' '}
                <Text style={[styles.verifyEmail, { color: textPrimary }]}>{identifier}</Text>
              </Text>

              {/* Envelope illustration */}
              <View style={styles.envelopeWrap}>
                <View style={[styles.envelopeBox, { backgroundColor: isDark ? '#0f172a' : '#eff6ff' }]}>
                  <Ionicons name="mail-open-outline" size={54} color="#2563eb" />
                  <View style={[styles.checkBadge, { borderColor: isDark ? '#020617' : '#ffffff' }]}>
                    <Ionicons name="checkmark" size={14} color="#ffffff" />
                  </View>
                  <View style={styles.paperPlane}>
                    <Ionicons name="paper-plane" size={16} color="#3b82f6" />
                  </View>
                </View>
              </View>

              {/* 6-digit OTP boxes */}
              {renderOtpBoxes()}

              {!!otpError && <Text style={styles.otpErrorText}>{otpError}</Text>}

              {/* Resend */}
              <View style={styles.resendRow}>
                {countdown > 0 ? (
                  <Text style={[styles.resendLabel, { color: textMuted }]}>
                    Didn't receive code?{' '}
                    <Text style={styles.resendTimer}>
                      Resend in {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                    </Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleSendOtp}>
                    <Text style={styles.resendLink}>Resend verification code</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Verify & Login */}
              <TouchableOpacity
                onPress={handleVerifyOtp}
                style={[styles.ctaButton, verifyingOtp && { opacity: 0.7 }]}
                activeOpacity={0.9}
                disabled={verifyingOtp}
              >
                <View style={styles.ctaRow}>
                  <Ionicons
                    name={verifyingOtp ? 'hourglass-outline' : 'shield-checkmark-outline'}
                    size={16}
                    color="#ffffff"
                  />
                  <Text style={[styles.ctaText, { marginLeft: 8 }]}>
                    {verifyingOtp ? 'Verifying…' : 'Verify & Sign In'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Secure note */}
              <View style={styles.secureRow}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#3b82f6" />
                <View style={styles.secureText}>
                  <Text style={[styles.secureTitle, { color: textPrimary }]}>Secure OTP Verification</Text>
                  <Text style={[styles.secureSub, { color: textMuted }]}>
                    We never share your details with anyone
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footerRow}>
                <Ionicons name="lock-closed-outline" size={12} color={textMuted} />
                <Text style={[styles.footerText, { color: textMuted }]}>
                  {'  '}100% Anonymous  •  Your privacy is our priority
                </Text>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ── StyleSheet ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  body: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  headerBrand: { flexDirection: 'row', alignItems: 'center' },
  headerBrandText: { marginLeft: 10 },
  headerBrandRow: { flexDirection: 'row', alignItems: 'center' },
  brandTruth: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  brandReview: { fontSize: 18, fontWeight: '900', color: '#2563eb', letterSpacing: -0.5 },
  brandSub: { fontSize: 8, color: '#94a3b8', fontWeight: '600', letterSpacing: -0.3, marginTop: 1 },
  themeToggle: { padding: 8, borderRadius: 999, borderWidth: 1 },

  // Welcome
  welcomeBlock: { marginTop: 16, marginBottom: 24 },
  welcomeTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  welcomeSub: { fontSize: 12, fontWeight: '600', marginTop: 6, lineHeight: 18 },

  // Field
  fieldBlock: { marginBottom: 14 },
  fieldLabel: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13 },
  textInput: { flex: 1, marginLeft: 12, fontSize: 13, fontWeight: '600' },
  errorText: { color: '#ef4444', fontSize: 9, marginTop: 6, marginLeft: 4, fontWeight: '700' },

  // Helper box
  helperBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 20 },
  helperText: { fontSize: 10, fontWeight: '600', marginLeft: 8, flex: 1, lineHeight: 15 },

  // CTA
  ctaButton: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  ctaRow: { flexDirection: 'row', alignItems: 'center' },
  ctaText: { color: '#ffffff', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },

  // Google icon-only button
  socialRow: { alignItems: 'center' },
  googleIconBtn: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  googleG: { fontSize: 26, fontWeight: '900', color: '#4285F4', lineHeight: 30 },

  // Illustration
  illustrationBlock: { marginTop: 32, alignItems: 'center' },
  illustrationWrap: { width: '100%', alignItems: 'center', height: 140, position: 'relative' },
  illustration: { width: 220, height: '100%' },
  shieldBadge: { position: 'absolute', left: '28%', bottom: 8, backgroundColor: '#2563eb', padding: 10, borderRadius: 999, borderWidth: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 8 },
  footerText: { fontSize: 10, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheetContainer: { height: '83%', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 12 },
  dragHandle: { alignItems: 'center', marginBottom: 12 },
  dragBar: { width: 48, height: 5, borderRadius: 99 },
  backBtn: { alignSelf: 'flex-start', padding: 6, marginBottom: 8 },
  sheetScroll: { paddingBottom: 32 },

  // Verify text
  verifyTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  verifySub: { fontSize: 12, fontWeight: '600', marginTop: 8, lineHeight: 18 },
  verifyEmail: { fontWeight: '900' },

  // Envelope
  envelopeWrap: { alignItems: 'center', marginVertical: 24 },
  envelopeBox: { width: 128, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  checkBadge: { position: 'absolute', bottom: 6, right: 8, backgroundColor: '#22c55e', borderRadius: 999, borderWidth: 3, padding: 2 },
  paperPlane: { position: 'absolute', top: -4, right: -12 },

  // OTP
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  otpBox: { width: 46, height: 58, borderRadius: 14, borderWidth: 2, fontSize: 22, fontWeight: '800' },
  otpErrorText: { color: '#ef4444', fontSize: 10, textAlign: 'center', fontWeight: '700', marginBottom: 12 },

  // Resend
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginTop: 4 },
  resendLabel: { fontSize: 12, fontWeight: '700' },
  resendTimer: { color: '#2563eb', fontWeight: '900' },
  resendLink: { fontSize: 12, fontWeight: '900', color: '#2563eb' },

  // Secure
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 12 },
  secureText: { marginLeft: 10, flex: 1 },
  secureTitle: { fontSize: 11, fontWeight: '800' },
  secureSub: { fontSize: 9, fontWeight: '700', marginTop: 2 },
});
