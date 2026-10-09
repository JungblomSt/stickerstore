import {
  Button,
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { CatalogScreenProps } from "../navigation/types";
import { imageUrl, getPopularMovies } from "../api/tmdb";
import { useFetch } from "../hooks/useFetch";
import { errorMessage } from "../utils/errorMessage";

export default function CatalogScreen({ navigation }: CatalogScreenProps) {
  const {
    data: movies,
    loading,
    error,
    reload,
  } = useFetch(() => getPopularMovies(), []);

  if (error && !movies) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{errorMessage(error)}</Text>
        <Button title="Försök igen" onPress={reload} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies ?? []}
        keyExtractor={(movie) => String(movie.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
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
});
