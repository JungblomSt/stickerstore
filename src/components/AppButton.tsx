import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function AppButton({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[styles.label, selected && styles.labelSelected]}
        maxFontSizeMultiplier={1.5}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.cut,
  },
  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pressed: { opacity: 0.8 },
  label: { color: colors.textOnDark, fontWeight: "600" },
  labelSelected: { color: colors.text },
});
