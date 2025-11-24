import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { useColorScheme } from "nativewind";

export const HomeScreen = () => {
  const { user, logout, isLoading } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();

  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  const isDark = colorScheme === "dark";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="px-6 pt-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hoş Geldin! 👋
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400">
            {user?.name || user?.email}
          </Text>
        </View>

        {/* Theme Toggle Card */}
        <View className="px-6 mt-6">
          <View className="rounded-3xl p-6 bg-gray-50 dark:bg-gray-800 shadow-sm">
            <View className="items-center mb-4">
              <Text className="text-6xl mb-3">{isDark ? "🌙" : "☀️"}</Text>
              <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {isDark ? "Karanlık Mod" : "Aydınlık Mod"}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Şu anda {isDark ? "karanlık" : "aydınlık"} tema aktif
              </Text>
            </View>
            <Button
              title={
                isDark ? "☀️ Aydınlık Moda Geç" : "🌙 Karanlık Moda Geç"
              }
              onPress={toggleTheme}
              variant="primary"
              fullWidth
            />
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            İstatistikler
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4">
                <Text className="text-3xl mb-2">📝</Text>
                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  12
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Toplam Not
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-4">
                <Text className="text-3xl mb-2">🏷️</Text>
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  8
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Etiket
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-green-50 dark:bg-green-900/30 rounded-2xl p-4">
                <Text className="text-3xl mb-2">✅</Text>
                <Text className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  45
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Tamamlanan
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-orange-50 dark:bg-orange-900/30 rounded-2xl p-4">
                <Text className="text-3xl mb-2">⏰</Text>
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  3
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Bekleyen
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Notes */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Son Notlar
          </Text>
          <View className="space-y-3">
            {[1, 2, 3].map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Not Başlığı {item}
                </Text>
                <Text
                  className="text-sm text-gray-600 dark:text-gray-400"
                  numberOfLines={2}
                >
                  Bu bir örnek not içeriğidir. Burada notun özeti görünecek...
                </Text>
                <View className="flex-row mt-3">
                  <View className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full mr-2">
                    <Text className="text-xs text-blue-600 dark:text-blue-400">
                      İş
                    </Text>
                  </View>
                  <View className="bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">
                    <Text className="text-xs text-purple-600 dark:text-purple-400">
                      Önemli
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-8">
          <Button
            title="Çıkış Yap"
            onPress={handleLogout}
            loading={isLoading}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

