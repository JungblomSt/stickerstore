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
import { imageUrl, getPopularMovies } from "../api/tmdb";
import { useFetch } from "../hooks/useFetch";
import { useMovies } from "../hooks/useMovies";
import { useDebouncedValue } from "../utils/helpers";
import { errorMessage } from "../utils/errorMessage";

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
        placeholder="Sök filmer..."
        value={search}
        onChangeText={setSearch}
      />
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
                  <Text>Ingen bild</Text>
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
      <View style={styles.footer}>
        <Button
          title="Till kundvagnen"
          onPress={() => navigation.navigate("Cart")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  list: { gap: 12 },
  card: { flex: 1, margin: 6, alignItems: "center", gap: 6 },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },
  noImage: {
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  year: { fontSize: 12, color: "#666" },
  footer: { marginTop: 12, alignItems: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  message: { fontSize: 16, textAlign: "center" },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    marginBottom: 12,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
