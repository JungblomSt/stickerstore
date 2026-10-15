import { Image, StyleSheet, View } from "react-native";
import { imageUrl } from "../api/tmdb";
import { colors, spacing } from "../theme";
import type { Motif } from "../types";

type Props = {
  motif: Motif;
  maxWidth: number;
  maxHight: number;
};

export default function StickerPreview({ motif, maxWidth, maxHight }: Props) {
  const isLogo = motif.type === "logo";

  const fitsByWidth = maxWidth / motif.aspectRatio <= maxHight;
  const width = fitsByWidth
    ? maxWidth
    : Math.round(maxHight * motif.aspectRatio);
  const height = fitsByWidth
    ? Math.round(maxWidth / motif.aspectRatio)
    : maxHight;

  return (
    <View style={[styles.sticker, isLogo && styles.logo, { width, height }]}>
      <Image
        source={{ uri: imageUrl(motif.filePath, "w780") ?? undefined }}
        style={styles.image}
        resizeMode={isLogo ? "contain" : "cover"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sticker: {
    backgroundColor: colors.surface,
    // iOS-skugga
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // Android-skugga
    elevation: 5,
  },
  logo: { backgroundColor: colors.logoBackground },
  image: { flex: 1 },
});
