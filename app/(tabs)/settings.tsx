import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...");
    router.replace("/(auth)/signin");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900">Settings</Text>
        </View>

        {/* User Profile Section */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="items-center mb-4">
              {/* Profile Avatar */}
              <View className="w-24 h-24 bg-indigo-500 rounded-full items-center justify-center mb-3">
                <Text className="text-white text-4xl font-bold">JD</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">John Doe</Text>
              <Text className="text-gray-500 text-base mt-1">
                john.doe@example.com
              </Text>
            </View>

            {/* Profile Info */}
            <View className="mt-6 space-y-4">
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600 text-base">Phone</Text>
                <Text className="text-gray-900 font-semibold text-base">
                  +1 (555) 123-4567
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600 text-base">Member Since</Text>
                <Text className="text-gray-900 font-semibold text-base">
                  Jan 2024
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text className="text-gray-600 text-base">Account Status</Text>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 font-semibold text-sm">
                    Active
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <TouchableOpacity
              className="px-6 py-4 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <Text className="text-gray-900 font-semibold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-4 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <Text className="text-gray-900 font-semibold text-base">
                Notifications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-4 border-b border-gray-100"
              activeOpacity={0.7}
            >
              <Text className="text-gray-900 font-semibold text-base">
                Privacy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4" activeOpacity={0.7}>
              <Text className="text-gray-900 font-semibold text-base">
                Help & Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="rounded-2xl overflow-hidden shadow-lg"
            activeOpacity={0.8}
            style={styles.logoutButtonShadow}
          >
            <LinearGradient
              colors={["#ef4444", "#dc2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutButtonGradient}
            >
              <Text className="text-white text-lg font-bold tracking-wide">
                Logout
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoutButtonShadow: {
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutButtonGradient: {
    width: "100%",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
