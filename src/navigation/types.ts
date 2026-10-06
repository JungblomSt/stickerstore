import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type NavigationList = {
  Catalog: undefined;
  Design: { movieId: number };
  Cart: undefined;
};

export type CatalogScreenProps = NativeStackScreenProps<NavigationList, 'Catalog'>;
export type DesignScreenProps = NativeStackScreenProps<NavigationList, 'Design'>;
export type CartScreenProps = NativeStackScreenProps<NavigationList, 'Cart'>;