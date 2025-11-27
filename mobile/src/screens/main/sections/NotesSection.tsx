import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const NotesSection = () => {
  return (
    <View className="px-6 mt-8">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Son Notlar
      </Text>
      <View className="space-y-3">
        {[1, 2, 3].map((item) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.7}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Not Başlığı {item}
            </Text>
            <Text
              className="text-sm text-gray-600 dark:text-gray-400"
              numberOfLines={2}
            >
              Bu bir örnek not içeriğidir. Burada notun özeti görünecek...
            </Text>
            <View className="flex-row mt-3">
              <View className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full mr-2">
                <Text className="text-xs text-blue-600 dark:text-blue-400">
                  İş
                </Text>
              </View>
              <View className="bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">
                <Text className="text-xs text-purple-600 dark:text-purple-400">
                  Önemli
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
