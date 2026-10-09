import { Movie, PagedResponse, MovieDetails, MovieImages } from '../types';

const TMDB_URL = 'https://api.themoviedb.org/3';
export const TMDB_TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN ?? '';

export class ApiError extends Error {
    status: number | 'FETCH_ERROR';
    
    constructor(status: number | 'FETCH_ERROR', message: string) {
        super(message);
        this.status = status;
    }
}

async function fetchFromTmdb<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${TMDB_URL}${path}`, {
        signal,
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: 'application/json',
      },
    });
  } catch {
    throw new ApiError('FETCH_ERROR', 'Ingen kontakt med servern.');
  }

  if (!response.ok) {
    throw new ApiError(response.status, `TMDb svarade med status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getPopularMovies(signal?: AbortSignal): Promise<Movie[]> {
  const data = await fetchFromTmdb<PagedResponse<Movie>>(
    '/movie/popular?language=sv-SE&region=SE',
    signal,
  );
  return data.results;
}

export async function getMovieDetails(movieId: number, signal?: AbortSignal): Promise<MovieDetails> {
  return fetchFromTmdb<MovieDetails>(`/movie/${movieId}?language=sv-SE`, signal);
}

export async function getMovieImages(movieId: number, signal?: AbortSignal): Promise<MovieImages> {
  return fetchFromTmdb<MovieImages>(`/movie/${movieId}/images`, signal);
}   

export function imageUrl(path: string | null, size: 'w300' | 'w780' = 'w300'): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
    }