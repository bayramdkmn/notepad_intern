import React from "react";
import { View, Text } from "react-native";

const tags = [
  {
    name: "İş",
    description: "Toplantı, görev ve iş akışı notları",
  },
  {
    name: "Kişisel",
    description: "Günlük, alışveriş ve kişisel hedefler",
  },
  {
    name: "Önemli",
    description: "Unutulmaması gereken kritik notlar",
  },
];

export const TagsSection = () => {
  return (
    <View className="px-6 mt-8 space-y-4">
      <Text className="text-xl font-bold text-gray-900 dark:text-white">
        Etiketler
      </Text>
      {tags.map((tag) => (
        <View
          key={tag.name}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {tag.name}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {tag.description}
          </Text>
        </View>
      ))}
    </View>
  );
};
