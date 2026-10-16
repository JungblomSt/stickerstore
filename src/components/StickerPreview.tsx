import { Image, StyleSheet, View } from "react-native";
import { imageUrl } from "../api/tmdb";
import { colors } from "../theme";
import type { Motif, StickerDesign } from "../types";

type Props = {
  motif: Motif;
  maxWidth: number;
  maxHight: number;
  frame?: StickerDesign["frame"];
};

export default function StickerPreview({
  motif,
  maxWidth,
  maxHight,
  frame,
}: Props) {
  const isLogo = motif.type === "logo";
  const frameOn = frame?.enabled ?? false;

  const fitsByWidth = maxWidth / motif.aspectRatio <= maxHight;
  const width = fitsByWidth
    ? maxWidth
    : Math.round(maxHight * motif.aspectRatio);
  const height = fitsByWidth
    ? Math.round(maxWidth / motif.aspectRatio)
    : maxHight;
  const frameWidth = frame?.enabled
    ? Math.max(2, Math.round(Math.min(width, height) * 0.07))
    : 0;

  const logoPadding = isLogo ? Math.round(Math.min(width, height) * 0.08) : 0;

  return (
    <View
      style={[
        styles.sticker,
        isLogo && styles.logo,
        { width, height },
        isLogo &&
          frameOn && { backgroundColor: frame!.color, padding: logoPadding },
        !isLogo &&
          frameOn && { borderWidth: frameWidth, borderColor: frame!.color },
      ]}
    >
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
