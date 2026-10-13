import { Button, StyleSheet, Text, View } from "react-native";
import type { CartScreenProps } from "../navigation/types";
import { colors } from "../theme";
import { CartButton } from "../components/CartButton";

export default function CartScreen({ navigation }: CartScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kundvagn</Text>

      <CartButton
        title="Öppna film från kundvagnen (id 550)"
        onPress={() => navigation.navigate("Design", { movieId: 550 })}
      />
      <CartButton
        title="Till katalogen"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.background,
  },
  title: { fontSize: 24, fontWeight: "bold", color: colors.textOnDark },
});
