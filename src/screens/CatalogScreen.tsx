
import { Button, StyleSheet, Text, View } from 'react-native';
import type { CatalogScreenProps } from '../navigation/types';

export default function CatalogScreen({ navigation }: CatalogScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StickerStore</Text>

      <Button
        title="Öppna Fight Club (id 550)"
        onPress={() => navigation.navigate('Design', { movieId: 550 })}
      />
      <Button
        title="Öppna The Matrix (id 603)"
        onPress={() => navigation.navigate('Design', { movieId: 603 })}
      />
      <Button title="Till kundvagnen" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
});