import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useColorScheme } from "nativewind";
import { Sidebar, SidebarScreen } from "../../components/sidebar/Sidebar";
import { NotesSection } from "./sections/NotesSection";
import { TagsSection } from "./sections/TagsSection";
import { SettingsSection } from "./sections/SettingsSection";
import { ProfileSection } from "./sections/ProfileSection";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SIDEBAR_WIDTH = 300;
type ScreenKey = SidebarScreen;

export const HomeScreen = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("Notes");
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  const isDark = colorScheme === "dark";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: isSidebarOpen ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSidebarOpen, overlayAnim, sidebarAnim]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSelectScreen = (screen: ScreenKey) => {
    setActiveScreen(screen);
    setSidebarOpen(false);
  };

  const translateScreen = (screen: ScreenKey) => {
    switch (screen) {
      case "Notes":
        return "Notlar";
      case "Tags":
        return "Etiketler";
      case "Settings":
        return "Ayarlar";
      case "Profile":
        return "Profil";
      default:
        return "Notlar";
    }
  };

  const renderActiveContent = () => {
    switch (activeScreen) {
      case "Tags":
        return <TagsSection />;
      case "Settings":
        return <SettingsSection isDark={isDark} onToggleTheme={toggleTheme} />;
      case "Profile":
        return (
          <ProfileSection
            user={user}
            onLogout={handleLogout}
            loading={isLoading}
          />
        );
      default:
        return <NotesSection />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1">
        <View className="flex-row items-center  px-6 py-4 border-b border-gray-100 dark:border-gray-400">
          <TouchableOpacity
            onPress={() => setSidebarOpen((prev) => !prev)}
            className={`w-11 h-11 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } items-center justify-center active:bg-gray-200 dark:active:bg-gray-700`}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="menu"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold absolute left-1/2 -translate-x-1/5 text-gray-900 dark:text-white">
            {translateScreen(activeScreen)}
          </Text>
        </View>
        {activeScreen === "Tags" ? (
          renderActiveContent()
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {renderActiveContent()}
          </ScrollView>
        )}
        <Animated.View
          pointerEvents={isSidebarOpen ? "auto" : "none"}
          style={[
            styles.overlay,
            {
              opacity: overlayAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={() => setSidebarOpen(false)}>
            <View style={styles.overlayTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View
          style={[
            styles.sidebarContainer,
            {
              transform: [{ translateX: sidebarAnim }],
            },
          ]}
        >
          <Sidebar
            currentScreen={activeScreen}
            onSelectScreen={handleSelectScreen}
            onClose={() => setSidebarOpen(false)}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 20,
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  overlayTouchable: {
    flex: 1,
  },
});
