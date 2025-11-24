import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "nativewind";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={`w-full ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </Text>
      )}
      <View className="relative">
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
              borderColor: error ? "#EF4444" : isDark ? "#374151" : "#E5E7EB",
              color: isDark ? "#FFFFFF" : "#111827",
            },
          ]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5"
            activeOpacity={0.7}
          >
            <Text className="text-2xl">{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 dark:text-red-400 text-xs mt-1.5">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
});
