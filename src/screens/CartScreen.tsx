import { Button, StyleSheet, Text, View } from 'react-native';
import type { CartScreenProps } from '../navigation/types';

export default function CartScreen({ navigation }: CartScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kundvagn</Text>

      <Button
        title="Öppna film från kundvagnen (id 550)"
        onPress={() => navigation.navigate('Design', { movieId: 550 })}
      />
      <Button title="Tillbaka" onPress={() => navigation.goBack()} />
      <Button title="Till katalogen" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
});