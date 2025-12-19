import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type AddTagModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (payload: { name: string }) => void;
};

const AddTagModal = ({ visible, onClose, onSubmit }: AddTagModalProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!visible) {
      setName("");
    }
  }, [visible]);

  const handleSave = () => {
    if (name.trim()) {
      onSubmit?.({ name: name.trim() });
      onClose();
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center px-6">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
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
                  className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  placeholderTextColor="#9ca3af"
                  autoFocus
                />
              </View>
            </View>
            <View className="flex-row mt-6 gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 items-center"
              >
                <Text className="text-gray-600 dark:text-gray-300 font-medium">
                  Vazgeç
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 py-3 rounded-xl bg-blue-500 dark:bg-blue-600 items-center disabled:opacity-40"
                disabled={!name.trim()}
              >
                <Text className="text-white font-semibold">Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddTagModal;
