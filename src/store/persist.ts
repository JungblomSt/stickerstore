// Spara lokalt

// AsyncStorage är React Natives variant av localStoreage
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootState } from "./index";

const CART_KEY = "stickerstore.cart";
const CURRENCY_KEY = "stickerstore.currency"

// Läs av kundvagnen vid start, tom om trasig data
export async function loadCart(): Promise<RootState["cart"] | undefined> {
    try {
        const json = await AsyncStorage.getItem(CART_KEY);
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
// spara kundvagn som JSON string
export function saveCart(cart: RootState["cart"]) {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(cart)).catch(() => {});
}

export async function loadCurrency() : Promise<RootState["currency"] | undefined> {
    try {
        const saved = await AsyncStorage.getItem(CURRENCY_KEY);
        // Saknad valuta/kurs = SEK
        return saved && /^[A-Z]{3}$/.test(saved) ? { selected: saved } : undefined;
    } catch {
        return undefined;
    }
}
export function saveCurrency(currency: RootState["currency"]) {
    AsyncStorage.setItem(CURRENCY_KEY, currency.selected).catch(() => {});
}