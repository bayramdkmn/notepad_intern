import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseClasses = "py-4 px-6 rounded-2xl items-center justify-center";

  const variantClasses = {
    primary:
      "bg-blue-500 dark:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-700",
    secondary:
      "bg-gray-200 dark:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600",
    outline:
      "border-2 border-blue-500 dark:border-blue-400 active:bg-blue-50 dark:active:bg-gray-800",
  };

  const textVariantClasses = {
    primary: "text-white",
    secondary: "text-gray-900 dark:text-white",
    outline: "text-blue-500 dark:text-blue-400",
  };

  const disabledClasses = disabled || loading ? "opacity-50" : "";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${widthClass} ${className}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "white" : "#3B82F6"}
        />
      ) : (
        <Text
          className={`font-semibold text-base ${textVariantClasses[variant]}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
