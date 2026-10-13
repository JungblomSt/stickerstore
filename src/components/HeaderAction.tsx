import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NavigationList } from "../navigation/types";
import { selectCartCount, useAppSelector } from "../store/hooks";
import { colors, fontSize, spacing } from "../theme";

export function HeaderActions() {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationList>>();
  const count = useAppSelector(selectCartCount);

  return (
    <Pressable
      onPress={() => navigation.navigate("Cart")}
      style={styles.button}
      // Träffytan är större än själva knappen, så att det blir lättare att trycka på den.
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Kundvagn, ${count}`}
    >
      <Text style={styles.text}>Kundvagn</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: 999, // Gör knappen rund
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
  },
  text: { fontWeight: "bold", color: colors.text, fontSize: fontSize.body },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
  },
  badgeText: {
    color: colors.surface,
    fontSize: fontSize.small,
    fontWeight: "bold",
  },
});
