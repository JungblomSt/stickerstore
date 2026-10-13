import type { CartItem, Motif, StickerDesign } from "../types";

const SIZE_PRICE_SEK = { S: 20, M: 30, L: 40 } as const;
export const FRAME_PRICE_SEK = 10;

export function priceForDesign(design: StickerDesign): number {
  return SIZE_PRICE_SEK[design.size] + (design.frame.enabled ? FRAME_PRICE_SEK : 0);
}

// Samma film + samma motiv + samma design = samma id = samma rad i kundvagnen.
export function cartItemId(movieId: number, motif: Motif, design: StickerDesign): string {
  const frame = design.frame.enabled ? design.frame.color : "utan-ram";
  return [movieId, motif.type, motif.filePath, design.shape, design.size, frame].join("|");
}

export function cartTotalSek(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceSek * item.quantity, 0);
}

// Formaterar ett belopp i svenska kronor, tex. 29 kr eller 29,50 kr eller 29,00 kr om formatfunktionen inte fungerar.
export function formatSek(amount: number): string {
  try {
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(amount);
  } catch {
    return `${amount.toFixed(2)} kr`;
  }
}