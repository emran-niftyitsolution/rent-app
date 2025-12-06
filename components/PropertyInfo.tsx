import dayjs from "dayjs";
import { Text, View } from "react-native";

interface PropertyInfoProps {
  availableFrom: string;
  contact: string;
}

export default function PropertyInfo({ availableFrom, contact }: PropertyInfoProps) {
  return (
    <View className="mb-6 p-4 bg-gray-50 rounded-2xl">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-600">Available From</Text>
        <Text className="text-gray-800 font-semibold">
          {dayjs(availableFrom).format("MMMM D, YYYY")}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-600">Contact</Text>
        <Text className="text-indigo-600 font-semibold">{contact}</Text>
      </View>
    </View>
  );
}

