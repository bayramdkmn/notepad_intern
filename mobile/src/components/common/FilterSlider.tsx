import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type FilterOption = {
  id: string;
  label: string;
  icon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconType?: "ionicons" | "material";
};

type FilterSliderProps = {
  options: FilterOption[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onClear?: () => void;
};

const FilterSlider = ({
  options,
  selectedIds,
  onSelect,
  onClear,
}: FilterSliderProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const hasSelectedFilters = selectedIds.length > 0;

  return (
    <View className="flex-row items-center gap-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <View className="flex-row gap-2">
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const IconComponent =
              option.iconType === "material"
                ? MaterialCommunityIcons
                : Ionicons;

            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => onSelect(option.id)}
                activeOpacity={0.7}
                className={`flex-row items-center gap-2 px-4 py-2.5 rounded-xl border ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <IconComponent
                  name={option.icon as any}
                  size={18}
                  color={
                    isSelected ? "#2563eb" : isDark ? "#9ca3af" : "#6b7280"
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      {hasSelectedFilters && onClear && (
        <TouchableOpacity
          onPress={onClear}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
          <Text
            className={`text-xs font-medium ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Temizle
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FilterSlider;
