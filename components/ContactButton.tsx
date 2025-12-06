import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ContactButtonProps {
  onPress?: () => void;
}

export default function ContactButton({ onPress }: ContactButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-2xl overflow-hidden mb-8"
      activeOpacity={0.8}
      style={styles.shadow}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text className="text-white text-lg font-bold tracking-wide">
          Contact Owner
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    width: "100%",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

