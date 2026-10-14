import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Currency } from "../types";

const currencySlice = createSlice({
  name: "currency",
  initialState: { selected: "SEK" as Currency },
  reducers: {
    setCurrency(state, action: PayloadAction<Currency>) {
        state.selected = action.payload
    }
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;