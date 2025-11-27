import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { useColorScheme } from "nativewind";

export type SidebarScreen = "Notes" | "Tags" | "Settings" | "Profile";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  screen: SidebarScreen;
}

interface SidebarProps {
  currentScreen: SidebarScreen;
  onSelectScreen: (screen: SidebarScreen) => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const handleNavigate = (screen: SidebarScreen) => {
    onSelectScreen(screen);
  };

  const handleLogout = async () => {
    await logout();
  };
  const menuItems: MenuItem[] = [
    {
      id: "1",
      title: "Notlar",
      icon: (
        <MaterialCommunityIcons
          name="notebook"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      screen: "Notes",
    },
    {
      id: "2",
      title: "Etiketler",
      icon: (
        <FontAwesome6
          name="tags"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      screen: "Tags",
    },
    {
      id: "3",
      title: "Ayarlar",
      icon: (
        <MaterialIcons
          name="settings"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      screen: "Settings",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["left"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Notepad AI
          </Text>
          {onClose && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Menüyü kapat"
              onPress={onClose}
              className="w-10 h-10 rounded-full items-center justify-center active:bg-gray-100 dark:active:bg-gray-800"
            >
              <Text className="text-xl">✖️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Items */}
        <ScrollView className="flex-1 py-4">
          {menuItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <View key={item.id} className="mb-2 px-4">
                <TouchableOpacity
                  onPress={() => handleNavigate(item.screen)}
                  activeOpacity={0.7}
                  className={` mb-2 px-4 py-3 rounded-xl flex-row items-center ${
                    isActive
                      ? "bg-gray-200 dark:bg-blue-900/30"
                      : "bg-transparent active:bg-gray-100 dark:active:bg-gray-800"
                  }`}
                >
                  <Text className="text-2xl mr-3">{item.icon}</Text>
                  <Text
                    className={`text-base font-medium ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
                <View className="border-b border-gray-300 dark:border-gray-500 w-full " />
              </View>
            );
          })}
        </ScrollView>

        {/* New Note Button */}
        <View className="px-6 pb-4">
          <TouchableOpacity
            onPress={() => {
              // TODO: Yeni not oluşturma modal'ı açılacak
              console.log("Yeni not oluştur");
            }}
            activeOpacity={0.8}
            className="bg-blue-500 dark:bg-blue-600 py-3.5 px-4 rounded-xl flex-row items-center justify-center active:bg-blue-600 dark:active:bg-blue-700"
          >
            <Text className="text-lg mr-2">📄</Text>
            <Text className="text-white font-semibold text-base">
              Yeni Not Oluştur
            </Text>
          </TouchableOpacity>
        </View>

        {/* User Profile */}
        <View
          className={`px-6 py-4 border-t border-gray-200 dark:border-gray-800 ${
            currentScreen === "Profile" ? "bg-gray-100 dark:bg-blue-900/30" : ""
          }`}
        >
          <TouchableOpacity
            onPress={() => handleNavigate("Profile")}
            activeOpacity={0.7}
            className="flex-row items-center"
          >
            <Feather name="user" size={24} color={isDark ? "white" : "black"} />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || "Kullanıcı"}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || "user@example.com"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
