import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useColorScheme } from "nativewind";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "İsim gerekli";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "İsim en az 2 karakter olmalı";
      isValid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gerekli";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(name, email, password);
      // Navigation otomatik olarak AppNavigator'da yönetilecek
    } catch (error) {
      Alert.alert("Hata", "Kayıt olurken bir hata oluştu");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-8 pb-8">
            {/* Theme Switch */}
            <View className="flex flex-row w-full items-center justify-end gap-1">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Mevcut Tema:
                </Text>
                {isDark ? "🌙" : "☀️"}
              </Text>
              <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
            {/* Content */}
            <View className="flex h-5/6 justify-center">
              {/* Header */}
              <View className="mb-10">
                <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Hesap Oluştur
                </Text>
                <Text className="text-base text-gray-600 dark:text-gray-400">
                  Notlarını düzenlemek için hemen başla
                </Text>
              </View>

              {/* Form */}
              <View className="space-y-4">
                <Input
                  label="İsim"
                  placeholder="Adın Soyadın"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: "" });
                  }}
                  error={errors.name}
                  autoCapitalize="words"
                />

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
                  className="mt-4"
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

                <Input
                  label="Şifre Tekrar"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  error={errors.confirmPassword}
                  isPassword
                  autoCapitalize="none"
                  className="mt-4"
                />

                <Button
                  title="Kayıt Ol"
                  onPress={handleRegister}
                  loading={isLoading}
                  fullWidth
                  className="mt-6"
                />
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mt-8">
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Zaten hesabın var mı?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.7}
                >
                  <Text className="text-blue-500 dark:text-blue-400 text-sm font-semibold">
                    Giriş Yap
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
