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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { resetPassword } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError("E-posta adresi gerekli");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Geçerli bir e-posta adresi girin");
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      await resetPassword(email);
      console.log(
        "Email gönderildi, VerifyCode ekranına yönlendiriliyor:",
        email
      );
      // Kod gönderildi, verify ekranına git
      navigation.navigate("VerifyCode", { email });
    } catch (error) {
      console.error("Kod gönderilirken hata:", error);
      setError("Kod gönderilirken bir hata oluştu");
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
                <View className="h-40 w-40 rounded-full bg-blue-500/10 items-center justify-center">
                  <MaterialIcons name="lock-reset" size={80} color="#3E63DD" />
                </View>
              </View>

              {/* Title */}
              <Text className="pb-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Şifreni mi Unuttun?
              </Text>

              {/* Description */}
              <Text className="pb-8 text-center text-base text-gray-600 dark:text-gray-400">
                Hesabınla ilişkili e-posta adresini gir, sana şifre sıfırlama
                kodu gönderelim.
              </Text>

              {/* Email Input */}
              <View className="w-full">
                <Text className="pb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-posta Adresi
                </Text>
                <View className="relative">
                  <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <MaterialIcons
                      name="mail-outline"
                      size={20}
                      color="#94A3B8"
                    />
                  </View>
                  <Input
                    placeholder="ornek@email.com"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError("");
                    }}
                    error={error}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    className="pl-12"
                  />
                </View>
              </View>

              <View className="flex-1" />

              {/* Send Button */}
              <View className="py-6">
                <Button
                  title="Kodu Gönder"
                  onPress={handleSendCode}
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
