import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  type DimensionValue,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import OpenSortModal from "../../../components/modals/OpenSortModal";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FilterSlider from "../../../components/common/FilterSlider";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateRangeModal from "../../../components/modals/DateRangeModal";

export const NotesSection = () => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isDateRangeModalVisible, setIsDateRangeModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [selectedView, setSelectedView] = useState<"list" | "grid">("list");
  const { width } = useWindowDimensions();
  const columnCount = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const cardWidth: DimensionValue =
    selectedView === "list" ? "100%" : `${100 / columnCount - 2}%`;

  const handleOpenSortModal = () => {
    setIsSortModalVisible((prev) => !prev);
  };

  const filterOptions = [
    {
      id: "date",
      label: "Tarihe Göre",
      icon: "calendar-outline" as keyof typeof Ionicons.glyphMap,
      iconType: "ionicons" as const,
    },
    {
      id: "tags",
      label: "İşaretlenmiş Notlar",
      icon: "star-outline" as keyof typeof Ionicons.glyphMap,
      iconType: "ionicons" as const,
    },
    {
      id: "favorites",
      label: "İleri Tarihli Notlar",
      icon: "arrow-forward-outline" as keyof typeof Ionicons.glyphMap,
      iconType: "ionicons" as const,
    },
    {
      id: "pastNotes",
      label: "Geçmiş Tarihli Notlar",
      icon: "arrow-back-outline" as keyof typeof Ionicons.glyphMap,
      iconType: "ionicons" as const,
    },
  ];

  const handleFilterSelect = (id: string) => {
    if (id === "date") {
      if (!selectedFilters.includes(id)) {
        setSelectedFilters((prev) => [...prev, id]);
      }
      setIsDateRangeModalVisible(true);
    } else {
      setSelectedFilters((prev) => {
        if (prev.includes(id)) {
          return prev.filter((filterId) => filterId !== id);
        } else {
          return [...prev, id];
        }
      });
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setDateRange({});
    setIsDateRangeModalVisible(false);
  };

  const handleDateRangeSubmit = (range: {
    startDate?: string;
    endDate?: string;
  }) => {
    setDateRange(range);
    if (
      (range.startDate || range.endDate) &&
      !selectedFilters.includes("date")
    ) {
      setSelectedFilters((prev) => [...prev, "date"]);
    }
    if (!range.startDate && !range.endDate) {
      setSelectedFilters((prev) => prev.filter((id) => id !== "date"));
    }
    console.log("Date range selected:", range);
  };

  return (
    <View className="px-6 mt-8 gap-4">
      <View className="relative">
        <TextInput
          placeholder="Ara"
          className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 pl-10"
        />
        <Fontisto
          name="search"
          size={20}
          color="gray"
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            marginTop: -10,
            zIndex: 1,
          }}
        />
      </View>

      {/* Filter Slider */}
      <FilterSlider
        options={filterOptions}
        selectedIds={selectedFilters}
        onSelect={handleFilterSelect}
        onClear={handleClearFilters}
      />

      <View className="flex-row items-center px-2 pr-4 justify-between gap-2">
        <View className="flex-row gap-2">
          {/*Sort Buttons*/}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleOpenSortModal}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white flex-row items-center gap-2"
            >
              <MaterialCommunityIcons
                name="sort-ascending"
                size={20}
                color="gray"
              />
              <Text className="text-gray-900 dark:text-white text-base font-medium">
                Sırala
              </Text>
            </TouchableOpacity>
            <OpenSortModal
              visible={isSortModalVisible}
              onClose={handleOpenSortModal}
            />
          </View>
        </View>
        <View className="flex-row gap-3 items-center border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 bg-gray-50 dark:bg-gray-800">
          <TouchableOpacity
            onPress={() => setSelectedView("list")}
            className={`px-3 py-2 rounded-lg ${
              selectedView === "list"
                ? "bg-gray-200 dark:bg-gray-700 shadow-inner"
                : ""
            }`}
          >
            <SimpleLineIcons
              name="list"
              size={24}
              color={selectedView === "list" ? "#374151" : "gray"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedView("grid")}
            className={`px-3 py-2 rounded-lg ${
              selectedView === "grid"
                ? "bg-gray-200 dark:bg-gray-700 shadow-inner"
                : ""
            }`}
          >
            <SimpleLineIcons
              name="grid"
              size={22}
              color={selectedView === "grid" ? "#374151" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        className={`gap-y-3 ${
          selectedView === "grid"
            ? "flex-row flex-wrap justify-between"
            : "space-y-3"
        }`}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.7}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
            style={{ width: cardWidth }}
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
      <DateRangeModal
        visible={isDateRangeModalVisible}
        onClose={() => setIsDateRangeModalVisible(false)}
        onSubmit={handleDateRangeSubmit}
        initialStartDate={dateRange.startDate}
        initialEndDate={dateRange.endDate}
      />
    </View>
  );
};
