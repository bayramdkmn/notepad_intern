import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

type ResetPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ResetPassword"
>;

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;
  const { colorScheme, setColorScheme } = useColorScheme();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  const validatePassword = () => {
    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return false;
    }

    setError("");
    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: API call to update password

      Alert.alert(
        "Başarılı!",
        "Şifren başarıyla güncellendi. Yeni şifrenle giriş yapabilirsin.",
        [
          {
            text: "Tamam",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (err) {
      setError("Şifre güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6">
            {/* Header */}
            <View className="flex-row items-center h-14 justify-between">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 items-center justify-center"
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={isDark ? "#E2E8F0" : "#334155"}
                />
              </TouchableOpacity>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {isDark ? "🌙" : "☀️"}
                </Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
              </View>
            </View>

            {/* Content */}
            <View className="flex-1 pt-6 pb-8">
              {/* Icon */}
              <View className="flex items-center pb-8">
                <View className="h-40 w-40 rounded-full bg-green-500/10 items-center justify-center">
                  <MaterialIcons name="lock" size={80} color="#22C55E" />
                </View>
              </View>

              {/* Title */}
              <Text className="pb-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Yeni Şifre Oluştur
              </Text>

              {/* Description */}
              <Text className="pb-8 text-center text-base text-gray-600 dark:text-gray-400">
                {email} hesabın için güvenli bir şifre belirle
              </Text>

              {/* Password Inputs */}
              <View className="w-full gap-4">
                <Input
                  label="Yeni Şifre"
                  placeholder="En az 6 karakter"
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setError("");
                  }}
                  isPassword
                  autoCapitalize="none"
                />

                <Input
                  label="Şifre Tekrar"
                  placeholder="Şifreni tekrar gir"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError("");
                  }}
                  isPassword
                  autoCapitalize="none"
                />

                {error ? (
                  <Text className="text-sm text-red-500">{error}</Text>
                ) : null}
              </View>

              <View className="flex-1" />

              {/* Reset Button */}
              <View className="py-6">
                <Button
                  title="Şifreyi Güncelle"
                  onPress={handleResetPassword}
                  loading={isLoading}
                  fullWidth
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

