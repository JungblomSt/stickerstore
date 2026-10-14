import { NavigationContainer } from "@react-navigation/native";
import { Navigator } from "./src/navigation/navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./src/store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { loadCart, saveCart } from "./src/store/persist";
import { colors } from "./src/theme";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    loadCart().then((cart) => {
      const s = makeStore(cart ? { cart } : undefined);
      let last = s.getState().cart;
      s.subscribe(() => {
        const cart = s.getState().cart;

        if (cart !== last) {
          last = cart;
          saveCart(cart);
        }
      });
      setStore(s);
    });
  }, []);

  // innan storen är skapad
  if (!store) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.textOnDark} />
      </View>
    );
  }

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
