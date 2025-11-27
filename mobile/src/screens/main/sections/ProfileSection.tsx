import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User } from "../../../types";
import Feather from "@expo/vector-icons/Feather";
import { useColorScheme } from "nativewind";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EditUserModal from "../../../components/modals/EditUserModal";
import ChangePasswordModal from "../../../components/modals/ChangePasswordModal";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

interface ProfileSectionProps {
  user: User | null;
  onLogout: () => void;
  loading: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  onLogout,
  loading,
}) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const isDark = colorScheme === "dark";

  const handleUpdateAccount = (payload: { name: string; email: string }) => {
    console.log("Update account:", payload);
  };

  const handleChangePassword = (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    console.log("Change password:", payload);
  };

  const listMenuItems = [
    {
      id: "1",
      title: "Hesabımı Düzenle",
      icon: (
        <MaterialCommunityIcons
          name="account-edit"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      onPress: () => setEditUserModalVisible(true),
    },
    {
      id: "2",
      title: "Şifremi Değiştir",
      icon: (
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      onPress: () => setChangePasswordModalVisible(true),
    },
    {
      id: "3",
      title: "Tema Değiştir",
      icon: (
        <MaterialIcons
          name={isDark ? "light-mode" : "dark-mode"}
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      onPress: toggleTheme,
    },
    {
      id: "4",
      title: "Çıkış Yap",
      icon: <MaterialIcons name="logout" size={20} color="red" />,
      onPress: onLogout,
    },
  ];

  return (
    <Animated.View entering={FadeIn.duration(750)}>
      <View className="px-4 mt-6 gap-4">
        <View className="flex items-center py-2 gap-4">
          <View className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 items-center justify-center">
            <Feather name="user" size={50} color={isDark ? "white" : "black"} />
          </View>
          <View className="text-center flex flex-col items-center w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
              {user?.name || "Kullanıcı"}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || "E-Posta"}
            </Text>
          </View>
        </View>
        <View className="w-full px-4 py-2 flex flex-row gap-2">
          <View className="flex w-1/2 bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-blue-400 rounded-xl p-4 border-[0.4px] flex-col items-center">
            <Text className="text-2xl font-bold text-blue-500">128</Text>
            <Text className="text-base text-gray-500 dark:text-gray-200">
              Toplam Not
            </Text>
          </View>
          <View className="flex w-1/2 bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-blue-400 rounded-xl p-4 border-[0.4px] flex-col items-center">
            <Text className="text-2xl font-bold text-blue-500">128</Text>
            <Text className="text-base text-gray-500 dark:text-gray-200">
              Toplam Etiket
            </Text>
          </View>
        </View>
        <Animated.View entering={FadeInDown.duration(750).delay(100)}>
          <View className="w-full px-2 py-2 flex flex-col gap-2">
            {listMenuItems.map((item) => (
              <View
                key={item.id}
                className="flex w-full bg-gray-100 dark:bg-gray-700 border-gray-200 rounded-xl p-4 border-[0.5px] dark:border-gray-700 flex-row items-center justify-between"
              >
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-between"
                  onPress={item.onPress}
                >
                  <View className="flex flex-row gap-3 items-center">
                    <View
                      className={`bg-gray-200 rounded-lg p-2 dark:bg-sky-800/30 ${
                        item.id === "5"
                          ? "bg-pink-500/10 dark:bg-red-900/50"
                          : ""
                      }`}
                    >
                      <Text className="text-base text-gray-500 dark:text-gray-400">
                        {item.icon}
                      </Text>
                    </View>
                    <Text
                      className={`text-lg font-medium text-gray-600 dark:text-gray-200 ${
                        item.id === "5"
                          ? "text-red-500 dark:text-red-600/80"
                          : ""
                      }`}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={isDark ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Animated.View>

        <EditUserModal
          visible={editUserModalVisible}
          user={user}
          onSubmit={handleUpdateAccount}
          onClose={() => setEditUserModalVisible(false)}
        />
        <ChangePasswordModal
          visible={changePasswordModalVisible}
          onSubmit={handleChangePassword}
          onClose={() => setChangePasswordModalVisible(false)}
        />
      </View>
    </Animated.View>
  );
};
