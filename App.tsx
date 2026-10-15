import { NavigationContainer } from "@react-navigation/native";
import { Navigator } from "./src/navigation/navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./src/store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  loadCart,
  loadCurrency,
  saveCart,
  saveCurrency,
} from "./src/store/persist";
import { colors } from "./src/theme";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    Promise.all([loadCart(), loadCurrency()]).then(([cart, currency]) => {
      const s = makeStore({
        ...(cart && { cart }),
        ...(currency && { currency }),
      });

      let lastCart = s.getState().cart;
      let lastCurrency = s.getState().currency;

      s.subscribe(() => {
        const { cart, currency } = s.getState();

        if (cart !== lastCart) {
          lastCart = cart;
          saveCart(cart);
        }
        if (currency !== lastCurrency) {
          lastCurrency = currency;
          saveCurrency(currency);
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
