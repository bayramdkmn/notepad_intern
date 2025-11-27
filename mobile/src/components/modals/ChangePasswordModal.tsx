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

type ChangePasswordModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => void;
};

const ChangePasswordModal = ({
  visible,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!visible) {
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [visible]);

  const handleSave = () => {
    onSubmit?.({ currentPassword, newPassword });
    onClose();
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
              Şifremi Değiştir
            </Text>
            <View className="gap-4">
              <View>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Mevcut Şifre
                </Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="********"
                  className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />
              </View>
              <View>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Yeni Şifre
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="********"
                  className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
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
                disabled={!currentPassword || !newPassword}
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

export default ChangePasswordModal;
