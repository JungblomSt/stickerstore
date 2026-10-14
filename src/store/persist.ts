// Spara lokalt

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootState } from "./index";

const KEY = "stickerstore.cart";

// Läs av kundvagnen vid start, tom om trasig data
export async function loadCart(): Promise<RootState["cart"] | undefined> {
    try {
        const json = await AsyncStorage.getItem(KEY);
        if (!json) return undefined;

        const data = JSON.parse(json);
        if (data && Array.isArray(data.items)) {
            return { items: data.items };
        }
        return undefined;
    } catch {
        return undefined;
    }
}
// spara kundvagn som JSON
export function saveCart(cart: RootState["cart"]) {
    AsyncStorage.setItem(KEY, JSON.stringify(cart)).catch(() => {});
}