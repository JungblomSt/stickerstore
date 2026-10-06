
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigation/navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigator /> 
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


