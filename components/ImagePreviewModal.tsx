import { useRef, useState } from "react";
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Octicons from '@expo/vector-icons/Octicons';
import { ZoomableImage, ImageControlRef } from "./ZoomableImage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImagePreviewModalProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export function ImagePreviewModal({
  visible,
  images,
  initialIndex,
  onClose,
}: ImagePreviewModalProps) {
  const [previewImageIndex, setPreviewImageIndex] = useState(initialIndex);
  const [resetKey, setResetKey] = useState(0);
  const imageControlRef = useRef<ImageControlRef | null>(null);

  const handleScrollEnd = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    setPreviewImageIndex(index);
    setResetKey((prev) => prev + 1); // Reset zoom when changing images
  };

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
            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-12 right-4 z-10 bg-white/20 rounded-full w-14 h-14 items-center justify-center"
              activeOpacity={0.7}
            >
              <Text className="text-white text-2xl">✕</Text>
            </TouchableOpacity>

            {/* Image Preview Slider with Zoom */}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: previewImageIndex * SCREEN_WIDTH, y: 0 }}
              onMomentumScrollEnd={handleScrollEnd}
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
                >
                  <Text className="text-white text-3xl font-bold">+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => imageControlRef.current?.zoomOut()}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-white text-3xl font-bold">−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => imageControlRef.current?.rotate()}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-white text-2xl">↻</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => imageControlRef.current?.rotateCounterClockwise()}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-white text-2xl">↺</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    imageControlRef.current?.reset();
                    setResetKey((prev) => prev + 1);
                  }}
                  className="bg-white/20 rounded-full w-14 h-14 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Octicons name="sync" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}

