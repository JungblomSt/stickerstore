import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NavigationList } from "../navigation/types";
import { selectCartCount, useAppSelector } from "../store/hooks";
import { colors, fontSize, spacing } from "../theme";
import { CurrencyPicker } from "./CurrencyPicker";
import { Ionicons } from "@expo/vector-icons";

export function HeaderActions() {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationList>>();
  const count = useAppSelector(selectCartCount);

  return (
    <View style={styles.row}>
      <CurrencyPicker />
      <Pressable
        onPress={() => navigation.navigate("Cart")}
        style={styles.button}
        // Träffytan är större än själva knappen, så att det blir lättare att trycka på den.
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Kundvagn, ${count}`}
      >
        <Ionicons name="cart-outline" size={24} color={colors.text} />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText} maxFontSizeMultiplier={1.2}>
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: 999, // Gör knappen rund
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderWidth: 2,
    borderColor: colors.cut,
    padding: spacing.s,
  },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.s },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 20,
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
