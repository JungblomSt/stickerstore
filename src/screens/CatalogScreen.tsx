import { useState } from "react";
import {
  Button,
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { CatalogScreenProps } from "../navigation/types";
import { imageUrl } from "../api/tmdb";
import { useMovies } from "../hooks/useMovies";
import { useDebouncedValue } from "../utils/helpers";
import { errorMessage } from "../utils/errorMessage";
import { colors, fontSize, spacing } from "../theme";

export default function CatalogScreen({ navigation }: CatalogScreenProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  const { data: movies, loading, error, reload } = useMovies(debouncedSearch);

  if (error && !movies) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{errorMessage(error)}</Text>
        <Button title="Försök igen" onPress={reload} />
      </View>
    );
  }

  const renderEmpty = () => {
    if (loading) return <ActivityIndicator style={styles.empty} />;
    if (error)
      return (
        <View style={styles.empty}>
          <Text style={styles.message}>{errorMessage(error)}</Text>
          <Button title="Försök igen" onPress={reload} />
        </View>
      );
    if (movies && debouncedSearch)
      return (
        <Text style={[styles.message, styles.empty]}>
          Inga filmer matchade "{debouncedSearch}".
        </Text>
      );
    return null;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Sök film"
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
      />
      <Text style={styles.heading}>
        {debouncedSearch
          ? `Sökresultat för "${debouncedSearch}"`
          : "Populära filmer"}
      </Text>
      <FlatList
        data={movies ?? []}
        keyExtractor={(movie) => String(movie.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => {
          const uri = imageUrl(item.backdrop_path ?? item.poster_path);
          return (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("Design", { movieId: item.id })
              }
            >
              {uri ? (
                <Image source={{ uri }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.noImage]}>
                  <Text style={styles.noImageText}>Ingen bild</Text>
                </View>
              )}
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.year}>{item.release_date?.slice(0, 4)}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  search: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.cut,
    borderRadius: spacing.m,
    padding: spacing.m,
    fontSize: fontSize.body,
    marginBottom: spacing.m,
  },
  title: { fontSize: fontSize.title, fontWeight: "bold", color: colors.text },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: "bold",
    color: colors.textOnDark,
  },
  list: { gap: spacing.m, paddingBottom: spacing.m },
  card: {
    flex: 1,
    margin: spacing.s,
    alignItems: "center",
    gap: spacing.s,
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: spacing.m,
    borderWidth: 2,
    borderColor: colors.cut,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: spacing.m,
  },
  noImage: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.cut,
    backgroundColor: colors.surface,
  },
  noImageText: { color: colors.textSecondary },
  year: { fontSize: fontSize.small, color: colors.textSecondary },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.m,
  },
  message: {
    fontSize: fontSize.body,
    textAlign: "center",
    color: colors.textOnDark,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  footer: { marginTop: spacing.m, alignItems: "center" },
});
