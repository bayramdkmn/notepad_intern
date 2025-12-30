import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddTagModal from "../../../components/modals/AddTagModal";
import { Note, Tag } from "../../../types";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useTagsStore } from "../../../store/tagsStore";
import { useNotesStore } from "../../../store/notesStore";
import Toast from "react-native-toast-message";

export const TagsSection = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userTags, getUserTags, deleteUserTag, updateTag } = useTagsStore();
  const { notes, fetchNotes } = useNotesStore();
  const [tags, setTags] = useState<Tag[]>(userTags);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedTagName, setEditedTagName] = useState("");
  const [isAddTagModalVisible, setIsAddTagModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [affectedNotes, setAffectedNotes] = useState<Note[]>([]);
  const [singleTagNotes, setSingleTagNotes] = useState<Note[]>([]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getUserTags();
      setTags(userTags);
    } catch (error) {
      console.error("Etiketler yenilenirken hata oluştu:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveTagName = async () => {
    if (selectedTag && editedTagName.trim()) {
      await updateTag({ ...selectedTag, name: editedTagName.trim() });
      fetchNotes();
      setTags((prevTags) =>
        prevTags.map((tag) =>
          tag.id === selectedTag.id
            ? { ...tag, name: editedTagName.trim() }
            : tag
        )
      );
      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Etiket güncellendi",
        position: "bottom",
      });
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

  const handleDeleteTag = (tag: Tag) => {
    const notesWithTag = notes.filter((note: Note) =>
      note.tags.some((t) => t.id === tag.id)
    );

    if (notesWithTag.length === 0) {
      setSelectedTag(tag);
      setAffectedNotes([]);
      setSingleTagNotes([]);
      setIsDeleteModalVisible(true);
      return;
    }

    const singleTag = notesWithTag.filter(
      (note: Note) => note.tags.length === 1
    );

    setSelectedTag(tag);
    setAffectedNotes(notesWithTag);
    setSingleTagNotes(singleTag);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTag) {
      try {
        await deleteUserTag(selectedTag.id);
        fetchNotes();
        setTags((prevTags) =>
          prevTags.filter((tag) => tag.id !== selectedTag.id)
        );
        setIsDeleteModalVisible(false);
        setSelectedTag(null);
        setAffectedNotes([]);
        setSingleTagNotes([]);
        setIsDeleteMode(false);
        Toast.show({
          type: "success",
          text1: "Başarılı",
          text2: "Etiket silindi",
          position: "bottom",
        });
      } catch (error) {
        console.error("Etiket silinirken hata oluştu:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedTag(null);
    setAffectedNotes([]);
    setSingleTagNotes([]);
    setIsDeleteMode(false);
  };

  const handleSubmitNewTag = (payload: { name: string }) => {
    const newTag: Tag = {
      id: Date.now(),
      name: payload.name,
    };
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const renderTagItem = ({ item: tag }: { item: Tag }) => (
    <View
      className={`bg-gray-50 flex flex-row dark:bg-gray-800 rounded-2xl p-4 border ${
        isEditMode
          ? "border-blue-500 dark:border-blue-400"
          : isDeleteMode
          ? "border-red-500 dark:border-red-400"
          : "border-gray-200 dark:border-gray-700"
      } gap-2 items-center`}
    >
      <AntDesign name="tag" size={20} color={isDark ? "white" : "black"} />
      <View className="flex-1 flex-col">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">
          {tag.name}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {tag.usage_count ? `${tag.usage_count} not` : "Henüz kullanılmamış"}
        </Text>
      </View>
      <View className="gap-10 flex flex-row">
        <MaterialIcons
          onPress={() => {
            setSelectedTag(tag);
            setEditedTagName(tag.name);
            setIsEditModalVisible(true);
          }}
          name="mode-edit"
          size={22}
          color="gray"
        />
        <Feather
          onPress={() => handleDeleteTag(tag)}
          name="trash"
          size={22}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 relative">
      <FlatList
        data={tags}
        renderItem={renderTagItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 100,
          gap: 8,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
          />
        }
      />

      {/* Add Tag Button */}
      <View className="absolute bottom-6 right-6 z-50">
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-12 w-12 rounded-full items-center justify-center bg-blue-500 dark:bg-blue-600 shadow-lg"
          onPress={() => setIsAddTagModalVisible(true)}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Edit Tag Modal */}
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

      {/* Delete Tag Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={isDeleteModalVisible}
        onRequestClose={handleCancelDelete}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            >
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

                  {/* Etkilenen notlar uyarısı */}
                  {affectedNotes.length > 0 && (
                    <View className="mt-4 w-full">
                      <View
                        className={`p-3 rounded-xl ${
                          isDark ? "bg-yellow-900/30" : "bg-yellow-50"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium mb-1 ${
                            isDark ? "text-yellow-400" : "text-yellow-800"
                          }`}
                        >
                          ⚠️ Bu etiket {affectedNotes.length} notta kullanılıyor
                        </Text>
                        {singleTagNotes.length > 0 && (
                          <Text
                            className={`text-sm ${
                              isDark ? "text-yellow-300" : "text-yellow-700"
                            }`}
                          >
                            {singleTagNotes.length} not yalnızca bu etikete
                            sahip ve etiketsiz kalacağı için not da silinecek!
                          </Text>
                        )}
                      </View>

                      {/* List single notes */}
                      {singleTagNotes.length > 0 && (
                        <View className="mt-3 max-h-32">
                          <Text
                            className={`text-sm font-medium mb-2 ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Silinecek notlar:
                          </Text>
                          <ScrollView
                            className={`border rounded-lg p-2 ${
                              isDark
                                ? "border-gray-700 bg-gray-900/50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            {singleTagNotes.map((note) => (
                              <Text
                                key={note.id}
                                className={`text-sm mb-1 ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                • {note.title}
                              </Text>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  )}

                  <Text
                    className={`text-center text-sm mt-3 ${
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
            </ScrollView>
          </KeyboardAvoidingView>
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

export default TagsSection;
