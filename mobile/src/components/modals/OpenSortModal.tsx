import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type OpenSortModalProps = {
  visible: boolean;
  onClose: () => void;
};

const OpenSortModal = ({ visible, onClose }: OpenSortModalProps) => {
  const sortItems = [
    {
      id: "1",
      name: "Eklenme Tarihine Göre En Yeni",
      icon: "sort-ascending",
    },
    {
      id: "2",
      name: "Eklenme Tarihine Göre En Eski",
      icon: "sort-descending",
    },
  ];
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end px-6">
        <View className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-lg absolute bottom-0 left-0 right-0">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sırala
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            {sortItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center gap-3 mb-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <MaterialCommunityIcons
                  name={
                    item.icon as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={24}
                  color="gray"
                />
                <Text className="text-gray-900 dark:text-white text-base font-medium">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default OpenSortModal;
