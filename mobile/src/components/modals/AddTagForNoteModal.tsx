import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Note } from "../../types";
import { BlurView } from "expo-blur";
import { useNotesStore } from "../../store/notesStore";
import { Input } from "../common/Input";

type AddTagForNoteModalProps = {
  visible: boolean;
  onClose: () => void;
  note: Note;
  // onSubmit can receive new tag by name OR selected tag ids
  onSubmit?: (payload: { name?: string; ids?: number[] }) => void;
};

const AddTagForNoteModal = ({
  visible,
  onClose,
  note,
  onSubmit,
}: AddTagForNoteModalProps) => {
  const [name, setName] = useState("");
  const [openAddTag, setOpenAddTag] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const { userTags, getUserTags } = useNotesStore();

  const availableTags =
    userTags?.filter(
      (tag: any) => !note?.tags?.some((noteTag: any) => noteTag.id === tag.id)
    ) ?? [];

  const filteredTags = availableTags.filter((t: any) =>
    t.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    if (!visible) {
      setName("");
      setOpenAddTag(false);
      setQuery("");
      setSelectedTags([]);
      return;
    }
    getUserTags?.().catch((e: any) => console.error("getUserTags error", e));
  }, [visible]);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSaveSelected = () => {
    if (selectedTags.length === 0) return;
    onSubmit?.({ ids: selectedTags });
    setSelectedTags([]);
    onClose();
  };

  const handleSaveNewTag = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit?.({ name: trimmed });
    setName("");
    setOpenAddTag(false);
    // optionally refresh tags after creation
    getUserTags?.().catch(() => {});
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={30} style={{ flex: 1 }}>
        <View className="flex-1 bg-black/50 justify-center px-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {!openAddTag && (
              <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <View className="flex flex-col">
                  <View>
                    <Text className="font-bold text-lg text-gray-900 dark:text-white">
                      Mevcut Eklenebilecek Etiketleriniz
                    </Text>
                    <Text className="text-sm font-extralight mb-3">
                      Listeden birden fazla etiket seçip kaydet butonuna basın
                    </Text>

                    <View className="mb-3">
                      <Input
                        placeholder="Bir etiket ara..."
                        className="h-10 justify-center w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-1 mt-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                        value={query}
                        style={{ color: "#000" }}
                        placeholderTextColor="#9ca3af"
                        onChangeText={setQuery}
                      />
                    </View>

                    <ScrollView
                      horizontal={false}
                      contentContainerStyle={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                      showsVerticalScrollIndicator={false}
                      style={{ maxHeight: 220 }}
                    >
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag: any) => {
                          const selected = selectedTags.includes(tag.id);
                          return (
                            <TouchableOpacity
                              key={tag.id}
                              onPress={() => toggleTag(tag.id)}
                              style={[
                                styles.tag,
                                selected
                                  ? styles.tagSelected
                                  : styles.tagDefault,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.tagText,
                                  selected && styles.tagTextSelected,
                                ]}
                              >
                                {tag.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })
                      ) : (
                        <Text className="text-sm text-gray-500 py-1 px-2">
                          Uygun etiket yok
                        </Text>
                      )}
                    </ScrollView>
                  </View>

                  <View className="gap-2 flex flex-col mt-4">
                    <TouchableOpacity
                      className=" bg-green-500 items-center justify-center p-3 border border-gray-300 rounded-xl"
                      onPress={() => {
                        setOpenAddTag(true);
                        setName("");
                      }}
                    >
                      <Text className="text-white">Yeni Etiket Ekle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-blue-500 w-full rounded-lg p-3 items-center mt-2"
                      onPress={handleSaveSelected}
                      disabled={selectedTags.length === 0}
                    >
                      <Text className="text-white">
                        {selectedTags.length > 0
                          ? `Kaydet (${selectedTags.length})`
                          : "Kaydet"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className=" bg-gray-200 dark:bg-gray-700 items-center justify-center p-3 border border-gray-300 rounded-xl mt-2"
                      onPress={onClose}
                    >
                      <Text className="text-gray-900 dark:text-white">
                        Kapat
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {openAddTag && (
              <View className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-lg">
                <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Etiket Ekle
                </Text>
                <View className="gap-4">
                  <View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Etiket İsmi
                    </Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Etiket ismi"
                      className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800"
                      placeholderTextColor="#9ca3af"
                      style={{ color: "#000" }}
                      autoFocus
                    />
                  </View>
                </View>

                <View className="flex-row mt-6 gap-3">
                  <TouchableOpacity
                    onPress={() => setOpenAddTag(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 items-center"
                  >
                    <Text className="text-gray-600 dark:text-gray-300 font-medium">
                      Vazgeç
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveNewTag}
                    className="flex-1 py-3 rounded-xl bg-blue-500 dark:bg-blue-600 items-center disabled:opacity-40"
                    disabled={!name.trim()}
                  >
                    <Text className="text-white font-semibold">Kaydet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  tagDefault: {
    backgroundColor: "#3B82F6",
  },
  tagSelected: {
    backgroundColor: "#1E40AF",
  },
  tagText: {
    color: "#fff",
    fontSize: 14,
  },
  tagTextSelected: {
    fontWeight: "700",
  },
});

export default AddTagForNoteModal;
