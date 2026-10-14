import { getRates } from "../api/currencyApi";
import { useFetch } from "./useFetch";


export function useRates() {
    return useFetch((signal) => getRates(signal), []);
}