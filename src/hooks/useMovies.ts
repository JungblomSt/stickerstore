import { useFetch } from './useFetch';
import { getMovies } from '../api/tmdb';

export function useMovies(term: string) {
  return useFetch((signal) => getMovies(term, signal), [term]);
}