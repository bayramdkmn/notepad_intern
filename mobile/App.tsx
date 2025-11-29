import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import "./global.css";
import { AppNavigator } from "./src/navigation";

export default function App() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator />
    </>
  );
}
