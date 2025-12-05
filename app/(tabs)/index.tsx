import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for rent posts
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
    description: "Beautiful modern apartment with great amenities",
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
    description: "Perfect for students or young professionals",
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
    description: "Stunning views and premium finishes",
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
    description: "Industrial style loft with high ceilings",
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
    description: "Perfect for families with backyard",
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
    description: "Elegant condo with modern amenities",
  },
];

interface Filters {
  minPrice: string;
  maxPrice: string;
  bedrooms: number | null;
  bathrooms: number | null;
  location: string;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    minPrice: "",
    maxPrice: "",
    bedrooms: null,
    bathrooms: null,
    location: "",
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/rent-details/${postId}`);
  };

  const handleFilterChange = (
    key: keyof Filters,
    value: string | number | null
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      bedrooms: null,
      bathrooms: null,
      location: "",
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.bedrooms !== null) count++;
    if (filters.bathrooms !== null) count++;
    if (filters.location) count++;
    return count;
  }, [filters]);

  const filteredPosts = useMemo(() => {
    return mockRentPosts.filter((post) => {
      if (filters.minPrice && post.price < parseInt(filters.minPrice))
        return false;
      if (filters.maxPrice && post.price > parseInt(filters.maxPrice))
        return false;
      if (filters.bedrooms !== null && post.bedrooms !== filters.bedrooms)
        return false;
      if (filters.bathrooms !== null && post.bathrooms !== filters.bathrooms)
        return false;
      if (
        filters.location &&
        !post.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filters]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Rently</Text>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="filter" size={24} color="#374151" />
            {activeFiltersCount > 0 && (
              <View className="bg-indigo-500 rounded-full w-5 h-5 items-center justify-center -ml-1">
                <Text className="text-white text-xs font-bold">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Rent Listings */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredPosts.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-6xl mb-4">🏠</Text>
            <Text className="text-gray-600 text-lg font-semibold mb-2">
              No properties found
            </Text>
            <Text className="text-gray-400 text-sm text-center">
              Try adjusting your filters to see more results
            </Text>
            <TouchableOpacity
              onPress={clearFilters}
              className="mt-4 bg-indigo-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              onPress={() => handlePostPress(post.id)}
              className="bg-white rounded-2xl mb-4 overflow-hidden shadow-md"
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: post.image }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <View className="p-4">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800 mb-1">
                      {post.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {post.location}
                    </Text>
                  </View>
                  <View className="bg-indigo-50 px-3 py-1 rounded-lg">
                    <Text className="text-indigo-600 font-bold text-lg">
                      ${post.price}
                    </Text>
                    <Text className="text-indigo-500 text-xs">/month</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4 mt-3">
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-sm">🛏️</Text>
                    <Text className="text-gray-600 text-sm ml-1">
                      {post.bedrooms} bed
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-sm">🚿</Text>
                    <Text className="text-gray-600 text-sm ml-1">
                      {post.bathrooms} bath
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-sm">📐</Text>
                    <Text className="text-gray-600 text-sm ml-1">
                      {post.area} sqft
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowFilters(false)}
          />
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <SafeAreaView edges={["bottom"]}>
              {/* Modal Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-bold text-gray-800">
                  Filters
                </Text>
                <TouchableOpacity
                  onPress={() => setShowFilters(false)}
                  className="w-8 h-8 items-center justify-center"
                >
                  <Text className="text-2xl text-gray-400">✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Price Range */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Price Range
                  </Text>
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-sm text-gray-600 mb-2">
                        Min Price
                      </Text>
                      <TextInput
                        className="h-12 bg-gray-50 rounded-xl px-4 border-2 border-gray-200 text-gray-800"
                        placeholder="$0"
                        value={filters.minPrice}
                        onChangeText={(value) =>
                          handleFilterChange("minPrice", value)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-gray-600 mb-2">
                        Max Price
                      </Text>
                      <TextInput
                        className="h-12 bg-gray-50 rounded-xl px-4 border-2 border-gray-200 text-gray-800"
                        placeholder="$10000"
                        value={filters.maxPrice}
                        onChangeText={(value) =>
                          handleFilterChange("maxPrice", value)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* Bedrooms */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Bedrooms
                  </Text>
                  <View className="flex-row gap-2">
                    {[null, 1, 2, 3, 4].map((bed) => (
                      <TouchableOpacity
                        key={bed ?? "any"}
                        onPress={() => handleFilterChange("bedrooms", bed)}
                        className={`flex-1 h-12 rounded-xl items-center justify-center border-2 ${
                          filters.bedrooms === bed
                            ? "bg-indigo-500 border-indigo-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <Text
                          className={`font-semibold ${
                            filters.bedrooms === bed
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {bed === null ? "Any" : `${bed}+`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Bathrooms */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Bathrooms
                  </Text>
                  <View className="flex-row gap-2">
                    {[null, 1, 2, 3].map((bath) => (
                      <TouchableOpacity
                        key={bath ?? "any"}
                        onPress={() => handleFilterChange("bathrooms", bath)}
                        className={`flex-1 h-12 rounded-xl items-center justify-center border-2 ${
                          filters.bathrooms === bath
                            ? "bg-indigo-500 border-indigo-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <Text
                          className={`font-semibold ${
                            filters.bathrooms === bath
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {bath === null ? "Any" : `${bath}+`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Location */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Location
                  </Text>
                  <TextInput
                    className="h-12 bg-gray-50 rounded-xl px-4 border-2 border-gray-200 text-gray-800"
                    placeholder="Search location..."
                    value={filters.location}
                    onChangeText={(value) =>
                      handleFilterChange("location", value)
                    }
                  />
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-4 pt-4 border-t border-gray-200">
                <TouchableOpacity
                  onPress={clearFilters}
                  className="flex-1 h-12 bg-gray-100 rounded-xl items-center justify-center"
                >
                  <Text className="text-gray-700 font-semibold">Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={applyFilters}
                  className="flex-1 h-12 bg-indigo-500 rounded-xl items-center justify-center"
                >
                  <Text className="text-white font-semibold">
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
