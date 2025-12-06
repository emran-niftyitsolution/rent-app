import ContactButton from "@/components/ContactButton";
import ImagePreviewer from "@/components/ImagePreviewer";
import PropertyAmenities from "@/components/PropertyAmenities";
import PropertyFeatures from "@/components/PropertyFeatures";
import PropertyImageSlider from "@/components/PropertyImageSlider";
import PropertyInfo from "@/components/PropertyInfo";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  const images = post.images || [post.image];

  useEffect(() => {
    const foundPost = mockRentPosts.find((p) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id]);

  const openImagePreview = (index: number) => {
    setPreviewImageIndex(index);
    setShowImagePreview(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Image Slider */}
        <PropertyImageSlider images={images} onImagePress={openImagePreview} />

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
          <PropertyFeatures
            area={post.area}
            bedrooms={post.bedrooms}
            bathrooms={post.bathrooms}
            balcony={post.balcony}
            drawing={post.drawing}
            dining={post.dining}
            kitchen={post.kitchen}
            gasType={post.gasType}
            lift={post.lift}
            parking={post.parking}
          />

          {/* Amenities */}
          <PropertyAmenities amenities={post.amenities} />

          {/* Additional Info */}
          <PropertyInfo
            availableFrom={post.availableFrom}
            contact={post.contact}
          />

          {/* Contact Button */}
          <ContactButton />
        </View>
      </ScrollView>

      {/* Image Previewer */}
      <ImagePreviewer
        images={images}
        visible={showImagePreview}
        initialIndex={previewImageIndex}
        onClose={() => setShowImagePreview(false)}
      />
    </SafeAreaView>
  );
}
