import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { CartScreenProps } from "../navigation/types";
import { colors, fontSize, spacing } from "../theme";
import { AppButton } from "../components/AppButton";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StickerPreview from "../components/StickerPreview";
import { removeSticker } from "../store/cartSlice";
import { cartTotalSek } from "../utils/pricing";
import { usePrice } from "../hooks/usePrice";

export default function CartScreen({ navigation }: CartScreenProps) {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const price = usePrice();

  if (items.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.emptyMessage}>Kundvagnen är tom</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              onPress={() =>
                navigation.navigate("Design", { movieId: item.movieId })
              }
              accessibilityLabel={`Öppna ${item.movieTitle}`}
              style={styles.thumb}
            >
              <StickerPreview
                motif={item.motif}
                maxWidth={80}
                maxHight={68}
                frame={item.design.frame}
              />
            </Pressable>

            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {item.movieTitle}
              </Text>
              <Text style={styles.desc}>
                {item.motif.type === "logo" ? "Logga" : "Bild"} ·{" "}
                {item.quantity} st
                {", Storlek: "} {item.design.size}
              </Text>
              <Pressable
                onPress={() => dispatch(removeSticker(item.id))}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Ta bort ${item.movieTitle}`}
              >
                <Text style={styles.remove}>Ta bort</Text>
              </Pressable>
            </View>

            <Text style={styles.linePrice}>
              {price(item.unitPriceSek * item.quantity)}
            </Text>
          </View>
        )}
      />
      <View style={styles.navButton}>
        <AppButton
          title="Fortsätt handla"
          onPress={() => navigation.navigate("Catalog")}
        />
        <AppButton
          title="Betala"
          onPress={() =>
            alert("Det går inte att handla ännu, Affären har inte öppnat")
          }
        />
      </View>

      <View
        style={[styles.totalBar, { paddingBottom: spacing.m + insets.bottom }]}
      >
        <Text style={styles.totalLabel}>Totalt</Text>
        <Text style={styles.total}>{price(cartTotalSek(items))}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.m,
    gap: spacing.m,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.m,
    padding: spacing.m,
    borderRadius: spacing.m,
    backgroundColor: colors.surface,
  },
  thumb: { width: 80, alignItems: "center" },
  title: {
    fontSize: fontSize.body,
    fontWeight: "bold",
    color: colors.text,
  },
  emptyMessage: {
    margin: spacing.xl,
    fontSize: fontSize.title,
    color: colors.textOnDark,
  },
  info: { flex: 1, gap: spacing.xs },
  desc: { fontSize: fontSize.small, color: colors.textSecondary },
  remove: {
    fontSize: fontSize.small,
    fontWeight: "bold",
    color: colors.danger,
  },
  linePrice: {
    fontSize: fontSize.body,
    fontWeight: "bold",
    color: colors.text,
  },
  navButton: {
    flexDirection: "row",
    padding: spacing.l,
    justifyContent: "space-evenly",
  },
  total: { fontSize: fontSize.title, fontWeight: "bold", color: colors.text },
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
  },
  totalLabel: {
    fontSize: fontSize.title,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
});
