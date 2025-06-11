import "./global.css";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import AppNavigation from "./src/navigation/AppNavigation";

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppNavigation />
    </SafeAreaProvider>
  );
}
