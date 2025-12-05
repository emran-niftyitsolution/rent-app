import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const handleSignUp = () => {
    // TODO: Implement sign up logic
    console.log('Sign up:', { name, email, password, confirmPassword });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
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
            <Text className="text-lg text-white opacity-90 font-medium">Create your account 🚀</Text>
          </View>

          {/* Card Container */}
          <View className="bg-white rounded-[32px] p-8 shadow-lg">
            <Text className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Sign Up</Text>
            <Text className="text-[15px] text-gray-500 mb-8 leading-6">Join us and start your journey today</Text>

            {/* Name Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Full Name</Text>
              <TextInput
                className={`h-14 bg-gray-50 rounded-2xl px-5 text-base text-gray-900 border-2 ${
                  isFocused.name ? 'border-pink-500 bg-white' : 'border-gray-200'
                }`}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                onFocus={() => setIsFocused({ ...isFocused, name: true })}
                onBlur={() => setIsFocused({ ...isFocused, name: false })}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
              <TextInput
                className={`h-14 bg-gray-50 rounded-2xl px-5 text-base text-gray-900 border-2 ${
                  isFocused.email ? 'border-pink-500 bg-white' : 'border-gray-200'
                }`}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocused({ ...isFocused, email: true })}
                onBlur={() => setIsFocused({ ...isFocused, email: false })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
              <TextInput
                className={`h-14 bg-gray-50 rounded-2xl px-5 text-base text-gray-900 border-2 ${
                  isFocused.password ? 'border-pink-500 bg-white' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsFocused({ ...isFocused, password: true })}
                onBlur={() => setIsFocused({ ...isFocused, password: false })}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm Password</Text>
              <TextInput
                className={`h-14 bg-gray-50 rounded-2xl px-5 text-base text-gray-900 border-2 ${
                  isFocused.confirmPassword ? 'border-pink-500 bg-white' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
                onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              className="w-full rounded-2xl overflow-hidden mt-2 mb-6"
              activeOpacity={0.8}
              style={{
                shadowColor: '#f5576c',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: '100%',
                  paddingVertical: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text className="text-white text-lg font-bold tracking-wide">Create Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-sm text-gray-400 font-medium">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Social Login Buttons */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity className="flex-1 h-[52px] bg-gray-50 rounded-2xl border-2 border-gray-200 items-center justify-center" activeOpacity={0.7}>
                <Text className="text-[15px] font-semibold text-gray-700">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 h-[52px] bg-gray-50 rounded-2xl border-2 border-gray-200 items-center justify-center" activeOpacity={0.7}>
                <Text className="text-[15px] font-semibold text-gray-700">Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-[15px] text-gray-500">Already have an account? </Text>
              <Link href="/(auth)/signin" asChild>
                <TouchableOpacity>
                  <Text className="text-[15px] font-bold text-pink-500">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
