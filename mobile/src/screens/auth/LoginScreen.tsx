import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useColorScheme } from "nativewind";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuthStore } from "../../store/authStore";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "E-posta adresi gerekli";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Şifre gerekli";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalı";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const res = await login(email, password);
    } catch (error: any) {
      Alert.alert("Hata", error?.message || "Giriş yapılırken bir hata oluştu");
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
          <View className="flex-row justify-end items-center px-4 pt-4 gap-2">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Mevcut Tema: {isDark ? "🌙" : "☀️"}
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
          <View className="flex justify-center items-center  h-4/5 mx-auto w-full max-w-2xl">
            <View className="bg-blue-100 dark:bg-indigo-800 p-3 mb-4 rounded-2xl items-center justify-center">
              <MaterialCommunityIcons
                name="notebook-edit"
                color="black"
                size={50}
              />
            </View>
            <View className="my-6 w-full items-center">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Hoş Geldin!
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400">
                Hesabına giriş yap ve notlarına ulaş
              </Text>
            </View>

            {/* Form */}
            <View className="px-10 w-full">
              <Input
                label="E-posta"
                placeholder="ornek@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Input
                label="Şifre"
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: "" });
                }}
                error={errors.password}
                isPassword
                autoCapitalize="none"
                className="mt-4"
              />

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
                className="self-end mt-2"
                activeOpacity={0.7}
              >
                <Text className="text-blue-500 dark:text-blue-400 text-sm font-medium">
                  Şifremi Unuttum
                </Text>
              </TouchableOpacity>

              <Button
                title="Giriş Yap"
                onPress={handleLogin}
                fullWidth
                className="mt-6"
              />
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Hesabın yok mu?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.7}
              >
                <Text className="text-blue-500 dark:text-blue-400 text-sm font-semibold">
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
