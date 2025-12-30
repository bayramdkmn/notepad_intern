import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  type DimensionValue,
  ScrollView,
  RefreshControl,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import OpenSortModal from "../../../components/modals/OpenSortModal";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FilterSlider from "../../../components/common/FilterSlider";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateRangeModal from "../../../components/modals/DateRangeModal";
import { useNotesStore } from "../../../store/notesStore";
import OpenNoteModal from "../../../components/modals/OpenNoteModal";
import { Note } from "../../../types";

export const NotesSection = () => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isDateRangeModalVisible, setIsDateRangeModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  const notesStore = useNotesStore();
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
  };

  const handlePinnedNote = async (noteId: number) => {
    try {
      await notesStore.pinnedNote(noteId);
    } catch (error) {
      console.error("Not pinlenirken hata oluştu:", error);
    }
  };

  const handleOpenNoteModal = (note: Note) => {
    setSelectedNote(note);
    setIsNoteModalVisible(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalVisible(false);
    setSelectedNote(undefined);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await notesStore.fetchNotes();
    } catch (error) {
      console.error("Notlar yenilenirken hata oluştu:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3b82f6"
          colors={["#3b82f6"]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
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
          {notesStore.notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              activeOpacity={0.7}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
              style={{ width: cardWidth }}
              onPress={() => handleOpenNoteModal(note)}
            >
              <TouchableOpacity
                onPress={() => handlePinnedNote(note.id)}
                className="absolute top-[-5] right-0 mx-3"
              >
                <Fontisto
                  name={note.is_pinned ? "bookmark-alt" : "bookmark"}
                  size={40}
                  color="green"
                />
              </TouchableOpacity>
              <View className="flex justify-between flex-row">
                <View className="flex flex-row gap-3 items-center">
                  <Text>{note.title}</Text>
                  <View
                    className={`${
                      note.priority == "High"
                        ? "bg-red-100 text-red-500 dark:bg-red-900/40"
                        : note.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-500 dark:bg-yellow-900/40"
                        : "bg-green-100 text-green-500 dark:bg-green-900/40"
                    } px-2 py-1 rounded-full`}
                  >
                    <Text>
                      {note.priority == "High"
                        ? "!!!"
                        : note.priority == "Medium"
                        ? "!!"
                        : "!"}
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                className="text-sm text-gray-600 dark:text-gray-400"
                numberOfLines={2}
              >
                {note.content ? note.content : "Not içeriğine ulaşılamadı."}
              </Text>

              {/* Tags and Date */}
              <View className="flex-row mt-3 justify-between items-center">
                <View className="flex flex-row gap-2">
                  {note.tags.length > 0 &&
                    note.tags.slice(0, 3).map((tag) => (
                      <View
                        key={tag.id}
                        className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full"
                      >
                        <Text className="text-xs text-blue-600 dark:text-blue-400">
                          {tag.name}
                        </Text>
                      </View>
                    ))}
                  {note.tags.length > 3 && (
                    <View className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                      <Text className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        +{note.tags.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(note.created_at).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <OpenNoteModal
          visible={isNoteModalVisible}
          onClose={handleCloseNoteModal}
          note={selectedNote}
        />

        <DateRangeModal
          visible={isDateRangeModalVisible}
          onClose={() => setIsDateRangeModalVisible(false)}
          onSubmit={handleDateRangeSubmit}
          initialStartDate={dateRange.startDate}
          initialEndDate={dateRange.endDate}
        />
      </View>
    </ScrollView>
  );
};
