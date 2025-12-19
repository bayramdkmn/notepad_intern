import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, { FadeIn } from "react-native-reanimated";

interface SettingsSectionProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const appInformationListItems = [
    {
      id: "1",
      title: "Uygulama Hakkında",
      icon: (
        <MaterialIcons
          name="info"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      onPress: () => {},
    },
    {
      id: "2",
      title: "Gizlilik Politikası",
      icon: (
        <MaterialIcons
          name="privacy-tip"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      onPress: () => {},
    },
    {
      id: "3",
      title: "Hizmet Şartları",
      icon: (
        <MaterialIcons
          name="description"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      onPress: () => {},
    },
    {
      id: "4",
      title: "Hakkımızda",
      icon: (
        <MaterialIcons
          name="info"
          size={20}
          color={isDark ? "white" : "black"}
        />
      ),
      onPress: () => {},
    },
  ];

  return (
    <Animated.View entering={FadeIn.duration(750)}>
      <View className="px-6 mt-8 space-y-4 gap-3">
        {/* Theme */}
        <View className="space-y-2">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            GÖRÜNÜM
          </Text>
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              onPress={onToggleTheme}
              className="flex-row items-center gap-3"
            >
              <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 border-[0.5px] border-gray-200 dark:border-gray-700">
                <MaterialIcons
                  name={isDark ? "light-mode" : "dark-mode"}
                  size={20}
                  color={isDark ? "white" : "black"}
                />
              </View>
              <Text className="text-black dark:text-white font-semibold text-base">
                {isDark ? "Açık Tema" : "Koyu Tema"}'ya geç
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color="black"
                className="ml-auto"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View className="space-y-2">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            BİLDİRİMLER
          </Text>
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              onPress={() => setNotificationsEnabled((prev) => !prev)}
              className="flex-row items-center gap-3"
            >
              <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 border-[0.5px] border-gray-200 dark:border-gray-700">
                <MaterialIcons
                  name={
                    notificationsEnabled
                      ? "notifications-on"
                      : "notifications-off"
                  }
                  size={20}
                  color={isDark ? "white" : "black"}
                />
              </View>
              <Text className="text-black dark:text-white font-semibold text-base">
                Bildirimlere İzin Ver
              </Text>
              <Switch
                style={{
                  transform: [{ scaleX: 0.7 }, { scaleY: 0.8 }],
                }}
                className="ml-auto"
                value={notificationsEnabled}
                onValueChange={() => setNotificationsEnabled((prev) => !prev)}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy */}
        <View className="space-y-2">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            UYGULAMA HAKKINDA
          </Text>
          <View className="bg-gray-50 gap-4 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            {appInformationListItems.map((item) => (
              <View key={item.id} className="flex-col gap-3">
                <TouchableOpacity className="flex-row items-center gap-3">
                  <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 border-[0.5px] border-gray-200 dark:border-gray-700">
                    {item.icon}
                  </View>
                  <Text className="text-black dark:text-white font-semibold text-base">
                    {item.title}
                  </Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="black"
                    className="ml-auto"
                  />
                </TouchableOpacity>
                <View className="flex-1 border-b border-gray-200 dark:border-gray-700" />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
