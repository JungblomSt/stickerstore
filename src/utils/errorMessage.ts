import { ApiError } from '../api/tmdb';

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 'FETCH_ERROR') return 'Ingen kontakt med servern. Kontrollera internet.';
    if (error.status === 401) return 'Fel API-token. Kontrollera .env och starta om Expo.';
    if (error.status === 404) return 'Hittades inte.';
    return `TMDb svarade med fel (${error.status}). Försök igen om en stund.`;
  }
  return 'Något gick fel när data hämtades.';
}