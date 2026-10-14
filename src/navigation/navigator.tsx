import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationList } from "./types";
import CatalogScreen from "../screens/CatalogScreen";
import DesignScreen from "../screens/DesignScreen";
import CartScreen from "../screens/CartScreen";
import { colors } from "../theme";
import { HeaderActions } from "../components/HeaderAction";

const Stack = createNativeStackNavigator<NavigationList>();

export const Navigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textOnDark,
        headerBackButtonDisplayMode: "minimal",
        headerRight: () => <HeaderActions />,
        headerRightBackgroundVisible: false,
      }}
    >
      <Stack.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{ title: "Katalog" }}
      />
      <Stack.Screen
        name="Design"
        component={DesignScreen}
        options={{ title: "Design" }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Varukorg" }}
      />
    </Stack.Navigator>
  );
};
