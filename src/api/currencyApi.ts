import { CurrencyNames, Rates } from "../types";
import { ApiError } from "./errors";


// Finns nyare variant men denna var bättre om man utgår från SEK
const CURRENCY_URL = "https://api.frankfurter.dev/v1";

async function fetchFromFrankfurter<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${CURRENCY_URL}${path}`, { signal });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new ApiError("FETCH_ERROR", "Kunde inte hämta valutakurser.");
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Frankfurter svarade med status: ${response.status}`);
  }
  return (await response.json()) as T;
}

// Alla kurser med SEK som bas
export async function getRates(signal?: AbortSignal): Promise<Rates> {
  const data = await fetchFromFrankfurter<{ rates: Rates }>("/latest?base=SEK", signal);
  return { SEK: 1, ...data.rates };
}

// Namn på valutor
export async function getCurrencyNames(signal?: AbortSignal): Promise<CurrencyNames> {
  return fetchFromFrankfurter<CurrencyNames>("/currencies", signal);
}