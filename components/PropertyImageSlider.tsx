import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PropertyImageSliderProps {
  images: string[];
  onImagePress: (index: number) => void;
}

export default function PropertyImageSlider({
  images,
  onImagePress,
}: PropertyImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  return (
    <View className="relative">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="w-full h-80"
      >
        {images.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            onPress={() => onImagePress(index)}
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: SCREEN_WIDTH, height: 320 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-5 left-4 bg-white/90 rounded-full items-center justify-center"
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>

      {/* Image Counter */}
      <View className="absolute top-5 right-4 bg-black/50 rounded-full px-3 py-1">
        <Text className="text-white text-sm font-medium">
          {currentImageIndex + 1} / {images.length}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
        {images.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              index === currentImageIndex
                ? "bg-white w-6"
                : "bg-white/50 w-2"
            }`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

