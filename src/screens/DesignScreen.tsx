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
        <ActivityIndicator size="large" />
        <Text>Hämtar filmen…</Text>
      </View>
    );
  }

  if (details.error || !details.data) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{errorMessage(details.error)}</Text>
        <Button title="Tillbaka" onPress={() => navigation.goBack()} />
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Förhandsvisning */}
      <View style={[styles.preview, isLogoPreview && styles.logoBackground]}>
        {previewUri ? (
          <Image
            source={{ uri: previewUri }}
            style={isLogoPreview ? styles.previewLogo : styles.previewImage}
            resizeMode={isLogoPreview ? "contain" : "cover"}
          />
        ) : (
          <Text>Ingen bild</Text>
        )}
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

      {/* Bilder från getMovieImages */}
      <View style={styles.tabs}>
        <Button
          title={`Bakgrundsbilder (${images.data?.backdrops.length ?? 0})`}
          onPress={() => changeTab("backdrops")}
          color={tab === "backdrops" ? "#000" : "#888"}
        />
        <Button
          title={`Loggor (${images.data?.logos.length ?? 0})`}
          onPress={() => changeTab("logos")}
          color={tab === "logos" ? "#000" : "#888"}
        />
      </View>

      {images.loading && !images.data ? (
        <ActivityIndicator />
      ) : images.error ? (
        <View style={styles.inlineError}>
          <Text>{errorMessage(images.error)}</Text>
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
        <Button
          title="Till kundvagnen"
          onPress={() => navigation.navigate("Cart")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  message: { textAlign: "center", fontSize: 16 },
  preview: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: { width: "100%", height: "100%" },
  previewLogo: { width: "80%", height: "80%" },
  logoBackground: { backgroundColor: "#1c1c1e" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 8 },
  meta: { color: "#666" },
  tagline: { fontStyle: "italic" },
  overview: { lineHeight: 21 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  inlineError: { alignItems: "center", gap: 8 },
  thumbs: { gap: 8, paddingVertical: 8 },
  thumb: { borderWidth: 3, borderColor: "transparent", borderRadius: 8 },
  thumbSelected: { borderColor: "#f5b400" },
  thumbImage: { width: 128, aspectRatio: 16 / 9, borderRadius: 5 },
  footer: { marginTop: 16 },
});
