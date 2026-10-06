import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationList} from "./types";
import CatalogScreen from "../screens/CatalogScreen";
import DesignScreen from "../screens/DesignScreen";
import CartScreen from "../screens/CartScreen";


const Stack = createNativeStackNavigator<NavigationList>();

export const Navigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Catalog" component={CatalogScreen} />
      <Stack.Screen name="Design" component={DesignScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}
