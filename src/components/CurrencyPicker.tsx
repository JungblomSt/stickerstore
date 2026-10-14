import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Modal,
  Text,
} from "react-native";
import { setCurrency } from "../store/currencySlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CartButton } from "./CartButton";
import { colors, fontSize, spacing } from "../theme";
import { useRates } from "../hooks/useRates";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CurrencyPicker() {
  const selected = useAppSelector((state) => state.currency.selected);
  const dispatch = useAppDispatch();
  const { data: rates, loading, error } = useRates();
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // SEK först, resten i bokstavsordning
  const codes = rates
    ? [
        "SEK",
        ...Object.keys(rates)
          .filter((c) => c !== "SEK")
          .sort(),
      ]
    : ["SEK"];
  const choose = (code: string) => {
    dispatch(setCurrency(code));
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.button}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Valuta, ${selected}. Tryck för att byta`}
      >
        <Text style={styles.buttonText}>{selected} ▾</Text>
      </Pressable>
      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdropp}
          onPress={() => setOpen(false)}
          accessibilityLabel="Stäng"
        />
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.m }]}
        >
          <Text style={styles.heading}>Välj valuta</Text>

          {loading && !rates && (
            <Text style={styles.info}>Hämtar valutor...</Text>
          )}
          {error ? (
            <Text style={styles.info}>
              Kunde inte hämta valutor, priser visas i SEK.
            </Text>
          ) : null}
          <FlatList
            data={codes}
            keyExtractor={(code) => code}
            renderItem={({ item }) => {
              const active = item === selected;
              return (
                <Pressable
                  onPress={() => choose(item)}
                  style={[styles.row, active && styles.rowActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text
                    style={[styles.rowText, active && styles.rowTextActive]}
                  >
                    {item}
                  </Text>
                  {active && <Text style={styles.rowTextActive}>✓</Text>}
                </Pressable>
              );
            }}
          ></FlatList>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderRadius: spacing.m,
  },
  rowActive: { backgroundColor: colors.accent },
  rowText: { fontSize: fontSize.body, color: colors.text },
  rowTextActive: {
    fontSize: fontSize.body,
    color: colors.text,
    fontWeight: "bold",
  },
  button: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.cut,
    padding: spacing.s,
  },
  buttonText: {
    fontWeight: "bold",
    color: colors.textOnDark,
    fontSize: fontSize.body,
  },
  backdropp: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    maxHeight: "60%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.m,
    paddingHorizontal: spacing.m,
  },
  heading: {
    fontSize: fontSize.title,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.s,
  },
  info: { color: colors.text, marginBottom: spacing.s },
});
