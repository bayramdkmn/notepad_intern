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
import { User } from "../../types";

type EditUserModalProps = {
  visible: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit?: (payload: { name: string; email: string }) => void;
};

const EditUserModal = ({
  visible,
  onClose,
  user,
  onSubmit,
}: EditUserModalProps) => {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  useEffect(() => {
    if (visible) {
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
    }
  }, [visible, user]);

  const handleSave = () => {
    onSubmit?.({ name, email });
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
              Hesabımı Düzenle
            </Text>
            <View className="gap-4">
              <View>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  İsim
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ad Soyad"
                  className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />
              </View>
              <View>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  E-posta
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="kullanici@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                disabled={!name || !email}
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

export default EditUserModal;
