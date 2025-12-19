import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types";
import { Button } from "../../components/common/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

const CODE_LENGTH = 6;
const TIMER_SECONDS = 5 * 60; // 5 dakika

type VerifyCodeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "VerifyCode"
>;

export const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;
  const { colorScheme, setColorScheme } = useColorScheme();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);

  const hiddenInputRef = useRef<TextInput>(null);
  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  // Timer
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCodeChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(sanitized);
    if (error) setError("");
  };

  const handleVerify = async () => {
    if (code.length !== CODE_LENGTH) {
      setError("Lütfen 6 haneli kodu gir");
      return;
    }

    try {
      setIsVerifying(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock validation - gerçek uygulamada API'ye gönderilecek
      if (code === "123456") {
        navigation.navigate("ResetPassword", { email, code });
      } else {
        setError("Geçersiz kod. Lütfen tekrar dene.");
      }
    } catch (err) {
      setError("Doğrulama sırasında bir hata oluştu");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    setCode("");
    setError("");
    setSecondsLeft(TIMER_SECONDS);
    // TODO: API call to resend code
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
            </View>

            {/* Content */}
            <View className="flex-1 pt-6 pb-8">
              {/* Icon */}
              <View className="flex items-center pb-8">
                <View className="h-40 w-40 rounded-full bg-purple-500/10 items-center justify-center">
                  <MaterialIcons name="dialpad" size={80} color="#7C3AED" />
                </View>
              </View>

              {/* Title */}
              <Text className="pb-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Kodu Gir
              </Text>

              {/* Description */}
              <Text className="pb-4 text-center text-base text-gray-600 dark:text-gray-400">
                {email} adresine gönderilen 6 haneli kodu gir
              </Text>

              {/* Timer */}
              <Text className="pb-8 text-center text-sm font-semibold text-blue-500">
                Kodun süresi: {formatTime(secondsLeft)}
              </Text>

              {/* Code Input */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => hiddenInputRef.current?.focus()}
                className="w-full mb-2"
              >
                <View className="flex-row justify-between px-4">
                  {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                    <View
                      key={index}
                      className={`w-12 h-14 rounded-xl items-center justify-center border-2 ${
                        error
                          ? "border-red-500"
                          : code[index]
                          ? "border-blue-500"
                          : "border-gray-200 dark:border-gray-700"
                      } bg-white dark:bg-gray-900`}
                    >
                      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                        {code[index] || ""}
                      </Text>
                    </View>
                  ))}
                </View>
                <TextInput
                  ref={hiddenInputRef}
                  value={code}
                  onChangeText={handleCodeChange}
                  keyboardType="number-pad"
                  maxLength={CODE_LENGTH}
                  autoFocus
                  style={{ opacity: 0, height: 0 }}
                  caretHidden
                />
              </TouchableOpacity>

              {error ? (
                <Text className="text-center text-sm text-red-500 mt-2">
                  {error}
                </Text>
              ) : null}

              <View className="flex-1" />

              {/* Verify Button */}
              <View className="mb-4">
                <Button
                  title="Kodu Doğrula"
                  onPress={handleVerify}
                  loading={isVerifying}
                  fullWidth
                />
              </View>

              {/* Resend */}
              <TouchableOpacity
                onPress={handleResend}
                disabled={secondsLeft > 0}
                className="flex-row items-center justify-center py-3"
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="refresh"
                  size={20}
                  color={secondsLeft > 0 ? "#94A3B8" : "#3E63DD"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    secondsLeft > 0
                      ? "text-gray-400"
                      : "text-blue-500 dark:text-blue-400"
                  }`}
                >
                  {secondsLeft > 0
                    ? `Yeniden gönder (${formatTime(secondsLeft)})`
                    : "Kodu Tekrar Gönder"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
