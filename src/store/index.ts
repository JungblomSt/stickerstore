import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import currencyReducer from "./currencySlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  currency: currencyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];