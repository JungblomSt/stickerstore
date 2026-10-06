import { Button, StyleSheet, Text, View } from 'react-native';
import type { DesignScreenProps } from '../navigation/types';

export default function DesignScreen({ navigation, route }: DesignScreenProps) {
  const { movieId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Design</Text>
      <Text>Film-id: {movieId}</Text>

      <Button title="Till kundvagnen" onPress={() => navigation.navigate('Cart')} />
      <Button title="Tillbaka" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
});