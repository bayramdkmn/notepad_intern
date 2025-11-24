import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useAuth } from "../../context/AuthContext";

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  screen: string;
}

const menuItems: MenuItem[] = [
  { id: "1", title: "Notlar", icon: "📝", screen: "Notes" },
  { id: "2", title: "Etiketler", icon: "🏷️", screen: "Tags" },
  { id: "3", title: "Ayarlar", icon: "⚙️", screen: "Settings" },
];

export const Sidebar: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, logout } = useAuth();
  const currentRoute = props.state.routes[props.state.index].name;

  const handleNavigate = (screen: string) => {
    props.navigation.navigate(screen);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["left"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Notepad AI
          </Text>
        </View>

        {/* Menu Items */}
        <ScrollView className="flex-1 py-4">
          {menuItems.map((item) => {
            const isActive = currentRoute === item.screen;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleNavigate(item.screen)}
                activeOpacity={0.7}
                className={`mx-3 mb-2 px-4 py-3.5 rounded-xl flex-row items-center ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30"
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
        <View className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="flex-row items-center"
          >
            <View className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 items-center justify-center mr-3">
              <Text className="text-white font-semibold text-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || "Kullanıcı"}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || "user@example.com"}
              </Text>
            </View>
            <Text className="text-gray-400 dark:text-gray-500 text-lg">🚪</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
