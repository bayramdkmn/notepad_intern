import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import "./global.css";
import { AuthProvider } from "./src/context/AuthContext";
import { AppNavigator } from "./src/navigation";

export default function App() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <AuthProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator />
    </AuthProvider>
  );
}
