import { MaterialCommunityIcons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ZoomableImage } from "./ZoomableImage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImagePreviewerProps {
  images: string[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export default function ImagePreviewer({
  images,
  visible,
  initialIndex = 0,
  onClose,
}: ImagePreviewerProps) {
  const [previewImageIndex, setPreviewImageIndex] = useState(initialIndex);
  const [resetKey, setResetKey] = useState(0);
  const previewScrollViewRef = useRef<ScrollView>(null);
  const imageControlRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    rotate: () => void;
    rotateCounterClockwise: () => void;
    reset: () => void;
  } | null>(null);

  useEffect(() => {
    if (visible) {
      setPreviewImageIndex(initialIndex);
      setResetKey((prev) => prev + 1);
    }
  }, [visible, initialIndex]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
          <View className="flex-1">
            {/* Image Counter */}
            <View className="absolute top-4 left-4 z-10 bg-black/50 rounded-full px-4 py-2">
              <Text className="text-white text-sm font-medium">
                {previewImageIndex + 1} / {images.length}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 z-10 bg-white/20 rounded-full w-14 h-14 items-center justify-center"
              activeOpacity={0.7}
            >
              <Text className="text-white text-2xl">✕</Text>
            </TouchableOpacity>

            {/* Image Preview Slider with Zoom */}
            <ScrollView
              ref={previewScrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: previewImageIndex * SCREEN_WIDTH, y: 0 }}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setPreviewImageIndex(index);
                setResetKey((prev) => prev + 1); // Reset zoom when changing images
              }}
              scrollEventThrottle={16}
            >
              {images.map((item, index) => (
                <ZoomableImage
                  key={index}
                  uri={item}
                  resetTrigger={resetKey}
                  controlRef={
                    index === previewImageIndex ? imageControlRef : undefined
                  }
                />
              ))}
            </ScrollView>

            {/* Control Buttons - Bottom */}
            <View className="absolute bottom-8 left-0 right-0 items-center">
              <View className="flex-row gap-3 bg-black/50 rounded-full px-4 py-3 items-center">
                <TouchableOpacity
                  onPress={() => imageControlRef.current?.zoomIn()}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="magnify-plus"
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => imageControlRef.current?.zoomOut()}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="magnify-minus"
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => imageControlRef.current?.rotate()}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="rotate-right"
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    imageControlRef.current?.rotateCounterClockwise()
                  }
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="rotate-left"
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    imageControlRef.current?.reset();
                    setResetKey((prev) => prev + 1);
                  }}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Octicons name="sync" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}
