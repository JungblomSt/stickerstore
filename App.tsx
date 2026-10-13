import { NavigationContainer } from "@react-navigation/native";
import { Navigator } from "./src/navigation/navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { makeStore } from "./src/store";
import { StatusBar } from "expo-status-bar";

const store = makeStore();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
