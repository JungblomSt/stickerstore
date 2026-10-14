import { useAppSelector } from "../store/hooks";
import { useRates } from "./useRates";
import { formatPrice } from "../utils/pricing";

// Returnerar en funktion som formaterar ett SEK-belopp i vald valuta
export function usePrice() {
  const currency = useAppSelector((state) => state.currency.selected);
  const { data: rates } = useRates();
  return (amountSek: number) => formatPrice(amountSek, currency, rates);
}