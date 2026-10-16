import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMovieDetails, getMovieImages, imageUrl } from "../api/tmdb";
import { useFetch } from "../hooks/useFetch";
import type { DesignScreenProps } from "../navigation/types";
import { errorMessage } from "../utils/errorMessage";
import { colors, fontSize, spacing } from "../theme";
import { AppButton } from "../components/AppButton";
import type {
  Motif,
  MotifType,
  TmdbImage,
  StickerDesign,
  StickerSize,
} from "../types";
import StickerPreview from "../components/StickerPreview";
import { addSticker } from "../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { cartItemId, formatSek, priceForDesign } from "../utils/pricing";
import { usePrice } from "../hooks/usePrice";

type Tab = "backdrops" | "logos";

// grund/start design på klistermärket
const DEFAULT_DESIGN: StickerDesign = {
  shape: "rounded",
  size: "M",
  frame: { enabled: false, color: colors.accent },
};
const SIZES: { value: StickerSize; label: string }[] = [
  { value: "S", label: "S · 5 cm" },
  { value: "M", label: "M · 7 cm" },
  { value: "L", label: "L · 11 cm" },
];

// gör TMDB-bilden till appens Motif
function toMotif(type: MotifType, image: TmdbImage): Motif {
  return {
    type,
    filePath: image.file_path,
    aspectRatio: image.aspect_ratio,
  };
}

export default function DesignScreen({ navigation, route }: DesignScreenProps) {
  const { movieId } = route.params;
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const price = usePrice();

  // Två anrop som körs samtidigt: filmens fakta och filmens bilder.
  const details = useFetch(
    (signal) => getMovieDetails(movieId, signal),
    [movieId],
  );
  const images = useFetch(
    (signal) => getMovieImages(movieId, signal),
    [movieId],
  );

  const [tab, setTab] = useState<Tab>("backdrops");
  const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);
  const [design, setDesign] = useState<StickerDesign>(DEFAULT_DESIGN);

  const cartItems = useAppSelector((state) => state.cart.items);

  // timer till: visa "Tillagd"
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // stoppar timern om användaren lämnar vyn innan den är klar
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  if (details.loading && !details.data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.textOnDark} />
        <Text style={styles.message}>Hämtar filmen…</Text>
      </View>
    );
  }

  if (details.error || !details.data) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{errorMessage(details.error)}</Text>
        <AppButton title="Tillbaka" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const movie = details.data;
  const backdrops = images.data?.backdrops ?? [];
  const logos = images.data?.logos ?? [];
  const imageList = tab === "backdrops" ? backdrops : logos;

  // Valt motiv, annars första bakgrundsbilden, annars första loggan.
  const defaultMotif = backdrops[0]
    ? toMotif("backdrop", backdrops[0])
    : logos[0]
      ? toMotif("logo", logos[0])
      : null;
  const motif = selectedMotif ?? defaultMotif;

  const inCart = motif
    ? (cartItems.find((item) => item.id === cartItemId(movieId, motif, design))
        ?.quantity ?? 0)
    : 0;

  const SIZE_SCALE = { S: 0.6, M: 0.8, L: 1 } as const;
  // Förhandsvisningen får plats med marginaler, men blir aldrig bredare än 420.
  const previewWidth =
    Math.min(screenWidth - 64, 420) * SIZE_SCALE[design.size];

  const addToCart = () => {
    if (!motif) return;
    dispatch(addSticker({ movieId, movieTitle: movie.title, motif, design }));
    setJustAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 1500);
  };
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        {/* Förhandsvisning av märket*/}
        <View style={styles.sheet}>
          {motif ? (
            <StickerPreview
              motif={motif}
              maxWidth={previewWidth}
              maxHight={previewWidth}
            />
          ) : images.loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.meta}>Inga motiv att välja bland</Text>
          )}
        </View>

        {/* Bild kategorier bilder/loggor */}
        <Text style={styles.label}>Välj motiv</Text>
        <View style={styles.tabs}>
          <AppButton
            variant="chip"
            title={`Bilder (${images.data?.backdrops.length ?? 0})`}
            selected={tab === "backdrops"}
            onPress={() => setTab("backdrops")}
          />
          <AppButton
            variant="chip"
            title={`Loggor (${images.data?.logos.length ?? 0})`}
            selected={tab === "logos"}
            onPress={() => setTab("logos")}
          />
        </View>

        {/* Bildlista */}
        {images.loading && !images.data ? (
          <ActivityIndicator color={colors.textOnDark} />
        ) : images.error ? (
          <View style={styles.inlineError}>
            <Text style={styles.message}>{errorMessage(images.error)}</Text>
            <Button title="Försök igen" onPress={images.reload} />
          </View>
        ) : imageList.length === 0 ? (
          <Text style={styles.noImageText}>
            {tab === "logos"
              ? "Filmen har inga loggor."
              : "Filmen har inga bakgrundsbilder."}
          </Text>
        ) : (
          <FlatList
            horizontal
            data={imageList}
            keyExtractor={(image) => image.file_path}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbs}
            renderItem={({ item }) => {
              const selected = motif?.filePath === item.file_path;
              return (
                <Pressable
                  onPress={() =>
                    setSelectedMotif(
                      toMotif(tab === "logos" ? "logo" : "backdrop", item),
                    )
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={tab === "logos" ? "Logga" : "Bild"}
                  style={[styles.thumb, selected && styles.thumbSelected]}
                >
                  <Image
                    source={{ uri: imageUrl(item.file_path) ?? undefined }}
                    style={[
                      styles.thumbImage,
                      tab === "logos" && styles.thumbLogo,
                    ]}
                    resizeMode={tab === "logos" ? "contain" : "cover"}
                  />
                </Pressable>
              );
            }}
          />
        )}
        {/* Välj storlek */}
        <Text style={styles.label}>Välj storlek</Text>
        <View style={styles.tabs}>
          {SIZES.map(({ value, label }) => (
            <AppButton
              key={value}
              variant="chip"
              title={label}
              selected={design.size === value}
              onPress={() => setDesign((prev) => ({ ...prev, size: value }))}
            />
          ))}
        </View>
        {/* Filmfakta från getMovieDetails */}
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {[
            movie.release_date?.slice(0, 4),
            movie.runtime ? `${movie.runtime} min` : null,
            movie.genres.map((g) => g.name).join(", "),
          ]
            .filter(Boolean)
            .join(" · ")}
        </Text>
        {movie.tagline ? (
          <Text style={styles.tagline}>{movie.tagline}</Text>
        ) : null}
        {movie.overview ? (
          <Text style={styles.overview}>{movie.overview}</Text>
        ) : null}
      </ScrollView>

      <View
        style={[styles.byFeald, { paddingBottom: spacing.m + insets.bottom }]}
      >
        <View style={styles.buyInfo}>
          <Text style={styles.price}>{price(priceForDesign(design))}</Text>
          <Text style={styles.buySub}>
            {inCart > 0 ? `${inCart} st i kundvagnen` : "per styck"}
          </Text>
        </View>
        <AppButton
          title={justAdded ? "Tillagd" : "Lägg i Kundvagnen"}
          onPress={addToCart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Skärmen
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  container: { padding: spacing.l, gap: spacing.s },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.m,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  message: {
    fontSize: fontSize.body,
    textAlign: "center",
    color: colors.textOnDark,
  },

  // Arket som klistermärket ligger på
  sheet: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    padding: spacing.l,
    borderRadius: spacing.l,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.cut,
    backgroundColor: colors.surface,
  },
  noImageText: { color: colors.textSecondary, fontSize: fontSize.body },

  // Filmfakta
  title: {
    fontSize: fontSize.title,
    fontWeight: "bold",
    color: colors.textOnDark,
    marginTop: spacing.m,
  },
  meta: { fontSize: fontSize.small, color: colors.textOnDarkSecondary },
  tagline: {
    fontSize: fontSize.body,
    fontStyle: "italic",
    color: colors.textOnDark,
  },
  overview: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * 1.4,
    color: colors.textOnDark,
  },

  // Motivval
  label: {
    fontSize: fontSize.heading,
    fontWeight: "bold",
    color: colors.textOnDark,
    marginTop: spacing.l,
  },
  tabs: { flexDirection: "row", justifyContent: "space-evenly" },
  inlineError: { alignItems: "center", gap: spacing.s },
  thumbs: { gap: spacing.s, paddingVertical: spacing.s },
  thumb: {
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: spacing.m,
    padding: 2,
  },
  thumbSelected: { borderColor: colors.accent },
  thumbImage: {
    width: 128,
    aspectRatio: 16 / 9,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  thumbLogo: { backgroundColor: colors.logoBackground },

  // "Köpfältet längst ner"
  byFeald: {
    flexDirection: "row", // pris till vänster, knapp till höger
    alignItems: "center",
    gap: spacing.m,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
  },
  buyInfo: { flex: 1 }, // tar utrymmet som blir över, så knappen hamnar längst till höger
  price: { fontSize: fontSize.title, fontWeight: "bold", color: colors.text },
  buySub: { fontSize: fontSize.small, color: colors.textSecondary },
});
