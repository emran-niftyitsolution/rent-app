import { Text, View } from "react-native";

interface PropertyAmenitiesProps {
  amenities: string[];
}

export default function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-3">Amenities</Text>
      <View className="flex-row flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <View key={index} className="bg-indigo-50 px-4 py-2 rounded-lg">
            <Text className="text-indigo-700 text-sm font-medium">{amenity}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

