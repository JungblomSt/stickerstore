import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fontSize, spacing } from "../theme";

type Props = { title: string; onPress: () => void };

export function CartButton({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: 999,
    alignItems: "center",
  },
  pressed: { opacity: 0.8 },
  text: { color: colors.text, fontWeight: "bold", fontSize: fontSize.body },
});
