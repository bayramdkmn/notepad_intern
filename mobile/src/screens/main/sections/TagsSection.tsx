import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddTagModal from "../../../components/modals/AddTagModal";

type Tag = {
  id: string;
  name: string;
  count?: number;
};

const initialTags: Tag[] = [
  {
    id: "1",
    name: "İş",
    count: 10,
  },
  {
    id: "2",
    name: "Kişisel",
    count: 5,
  },
  {
    id: "3",
    name: "Önemli",
    count: 3,
  },
  {
    id: "4",
    name: "İş",
    count: 10,
  },
  {
    id: "5",
    name: "Kişisel",
    count: 5,
  },
  {
    id: "6",
    name: "Önemli",
    count: 3,
  },
  {
    id: "7",
    name: "İş",
    count: 10,
  },
  {
    id: "8",
    name: "Kişisel",
    count: 5,
  },
  {
    id: "9",
    name: "Önemli",
    count: 3,
  },
  {
    id: "10",
    name: "İş",
    count: 10,
  },
  {
    id: "11",
    name: "Kişisel",
    count: 5,
  },
  {
    id: "12",
    name: "Önemli",
    count: 3,
  },
];

export const TagsSection = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedTagName, setEditedTagName] = useState("");
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [isAddTagModalVisible, setIsAddTagModalVisible] = useState(false);

  useEffect(() => {
    if (isMenuVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isMenuVisible, scaleAnim, opacityAnim]);

  const handleEdit = () => {
    setIsMenuVisible(false);
    setIsEditMode(true);
  };

  const handleDelete = () => {
    setIsMenuVisible(false);
    setIsDeleteMode(true);
  };

  const handleTagPress = (tag: Tag) => {
    if (isEditMode) {
      setSelectedTag(tag);
      setEditedTagName(tag.name);
      setIsEditModalVisible(true);
    } else if (isDeleteMode) {
      setSelectedTag(tag);
      setIsDeleteModalVisible(true);
    }
  };

  const handleSaveTagName = () => {
    if (selectedTag && editedTagName.trim()) {
      setTags((prevTags) =>
        prevTags.map((tag) =>
          tag.id === selectedTag.id
            ? { ...tag, name: editedTagName.trim() }
            : tag
        )
      );
      setIsEditModalVisible(false);
      setSelectedTag(null);
      setEditedTagName("");
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setSelectedTag(null);
    setEditedTagName("");
    setIsEditMode(false);
  };

  const handleConfirmDelete = () => {
    if (selectedTag) {
      setTags((prevTags) =>
        prevTags.filter((tag) => tag.id !== selectedTag.id)
      );
      setIsDeleteModalVisible(false);
      setSelectedTag(null);
      setIsDeleteMode(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedTag(null);
    setIsDeleteMode(false);
  };

  const handleAddTag = () => {
    setIsMenuVisible(false);
    setIsAddTagModalVisible(true);
  };

  const handleSubmitNewTag = (payload: { name: string }) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name: payload.name,
    };
    setTags((prevTags) => [...prevTags, newTag]);
  };

  return (
    <View className="flex-1 relative">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 100,
        }}
      >
        <View className="space-y-4 gap-2">
          {isEditMode && (
            <View className="mb-4 px-2">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Düzenlemek için bir etiket seçin
              </Text>
            </View>
          )}
          {isDeleteMode && (
            <View className="mb-4 px-2 flex-row justify-between">
              <Text className="text-sm text-red-600 dark:text-red-400">
                Silmek için bir etiket seçin
              </Text>
              <TouchableOpacity
                onPress={() => setIsDeleteMode(false)}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">İptal</Text>
              </TouchableOpacity>
            </View>
          )}
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              onPress={() => handleTagPress(tag)}
              activeOpacity={isEditMode || isDeleteMode ? 0.7 : 1}
              disabled={!isEditMode && !isDeleteMode}
            >
              <View
                className={`bg-gray-50 flex flex-row dark:bg-gray-800 rounded-2xl p-4 border ${
                  isEditMode
                    ? "border-blue-500 dark:border-blue-400"
                    : isDeleteMode
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-200 dark:border-gray-700"
                } gap-2 items-center ${
                  isEditMode || isDeleteMode ? "opacity-100" : "opacity-100"
                }`}
              >
                <AntDesign
                  name="tag"
                  size={20}
                  color={isDark ? "white" : "black"}
                />
                <View className="flex-1 flex-col">
                  <Text className="text-base font-semibold text-gray-900 dark:text-white">
                    {tag.name}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {tag.count ? `${tag.count} not` : "Henüz kullanılmamış"}
                  </Text>
                </View>
                {(isEditMode || isDeleteMode) && (
                  <Ionicons
                    name={
                      isDeleteMode ? "trash-outline" : "chevron-forward-outline"
                    }
                    size={20}
                    color={
                      isDeleteMode ? "#ef4444" : isDark ? "white" : "black"
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {isMenuVisible && (
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
          <View className="absolute top-0 left-0 right-0 bottom-0 z-40" />
        </TouchableWithoutFeedback>
      )}
      <View className="absolute bottom-6 right-6 z-50">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            position: "absolute",
            bottom: 50,
            right: 20,
            width: 150,
          }}
          pointerEvents={isMenuVisible ? "auto" : "none"}
        >
          <View
            className={`rounded-2xl shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            } border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } overflow-hidden`}
          >
            <TouchableOpacity
              onPress={handleAddTag}
              activeOpacity={0.7}
              className={`flex-row items-center px-4 py-3 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Ionicons
                name="add-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text
                className={`ml-3 text-base ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Etiket Ekle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEdit}
              activeOpacity={0.7}
              className={`flex-row items-center px-4 py-3 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={isDark ? "white" : "black"}
              />
              <Text
                className={`ml-3 text-base ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Düzenle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.7}
              className="flex-row items-center px-4 py-3"
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text className="ml-3 text-base text-red-500">Sil</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-12 w-12 rounded-full items-center justify-center bg-blue-500 dark:bg-blue-600 shadow-lg"
          onPress={() => setIsMenuVisible(!isMenuVisible)}
        >
          <Ionicons
            name={isMenuVisible ? "close" : "add"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <Modal
        transparent
        animationType="fade"
        visible={isEditModalVisible}
        onRequestClose={handleCancelEdit}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View
              className={`rounded-2xl shadow-lg p-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <Text
                className={`text-xl font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Etiket İsmini Düzenle
              </Text>
              <View className="gap-4">
                <View>
                  <Text
                    className={`text-sm mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Etiket İsmi
                  </Text>
                  <TextInput
                    value={editedTagName}
                    onChangeText={setEditedTagName}
                    placeholder="Etiket ismi"
                    className={`border rounded-xl px-4 py-3 ${
                      isDark
                        ? "border-gray-700 text-white bg-gray-700"
                        : "border-gray-200 text-gray-900 bg-white"
                    }`}
                    placeholderTextColor={isDark ? "#9ca3af" : "#9ca3af"}
                    autoFocus
                  />
                </View>
              </View>
              <View className="flex-row mt-6 gap-3">
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  className={`flex-1 py-3 rounded-xl border items-center ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Vazgeç
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveTagName}
                  className="flex-1 py-3 rounded-xl bg-blue-500 dark:bg-blue-600 items-center disabled:opacity-40"
                  disabled={!editedTagName.trim()}
                >
                  <Text className="text-white font-semibold">Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={isDeleteModalVisible}
        onRequestClose={handleCancelDelete}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View
            className={`rounded-2xl shadow-lg p-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-4">
                <Ionicons name="trash-outline" size={32} color="#ef4444" />
              </View>
              <Text
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Etiketi Sil
              </Text>
              <Text
                className={`text-center text-base ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                "{selectedTag?.name}" etiketini silmek istediğinize emin
                misiniz?
              </Text>
              <Text
                className={`text-center text-sm mt-2 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Bu işlem geri alınamaz.
              </Text>
            </View>
            <View className="flex-row mt-6 gap-3">
              <TouchableOpacity
                onPress={handleCancelDelete}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Text
                  className={`font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Vazgeç
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 dark:bg-red-600 items-center"
              >
                <Text className="text-white font-semibold">Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <AddTagModal
        visible={isAddTagModalVisible}
        onClose={() => setIsAddTagModalVisible(false)}
        onSubmit={handleSubmitNewTag}
      />
    </View>
  );
};
