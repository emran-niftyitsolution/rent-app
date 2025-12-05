import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = () => {
    // TODO: Implement forgot password logic
    console.log('Reset password for:', { email });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: '100%',
              paddingHorizontal: 24,
              paddingTop: 60,
              paddingBottom: 40,
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            className="flex-1">
            
            <View className="items-center mb-10">
              <View className="mb-4">
                <Text className="text-6xl">✉️</Text>
              </View>
              <Text className="text-5xl font-extrabold text-white tracking-tight">Rently</Text>
            </View>

            <View className="bg-white rounded-[32px] p-8 shadow-lg">
              <Text className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Check Your Email</Text>
              <Text className="text-[15px] text-gray-500 mb-8 leading-6 text-center">
                We&apos;ve sent a password reset link to{'\n'}
                <Text className="font-semibold text-gray-800">{email}</Text>
              </Text>
              
              <View className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
                <Text className="text-sm text-blue-900 leading-5 text-center">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsSubmitted(false)}
                className="h-[52px] bg-gray-50 rounded-2xl border-2 border-gray-200 items-center justify-center mb-6"
                activeOpacity={0.8}>
                <Text className="text-[15px] font-semibold text-gray-700">Resend Email</Text>
              </TouchableOpacity>

              <View className="items-center">
                <Link href="/(auth)/signin" asChild>
                  <TouchableOpacity>
                    <Text className="text-[15px] font-bold text-blue-500">← Back to Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: '100%',
            paddingHorizontal: 24,
            paddingTop: 60,
            paddingBottom: 40,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1">
          
          {/* Logo/Brand Section */}
          <View className="items-center mb-10">
            <View className="mb-3">
              <Text className="text-5xl font-extrabold text-white tracking-tight">Rently</Text>
            </View>
            <Text className="text-lg text-white opacity-90 font-medium">Reset your password 🔐</Text>
          </View>

          {/* Card Container */}
          <View className="bg-white rounded-[32px] p-8 shadow-lg">
            <Text className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Forgot Password?</Text>
            <Text className="text-[15px] text-gray-500 mb-8 leading-6 text-center">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>

            {/* Email Input */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
              <TextInput
                className={`h-14 bg-gray-50 rounded-2xl px-5 text-base text-gray-900 border-2 ${
                  isFocused ? 'border-blue-500 bg-white' : 'border-gray-200'
                }`}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              className="w-full rounded-2xl overflow-hidden mb-6"
              activeOpacity={0.8}
              style={{
                shadowColor: '#4facfe',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: '100%',
                  paddingVertical: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text className="text-white text-lg font-bold tracking-wide">Send Reset Link</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Sign In */}
            <View className="flex-row justify-center items-center">
              <Text className="text-[15px] text-gray-500">Remember your password? </Text>
              <Link href="/(auth)/signin" asChild>
                <TouchableOpacity>
                  <Text className="text-[15px] font-bold text-blue-500">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
