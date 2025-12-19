import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";

type FilterModalsProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (filters: {
    onlyFuture: boolean;
    onlyStarred: boolean;
    startDate?: string;
    endDate?: string;
    onlyPast: boolean;
  }) => void;
};

const FilterModals = ({ visible, onClose, onSubmit }: FilterModalsProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [onlyFuture, setOnlyFuture] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [onlyPast, setOnlyPast] = useState(false);

  useEffect(() => {
    if (!visible) {
      setOnlyFuture(false);
      setOnlyStarred(false);
      setStartDate("");
      setEndDate("");
      setOnlyPast(false);
    }
  }, [visible]);

  const handleApply = () => {
    onSubmit?.({
      onlyFuture,
      onlyStarred,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
      onlyPast,
    });
    onClose();
  };

  const handleReset = () => {
    setOnlyFuture(false);
    setOnlyStarred(false);
    setStartDate("");
    setEndDate("");
    setOnlyPast(false);
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
                Filtreler
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-4">
                {/* Yalnızca ileri tarihli */}
                <View
                  className={`rounded-xl p-4 border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={isDark ? "white" : "black"}
                      />
                      <View className="flex-1">
                        <Text
                          className={`text-base font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Yalnızca ileri tarihli
                        </Text>
                        <Text
                          className={`text-sm mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Sadece gelecek tarihli notları göster
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={onlyFuture}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.9 }] }}
                      onValueChange={setOnlyFuture}
                      trackColor={{
                        false: isDark ? "#374151" : "#d1d5db",
                        true: "#3b82f6",
                      }}
                      thumbColor={onlyFuture ? "#ffffff" : "#f3f4f6"}
                    />
                  </View>
                </View>

                {/* Yalnızca Geçmiş Tarihli */}
                <View
                  className={`rounded-xl p-4 border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={isDark ? "white" : "black"}
                      />
                      <View className="flex-1">
                        <Text
                          className={`text-base font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Yalnızca Geçmiş Tarihli
                        </Text>
                        <Text
                          className={`text-sm mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Sadece geçmiş tarihli notları göster
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={onlyPast}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.9 }] }}
                      onValueChange={setOnlyPast}
                      trackColor={{
                        false: isDark ? "#374151" : "#d1d5db",
                        true: "#3b82f6",
                      }}
                      thumbColor={onlyPast ? "#ffffff" : "#f3f4f6"}
                    />
                  </View>
                </View>

                {/* Yalnızca İşaretlenmiş */}
                <View
                  className={`rounded-xl p-4 border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Ionicons
                        name="star-outline"
                        size={20}
                        color={isDark ? "white" : "black"}
                      />
                      <View className="flex-1">
                        <Text
                          className={`text-base font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Yalnızca İşaretlenmiş
                        </Text>
                        <Text
                          className={`text-sm mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Sadece yıldızlı notları göster
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={onlyStarred}
                      onValueChange={setOnlyStarred}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.9 }] }}
                      trackColor={{
                        false: isDark ? "#374151" : "#d1d5db",
                        true: "#3b82f6",
                      }}
                      thumbColor={onlyStarred ? "#ffffff" : "#f3f4f6"}
                    />
                  </View>
                </View>

                {/* Belirli tarih aralığı */}
                <View
                  className={`rounded-xl p-4 border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={isDark ? "white" : "black"}
                    />
                    <Text
                      className={`text-base font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Belirli Tarih Aralığı
                    </Text>
                  </View>
                  <View className="gap-3">
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
                            ? "border-gray-600 text-white bg-gray-800"
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
                            ? "border-gray-600 text-white bg-gray-800"
                            : "border-gray-300 text-gray-900 bg-white"
                        }`}
                        placeholderTextColor={isDark ? "#9ca3af" : "#9ca3af"}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Butonlar */}
            <View className="flex-row gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={handleReset}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  isDark ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <Text
                  className={`font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Sıfırla
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

export default FilterModals;
