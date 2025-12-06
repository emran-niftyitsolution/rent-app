import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface PropertyFeaturesProps {
  area: number;
  bedrooms: number;
  bathrooms: number;
  balcony: number;
  drawing: number;
  dining: number;
  kitchen: number;
  gasType: string;
  lift: boolean;
  parking: boolean;
}

export default function PropertyFeatures({
  area,
  bedrooms,
  bathrooms,
  balcony,
  drawing,
  dining,
  kitchen,
  gasType,
  lift,
  parking,
}: PropertyFeaturesProps) {
  const features = [
    {
      icon: <MaterialCommunityIcons name="square-outline" size={20} color="#6366f1" />,
      label: "Area:",
      value: `${area} sqft`,
    },
    {
      icon: <Ionicons name="bed-outline" size={20} color="#6366f1" />,
      label: "Bed:",
      value: bedrooms.toString(),
    },
    {
      icon: <MaterialCommunityIcons name="shower" size={20} color="#6366f1" />,
      label: "Bath:",
      value: bathrooms.toString(),
    },
    {
      icon: <MaterialCommunityIcons name="balcony" size={20} color="#6366f1" />,
      label: "Balcony:",
      value: balcony.toString(),
    },
    {
      icon: <Ionicons name="home-outline" size={20} color="#6366f1" />,
      label: "Drawing:",
      value: drawing.toString(),
    },
    {
      icon: <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#6366f1" />,
      label: "Dining:",
      value: dining.toString(),
    },
    {
      icon: <MaterialCommunityIcons name="chef-hat" size={20} color="#6366f1" />,
      label: "Kitchen:",
      value: kitchen.toString(),
    },
    {
      icon: <MaterialCommunityIcons name="fire" size={20} color="#6366f1" />,
      label: "Gas:",
      value: gasType,
    },
    {
      icon: <MaterialCommunityIcons name="elevator" size={20} color="#6366f1" />,
      label: "Lift:",
      value: lift ? "Yes" : "No",
    },
    {
      icon: <MaterialCommunityIcons name="car" size={20} color="#6366f1" />,
      label: "Parking:",
      value: parking ? "Yes" : "No",
    },
  ];

  return (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-3">
        Property Features
      </Text>
      <View className="bg-gray-50 rounded-2xl p-4">
        <View className="flex-row flex-wrap gap-3">
          {features.map((feature, index) => (
            <View
              key={index}
              className="flex-row items-center bg-white px-4 py-3 rounded-xl flex-1 min-w-[45%]"
            >
              {feature.icon}
              <Text className="text-gray-600 text-sm ml-2 mr-2">
                {feature.label}
              </Text>
              <Text className="text-gray-900 font-semibold text-sm">
                {feature.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

