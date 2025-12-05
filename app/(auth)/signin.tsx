import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const handleSignIn = () => {
    // TODO: Implement sign in logic
    console.log("Sign in:", { email, password });
    // Navigate to tabs after sign in
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: "100%",
            paddingHorizontal: 24,
            paddingTop: 60,
            paddingBottom: 40,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {/* Logo/Brand Section */}
          <View className="items-center mb-10">
            <View className="mb-3">
              <Text className="text-5xl font-extrabold text-white tracking-tight">
                Rently
              </Text>
            </View>
            <Text className="text-lg text-white opacity-90 font-medium">
              Welcome back! 👋
            </Text>
          </View>

          {/* Card Container */}
          <View className="bg-white rounded-[32px] p-8 shadow-lg">
            <Text className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
              Sign In
            </Text>
            <Text className="text-[15px] text-gray-500 mb-8 leading-6">
              Enter your credentials to access your account
            </Text>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className={`h-14 bg-gray-50 rounded-2xl px-5 text-base text-gray-900 border-2 ${
                  isFocused.email
                    ? "border-indigo-500 bg-white"
                    : "border-gray-200"
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
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                className={`h-14 bg-gray-50 rounded-2xl px-5 text-base text-gray-900 border-2 ${
                  isFocused.password
                    ? "border-indigo-500 bg-white"
                    : "border-gray-200"
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsFocused({ ...isFocused, password: true })}
                onBlur={() => setIsFocused({ ...isFocused, password: false })}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            {/* Forgot Password */}
            <View className="items-end mb-8">
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-sm font-semibold text-indigo-500">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              className="w-full rounded-2xl overflow-hidden mb-6"
              activeOpacity={0.8}
              style={{
                shadowColor: "#667eea",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: "100%",
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-white text-lg font-bold tracking-wide">
                  Sign In
                </Text>
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
              <TouchableOpacity
                className="flex-1 h-[52px] bg-gray-50 rounded-2xl border-2 border-gray-200 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-[15px] font-semibold text-gray-700">
                  Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 h-[52px] bg-gray-50 rounded-2xl border-2 border-gray-200 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-[15px] font-semibold text-gray-700">
                  Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-[15px] text-gray-500">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text className="text-[15px] font-bold text-indigo-500">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
