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
  View,
} from "react-native";
import { getMovieDetails, getMovieImages, imageUrl } from "../api/tmdb";
import { useFetch } from "../hooks/useFetch";
import type { DesignScreenProps } from "../navigation/types";
import { errorMessage } from "../utils/errorMessage";
import { colors, fontSize, spacing } from "../theme";
import { CartButton } from "../components/CartButton";
import { AppButton } from "../components/AppButton";

type Tab = "backdrops" | "logos";

export default function DesignScreen({ navigation, route }: DesignScreenProps) {
  const { movieId } = route.params;

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
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

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
  const imageList = images.data?.[tab] ?? [];

  // Förhandsvisning: valt motiv, annars första bilden i fliken, annars filmens bakgrundsbild.
  const previewPath =
    selectedPath ?? imageList[0]?.file_path ?? movie.backdrop_path;
  const previewUri = imageUrl(previewPath, "w780");
  const isLogoPreview = tab === "logos" && previewPath !== movie.backdrop_path;

  const changeTab = (newTab: Tab) => {
    setTab(newTab);
    setSelectedPath(null);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Förhandsvisning */}
      <View style={styles.sticker}>
        <View style={[styles.preview, isLogoPreview && styles.logoBackground]}>
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={isLogoPreview ? styles.previewLogo : styles.previewImage}
              resizeMode={isLogoPreview ? "contain" : "cover"}
            />
          ) : (
            <Text style={styles.noImageText}>Ingen bild</Text>
          )}
        </View>
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

      {/* Bild kategorier */}
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
        </View>
      ) : imageList.length === 0 ? (
        <Text style={styles.meta}>
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
            const selected = item.file_path === previewPath;
            return (
              <Pressable
                onPress={() => setSelectedPath(item.file_path)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={tab === "logos" ? "Logo" : "Bakgrundsbild"}
                style={[styles.thumb, selected && styles.thumbSelected]}
              >
                <Image
                  source={{ uri: imageUrl(item.file_path) ?? undefined }}
                  style={[
                    styles.thumbImage,
                    tab === "logos" && styles.logoBackground,
                  ]}
                  resizeMode={tab === "logos" ? "contain" : "cover"}
                />
              </Pressable>
            );
          }}
        />
      )}

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
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.m, gap: spacing.s },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.m,
    padding: spacing.l,
    backgroundColor: colors.background,
  },
  message: {
    fontSize: fontSize.body,
    textAlign: "center",
    color: colors.textOnDark,
  },
  noImageText: { color: colors.textSecondary },
  sticker: {
    padding: spacing.s,
    borderWidth: 2,
    borderColor: colors.cut,
    borderRadius: spacing.m,
    backgroundColor: colors.surface,
    borderStyle: "dashed",
  },
  preview: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: spacing.m,
    overflow: "hidden",
    backgroundColor: colors.cut,
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: { width: "100%", height: "100%" },
  previewLogo: { width: "80%", height: "80%" },
  logoBackground: { backgroundColor: colors.logoBackground },
  title: {
    fontSize: fontSize.title,
    fontWeight: "bold",
    marginTop: 8,
    color: colors.textOnDark,
  },
  meta: { color: colors.textOnDarkSecondary },
  tagline: {
    fontStyle: "italic",
    color: colors.textOnDark,
    fontSize: fontSize.body,
  },
  overview: { lineHeight: 21, color: colors.textOnDark },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.m,
    color: colors.textOnDark,
  },
  inlineError: { alignItems: "center", gap: spacing.s },
  thumbs: { gap: spacing.s, paddingVertical: spacing.s },
  thumb: {
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: spacing.m,
  },
  thumbSelected: { borderColor: colors.accent },
  thumbImage: { width: 128, aspectRatio: 16 / 9, borderRadius: 5 },
  footer: { marginTop: spacing.m, alignItems: "center" },
});
