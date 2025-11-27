import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";

type DateRangeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (dateRange: { startDate?: string; endDate?: string }) => void;
  initialStartDate?: string;
  initialEndDate?: string;
};

const DateRangeModal = ({
  visible,
  onClose,
  onSubmit,
  initialStartDate,
  initialEndDate,
}: DateRangeModalProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [startDate, setStartDate] = useState(initialStartDate || "");
  const [endDate, setEndDate] = useState(initialEndDate || "");

  useEffect(() => {
    if (visible) {
      setStartDate(initialStartDate || "");
      setEndDate(initialEndDate || "");
    }
  }, [visible, initialStartDate, initialEndDate]);

  const handleApply = () => {
    onSubmit?.({
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
    });
    onClose();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
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
          <View
            className={`rounded-2xl shadow-lg p-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Tarih Aralığı Seç
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text
                  className={`text-sm mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Başlangıç Tarihi
                </Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="GG.AA.YYYY"
                  className={`border rounded-xl px-4 py-3 ${
                    isDark
                      ? "border-gray-600 text-white bg-gray-700"
                      : "border-gray-300 text-gray-900 bg-white"
                  }`}
                  placeholderTextColor={isDark ? "#9ca3af" : "#9ca3af"}
                />
              </View>
              <View>
                <Text
                  className={`text-sm mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Bitiş Tarihi
                </Text>
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="GG.AA.YYYY"
                  className={`border rounded-xl px-4 py-3 ${
                    isDark
                      ? "border-gray-600 text-white bg-gray-700"
                      : "border-gray-300 text-gray-900 bg-white"
                  }`}
                  placeholderTextColor={isDark ? "#9ca3af" : "#9ca3af"}
                />
              </View>
            </View>

            <View className="flex-row gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={handleClear}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  isDark ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <Text
                  className={`font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Temizle
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="flex-1 py-3 rounded-xl bg-blue-500 dark:bg-blue-600 items-center"
              >
                <Text className="text-white font-semibold">Uygula</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DateRangeModal;
