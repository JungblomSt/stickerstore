import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../types";
import { cartItemId, priceForDesign } from "../utils/pricing";

type NewSticker = Omit<CartItem, "id" | "unitPriceSek" | "quantity">;

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[] },
  reducers: {
    addSticker(state, action: PayloadAction<NewSticker>) {
      const { movieId, motif, design } = action.payload;
      const id = cartItemId(movieId, motif, design);
      const existing = state.items.find((item) => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          id,
          unitPriceSek: priceForDesign(design),
          quantity: 1,
        });
      }
    },

    removeSticker(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addSticker, removeSticker } = cartSlice.actions;
export default cartSlice.reducer;