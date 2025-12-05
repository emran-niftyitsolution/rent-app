import Octicons from "@expo/vector-icons/Octicons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Zoomable and Rotatable Image Component
function ZoomableImage({
  uri,
  resetTrigger,
  controlRef,
}: {
  uri: string;
  resetTrigger: number;
  controlRef?: React.MutableRefObject<{
    zoomIn: () => void;
    zoomOut: () => void;
    rotate: () => void;
    rotateCounterClockwise: () => void;
    reset: () => void;
  } | null>;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  useEffect(() => {
    // Reset when resetTrigger changes
    scale.value = withSpring(1);
    savedScale.value = 1;
    rotation.value = withSpring(0);
    savedRotation.value = 0;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  const resetTransform = () => {
    "worklet";
    scale.value = withSpring(1);
    savedScale.value = 1;
    rotation.value = withSpring(0);
    savedRotation.value = 0;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const zoomIn = () => {
    const newScale = Math.min(savedScale.value * 1.5, 5);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
  };

  const zoomOut = () => {
    const newScale = Math.max(savedScale.value / 1.5, 1);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
    if (newScale === 1) {
      resetTransform();
    }
  };

  const rotate = () => {
    rotation.value = withSpring(savedRotation.value + Math.PI / 2);
    savedRotation.value = rotation.value;
  };

  const rotateCounterClockwise = () => {
    rotation.value = withSpring(savedRotation.value - Math.PI / 2);
    savedRotation.value = rotation.value;
  };

  // Expose control functions via ref
  useEffect(() => {
    if (controlRef) {
      controlRef.current = {
        zoomIn,
        zoomOut,
        rotate,
        rotateCounterClockwise,
        reset: resetTransform,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlRef, resetTrigger]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event) => {
      if (scale.value > 1) {
        resetTransform();
      } else {
        const newScale = 2.5;
        scale.value = withSpring(newScale);
        savedScale.value = newScale;
        translateX.value = withSpring(
          (SCREEN_WIDTH / 2 - event.x) * (newScale - 1)
        );
        translateY.value = withSpring(
          (SCREEN_HEIGHT / 2 - event.y) * (newScale - 1)
        );
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      focalX.value = SCREEN_WIDTH / 2;
      focalY.value = SCREEN_HEIGHT / 2;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.max(1, Math.min(newScale, 5));

      // Adjust translation based on focal point
      const scaleChange = scale.value - savedScale.value;
      translateX.value =
        savedTranslateX.value -
        (focalX.value - SCREEN_WIDTH / 2) * (scaleChange / savedScale.value);
      translateY.value =
        savedTranslateY.value -
        (focalY.value - SCREEN_HEIGHT / 2) * (scaleChange / savedScale.value);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      if (scale.value < 1) {
        resetTransform();
      } else if (scale.value > 5) {
        scale.value = withSpring(5);
        savedScale.value = 5;
      }
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .minPointers(1)
    .maxPointers(1)
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Race(
    doubleTap,
    Gesture.Simultaneous(
      Gesture.Simultaneous(pinchGesture, rotationGesture),
      panGesture
    )
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${(rotation.value * 180) / Math.PI}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={{
          width: SCREEN_WIDTH,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.Image
          source={{ uri }}
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
            },
            animatedStyle,
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

// Mock data - in real app, this would come from API
const mockRentPosts = [
  {
    id: "1",
    title: "Modern 2BR Apartment in Downtown",
    location: "New York, NY",
    price: 2500,
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    description:
      "Beautiful modern apartment with great amenities. Located in the heart of downtown, this spacious 2-bedroom apartment features hardwood floors, updated kitchen, and large windows with natural light. Perfect for professionals or small families.",
    amenities: [
      "Air Conditioning",
      "Dishwasher",
      "Laundry",
      "Parking",
      "Pet Friendly",
      "Gym Access",
    ],
    balcony: 1,
    drawing: 1,
    dining: 1,
    kitchen: 1,
    gasType: "Natural Gas",
    lift: true,
    parking: true,
    availableFrom: "2024-02-01",
    contact: "+1 (555) 123-4567",
  },
  {
    id: "2",
    title: "Cozy Studio Near Central Park",
    location: "Manhattan, NY",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
    ],
    description:
      "Perfect for students or young professionals. This cozy studio apartment is just a few blocks from Central Park. Features include a fully equipped kitchen, modern bathroom, and plenty of natural light.",
    amenities: ["Air Conditioning", "WiFi Included", "Near Public Transport"],
    balcony: 0,
    drawing: 1,
    dining: 1,
    kitchen: 1,
    gasType: "LPG",
    lift: false,
    parking: false,
    availableFrom: "2024-01-15",
    contact: "+1 (555) 234-5678",
  },
  {
    id: "3",
    title: "Luxury 3BR Penthouse with View",
    location: "Brooklyn, NY",
    price: 4500,
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    ],
    description:
      "Stunning views and premium finishes. This luxury penthouse offers breathtaking city views, high-end appliances, and a spacious layout perfect for entertaining.",
    amenities: [
      "Air Conditioning",
      "Dishwasher",
      "Laundry",
      "Parking",
      "Rooftop Access",
      "Concierge",
      "Gym Access",
    ],
    balcony: 2,
    drawing: 1,
    dining: 1,
    kitchen: 1,
    gasType: "Natural Gas",
    lift: true,
    parking: true,
    availableFrom: "2024-03-01",
    contact: "+1 (555) 345-6789",
  },
  {
    id: "4",
    title: "Spacious 1BR Loft",
    location: "Queens, NY",
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    area: 900,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    description:
      "Industrial style loft with high ceilings. This unique space features exposed brick, large windows, and an open floor plan perfect for creative professionals.",
    amenities: [
      "Air Conditioning",
      "High Ceilings",
      "Exposed Brick",
      "Parking",
    ],
    balcony: 0,
    drawing: 1,
    dining: 1,
    kitchen: 1,
    gasType: "LPG",
    lift: false,
    parking: true,
    availableFrom: "2024-02-15",
    contact: "+1 (555) 456-7890",
  },
  {
    id: "5",
    title: "Family-Friendly 4BR House",
    location: "Staten Island, NY",
    price: 3500,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    description:
      "Perfect for families with backyard. This spacious home features multiple bedrooms, updated kitchen, and a large backyard perfect for kids and pets.",
    amenities: [
      "Air Conditioning",
      "Dishwasher",
      "Laundry",
      "Parking",
      "Backyard",
      "Garage",
    ],
    balcony: 1,
    drawing: 2,
    dining: 1,
    kitchen: 1,
    gasType: "Natural Gas",
    lift: false,
    parking: true,
    availableFrom: "2024-02-20",
    contact: "+1 (555) 567-8901",
  },
  {
    id: "6",
    title: "Elegant 2BR Condo",
    location: "Manhattan, NY",
    price: 3200,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
    ],
    description:
      "Elegant condo with modern amenities. This beautifully designed condo features premium finishes, updated kitchen and bathrooms, and access to building amenities.",
    amenities: [
      "Air Conditioning",
      "Dishwasher",
      "Laundry",
      "Parking",
      "Gym Access",
      "Pool Access",
    ],
    balcony: 1,
    drawing: 1,
    dining: 1,
    kitchen: 1,
    gasType: "Natural Gas",
    lift: true,
    parking: true,
    availableFrom: "2024-01-25",
    contact: "+1 (555) 678-9012",
  },
];

export default function RentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState(
    mockRentPosts.find((p) => p.id === id) || mockRentPosts[0]
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const imageControlRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    rotate: () => void;
    rotateCounterClockwise: () => void;
    reset: () => void;
  } | null>(null);

  const images = post.images || [post.image];

  useEffect(() => {
    const foundPost = mockRentPosts.find((p) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setCurrentImageIndex(0);
    }
  }, [id]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const openImagePreview = (index: number) => {
    setPreviewImageIndex(index);
    setShowImagePreview(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 bg-white">
        {/* Image Slider */}
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
                onPress={() => openImagePreview(index)}
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
          >
            <Text className="text-xl">←</Text>
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

        {/* Content */}
        <View className="p-6">
          {/* Title and Price */}
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                {post.title}
              </Text>
              <Text className="text-gray-500 text-base">{post.location}</Text>
            </View>
            <View className="bg-indigo-50 px-4 py-3 rounded-xl ml-4">
              <Text className="text-indigo-600 font-bold text-2xl">
                ${post.price}
              </Text>
              <Text className="text-indigo-500 text-xs">/month</Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Description
            </Text>
            <Text className="text-gray-600 leading-6">{post.description}</Text>
          </View>

          {/* Property Features */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Property Features
            </Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              <View className="flex-row flex-wrap gap-3">
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <Ionicons name="bed-outline" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Bed:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.bedrooms}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="shower" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Bath:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.bathrooms}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="square-outline" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Area:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.area} sqft
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="balcony" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Balcony:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.balcony}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <Ionicons name="home-outline" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Drawing:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.drawing}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Dining:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.dining}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="chef-hat" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Kitchen:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.kitchen}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="fire" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Gas:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.gasType}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="elevator" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Lift:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.lift ? "Yes" : "No"}
                  </Text>
                </View>
                <View className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]">
                  <MaterialCommunityIcons name="car" size={20} color="#6366f1" />
                  <Text className="text-gray-600 text-sm ml-2 mr-2">Parking:</Text>
                  <Text className="text-gray-900 font-semibold text-sm">
                    {post.parking ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Amenities
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {post.amenities.map((amenity, index) => (
                <View key={index} className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <Text className="text-indigo-700 text-sm font-medium">
                    {amenity}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Additional Info */}
          <View className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600">Available From</Text>
              <Text className="text-gray-800 font-semibold">
                {dayjs(post.availableFrom).format("MMMM D, YYYY")}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Contact</Text>
              <Text className="text-indigo-600 font-semibold">
                {post.contact}
              </Text>
            </View>
          </View>

          {/* Contact Button */}
          <TouchableOpacity
            className="rounded-2xl overflow-hidden mb-8"
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
                Contact Owner
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
            <View className="flex-1">
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setShowImagePreview(false)}
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
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                  );
                  setPreviewImageIndex(index);
                  setResetKey((prev) => prev + 1); // Reset zoom when changing images
                  // Update control ref for new image
                  setTimeout(() => {
                    // Force re-render to update control ref
                  }, 100);
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
                    onPress={() =>
                      imageControlRef.current?.rotateCounterClockwise()
                    }
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
    </SafeAreaView>
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
