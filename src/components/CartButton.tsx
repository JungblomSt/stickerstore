import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fontSize, spacing } from "../theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "chip";
  selected?: boolean;
};

export function CartButton({
  title,
  onPress,
  variant = "primary",
  selected = false,
}: Props) {
  const isChip = variant === "chip";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={isChip ? "tab" : "button"}
      accessibilityState={isChip ? { selected } : undefined}
      style={({ pressed }) => [
        styles.base,
        isChip ? styles.chip : styles.primary,
        isChip && selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          isChip ? styles.chipText : styles.primaryText,
          isChip && selected && styles.chipTextSelected,
        ]}
        maxFontSizeMultiplier={1.5}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 999, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.8 },
  text: { fontSize: fontSize.body },

  primary: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    minHeight: 44,
  },
  primaryText: { color: colors.text, fontWeight: "bold" },

  chip: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    minHeight: 36,
    borderWidth: 2,
    borderColor: colors.cut,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textOnDark, fontWeight: "600" },
  chipTextSelected: { color: colors.text },
});
