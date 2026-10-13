import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationList } from "./types";
import CatalogScreen from "../screens/CatalogScreen";
import DesignScreen from "../screens/DesignScreen";
import CartScreen from "../screens/CartScreen";
import { colors } from "../theme";

const Stack = createNativeStackNavigator<NavigationList>();

export const Navigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textOnDark,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="Catalog" component={CatalogScreen} />
      <Stack.Screen name="Design" component={DesignScreen} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Varukorg" }}
      />
    </Stack.Navigator>
  );
};
