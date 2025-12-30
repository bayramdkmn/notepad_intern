import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Note } from "../../types";
import { BlurView } from "expo-blur";
import AddTagForNoteModal from "./AddTagForNoteModal";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNotesStore } from "../../store/notesStore";

type OpenNoteModalProps = {
  visible: boolean;
  onClose: () => void;
  note?: Note;
};

const PRIORITIES = ["High", "Medium", "Low"] as const;

const OpenNoteModal = ({ visible, onClose, note }: OpenNoteModalProps) => {
  const [editMode, setEditMode] = React.useState(false);
  const [selectPriority, setSelectPriority] = React.useState<
    "Low" | "Medium" | "High"
  >(note?.priority || "Low");
  const [title, setTitle] = React.useState(note?.title || "");
  const [content, setContent] = React.useState(note?.content || "");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isAddTagModalVisible, setIsAddTagModalVisible] = React.useState(false);
  const [deleteNote, setDeleteNote] = React.useState(false);

  React.useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setSelectPriority(note.priority || "Low");
    }
  }, [note]);

  const addTagsModalHandler = () => {
    setIsAddTagModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      useNotesStore.getState().deleteNote(note!.id);
    } catch (error) {
      console.error("Not silme hatası:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setSelectPriority(note?.priority || "Low");
    setShowDropdown(false);
  };

  const getPriorityDotStyle = (p: string) => ({
    width: 10,
    height: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor:
      p === "High" ? "#f87171" : p === "Medium" ? "#fcd34d" : "#6ee7b7",
  });

  const handleCloseModal = () => {
    setEditMode(false);
    setShowDropdown(false);
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setSelectPriority(note?.priority || "Low");
    onClose();
  };

  const getPriorityLabel = (p: string) =>
    p === "High" ? "Yüksek" : p === "Medium" ? "Orta" : "Düşük";

  const getPriorityBg = (p: string) =>
    p === "High"
      ? "bg-red-100 dark:bg-red-900/40"
      : p === "Medium"
      ? "bg-yellow-100 dark:bg-yellow-900/40"
      : "bg-green-100 dark:bg-green-900/40";

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={handleCloseModal}
    >
      <BlurView
        intensity={40}
        tint="dark"
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View className="flex-1 justify-center px-6">
          <View className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
            <View className="p-6">
              <View className="gap-2">
                {/* Header */}
                <View className="flex-row gap-4 items-center justify-between mb-3">
                  <View className="items-center flex flex-row gap-2 flex-1">
                    {editMode ? (
                      <View className="border-b border-gray-400 px-2 flex-1 pb-1 rounded-lg">
                        <TextInput
                          className="text-xl font-semibold color-black dark:color-white"
                          value={title}
                          onChangeText={setTitle}
                        />
                      </View>
                    ) : (
                      <Text className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
                        {note?.title || "Not Başlığı Bulunamadı"}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    className="bg-gray-100 p-1 rounded-full"
                  >
                    <Ionicons name="close-outline" size={24} color="gray" />
                  </TouchableOpacity>
                </View>

                {!editMode && (
                  <View className="border-t border-gray-200 dark:border-gray-700 mb-2" />
                )}

                {/* Priority & Date */}
                <View className="flex flex-row gap-4 items-center mb-2">
                  <View className="relative">
                    {editMode ? (
                      <>
                        <TouchableOpacity
                          onPress={() => setShowDropdown((p) => !p)}
                          className={`${getPriorityBg(
                            selectPriority
                          )} p-2 rounded-full flex-row items-center gap-2 border border-gray-200 dark:border-gray-700`}
                        >
                          <Text className="font-medium text-gray-900 dark:text-white">
                            {getPriorityLabel(selectPriority)}
                          </Text>
                          <Ionicons
                            name={showDropdown ? "chevron-up" : "chevron-down"}
                            size={12}
                            color="gray"
                          />
                        </TouchableOpacity>

                        {showDropdown && (
                          <View className="absolute top-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-52 z-20 shadow-xl overflow-hidden">
                            {PRIORITIES.map((p, idx) => (
                              <TouchableOpacity
                                key={p}
                                onPress={() => {
                                  setSelectPriority(p);
                                  setShowDropdown(false);
                                }}
                                className={`px-4 py-3 flex-row items-center justify-between ${
                                  idx < PRIORITIES.length - 1
                                    ? "border-b border-gray-200 dark:border-gray-700"
                                    : ""
                                } ${
                                  selectPriority === p
                                    ? "bg-blue-50 dark:bg-blue-900/30"
                                    : ""
                                }`}
                              >
                                <Text className="text-gray-900 dark:text-white">
                                  {getPriorityLabel(p)}
                                </Text>
                                {selectPriority === p && (
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={18}
                                    color="#3b82f6"
                                  />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </>
                    ) : (
                      <View
                        className={`${getPriorityBg(
                          note?.priority || "Low"
                        )} px-3 py-1 rounded-full flex-row items-center gap-2`}
                      >
                        <View
                          style={getPriorityDotStyle(note?.priority || "Low")}
                        />
                        <Text className="text-gray-900 dark:text-white font-medium">
                          {getPriorityLabel(note?.priority || "Low")}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text className="font-thin text-black dark:text-white text-xl">
                    |
                  </Text>

                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {note?.created_at
                      ? new Date(note.created_at).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Tarih Bulunamadı"}
                  </Text>
                </View>

                {!editMode && (
                  <View className="border-t border-gray-200 dark:border-gray-700" />
                )}
              </View>

              {/* Content */}
              <ScrollView
                className="max-h-48 my-4"
                contentContainerStyle={{
                  paddingVertical: 10,
                  paddingLeft: 2,
                }}
                showsVerticalScrollIndicator={false}
              >
                {editMode ? (
                  <TextInput
                    className="max-h-40 color-black dark:color-white scroll-auto text-base leading-6 border-b border-gray-400 p-1"
                    multiline
                    value={content}
                    onChangeText={setContent}
                  />
                ) : (
                  <Text className="text-gray-800 dark:text-gray-300 text-base leading-6  overflow-scroll ">
                    {note?.content || "Not içeriği bulunamadı."}
                  </Text>
                )}
              </ScrollView>

              {!editMode && (
                <View className="border-t py-1 border-gray-200 dark:border-gray-700" />
              )}

              {/* Tags (always visible) */}
              <View className="p-1 flex flex-row items-center">
                <Text className="text-gray-400 font-bold text-xs dark:text-white">
                  ETİKETLER{" "}
                </Text>
                {editMode ? (
                  <View className="flex flex-row justify-between items-center flex-1">
                    <FlatList
                      className="p-2"
                      data={note?.tags}
                      horizontal
                      keyExtractor={(item) => String(item.id)}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingTop: 8,
                        paddingBottom: 8,
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{ width: 6 }} />
                      )}
                      renderItem={({ item: tag }) => (
                        <View style={{ marginRight: 6 }} className="relative">
                          <View className="bg-blue-500 px-3 py-[0.4rem] rounded-full">
                            <Text className="text-white">{tag.name}</Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              /* TODO: remove tag (call your handler) */
                            }}
                            accessibilityLabel={`Remove tag ${tag.name}`}
                            style={{
                              position: "absolute",
                              right: -6,
                              top: -6,
                              width: 18,
                              height: 18,
                              borderRadius: 10,
                              backgroundColor: "#fff",
                              alignItems: "center",
                              justifyContent: "center",
                              elevation: 3,
                              shadowColor: "#000",
                              shadowOpacity: 0.12,
                              shadowRadius: 4,
                              shadowOffset: { width: 0, height: 4 },
                            }}
                          >
                            <Ionicons name="close" size={12} color="#333" />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                    <TouchableOpacity
                      onPress={addTagsModalHandler}
                      className="border rounded-full px-3 py-1 border-dashed border-gray-400"
                    >
                      <Text className="text-gray-500 text-base">+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FlatList
                    className="p-2"
                    data={note?.tags}
                    horizontal
                    keyExtractor={(item) => String(item.id)}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingTop: 8,
                      paddingBottom: 8,
                    }}
                    ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
                    renderItem={({ item: tag }) => (
                      <Text className="bg-gray-300 px-3 py-[0.4rem] rounded-full text-gray-700 text-sm">
                        {tag.name}
                      </Text>
                    )}
                  />
                )}
              </View>
            </View>
            <View className="bg-gray-100 dark:bg-gray-700/25 py-4 px-5 rounded-b-2xl">
              <View className="w-full flex flex-row justify-end gap-4">
                {!editMode && (
                  <View className="flex-1 flex-row gap-3 justify-end">
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Notu Sil",
                          "Bu notu silmek istediğinizden emin misiniz?",
                          [
                            {
                              text: "Hayır",
                              style: "cancel",
                            },
                            {
                              text: "Evet",
                              style: "destructive",
                              onPress: async () => {
                                await handleConfirmDelete();
                                handleCloseModal();
                                Alert.alert(
                                  "Not Silme İşlemi",
                                  "Not başarıyla silindi.",
                                  [
                                    {
                                      text: "Tamam",
                                    },
                                  ]
                                );
                              },
                            },
                          ],
                          { cancelable: true }
                        );
                      }}
                      className="bg-red-100 px-6 py-4 rounded-xl"
                    >
                      <Octicons name="trash" size={16} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setEditMode(true)}
                      className="bg-green-100 rounded-xl px-6 py-3 items-center justify-center flex"
                    >
                      <Feather name="edit" size={18} color="green" />
                    </TouchableOpacity>
                  </View>
                )}
                {editMode && (
                  <View className="flex-1 flex-row gap-3 py-2">
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      className="bg-gray-200 flex-row gap-1 py-4 px-6 rounded-xl items-center justify-center flex"
                    >
                      <Text>Vazgeç</Text>
                      <MaterialIcons name="cancel" size={16} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        // TODO: save changes here
                        setEditMode(false);
                        setShowDropdown(false);
                      }}
                      className="bg-blue-500 w-full flex-row gap-2 flex-1 rounded-xl items-center justify-center"
                    >
                      <Text className="text-white">Değişiklikleri Kaydet</Text>
                      <Feather name="check" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <AddTagForNoteModal
          visible={isAddTagModalVisible}
          onClose={() => setIsAddTagModalVisible(false)}
          note={note!}
        />
      </BlurView>
    </Modal>
  );
};

export default OpenNoteModal;
