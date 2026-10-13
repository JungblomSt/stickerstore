import { useState } from "react";
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
import { getMovieDetails, getMovieImages, imageUrl } from "../api/tmdb";
import { useFetch } from "../hooks/useFetch";
import type { DesignScreenProps } from "../navigation/types";
import { errorMessage } from "../utils/errorMessage";
import { colors, fontSize, spacing } from "../theme";
import { CartButton } from "../components/CartButton";
import { AppButton } from "../components/AppButton";
import { Motif, MotifType, TmdbImage } from "../types";
import StickerPreview from "../components/StickerPreview";

type Tab = "backdrops" | "logos";

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
        <CartButton title="Tillbaka" onPress={() => navigation.goBack()} />
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

  // Förhandsvisningen får plats med marginaler, men blir aldrig bredare än 420.
  const previewWidth = Math.min(screenWidth - 64, 420);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Förhandsvisning */}
      <View style={styles.sheet}>
        {motif ? (
          <StickerPreview motif={motif} width={previewWidth} />
        ) : images.loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.meta}>Inga motiv att välja bland</Text>
        )}
      </View>

      {/* Bild kategorier */}
      <Text style={styles.label}>Välj motiv</Text>
      <View style={styles.tabs}>
        <AppButton
          label={`Bilder (${images.data?.backdrops.length ?? 0})`}
          selected={tab === "backdrops"}
          onPress={() => setTab("backdrops")}
        />
        <AppButton
          label={`Loggor (${images.data?.logos.length ?? 0})`}
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
                accessibilityLabel={tab === "logos" ? "Logo" : "Bakgrundsbild"}
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

      <View style={styles.footer}>
        <CartButton
          title="Till kundvagnen"
          onPress={() => navigation.navigate("Cart")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Skärmen
  screen: { flex: 1, backgroundColor: colors.background },
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

  footer: { marginTop: spacing.xl, alignItems: "center" },
});
