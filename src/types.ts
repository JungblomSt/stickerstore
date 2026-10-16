// Movie
export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
}
// MovieDetails
export interface MovieDetails extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
}
// Genre
export interface Genre {
  id: number;
  name: string;
}
// TmdbImage
export interface TmdbImage {
  aspect_ratio: number;
  height: number;
  width: number;
  iso_639_1: string | null;
  file_path: string;
}
// MovieImages
export interface MovieImages {
  id: number;
  backdrops: TmdbImage[];
  logos: TmdbImage[];
  posters: TmdbImage[];
}
// PagedResponse
export interface PagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
// Motif
export type MotifType = 'backdrop' | 'logo';

export interface Motif {
  type: MotifType;
  filePath: string;
  aspectRatio: number;
}

// StickerDesign
export type StickerShape = 'rectangle' | 'rounded' | 'square' | 'circle'; // används inte ännu
export type StickerSize = 'S' | 'M' | 'L';

export interface StickerDesign {
  shape: StickerShape;
  size: StickerSize;
  frame: {
    enabled: boolean;
    color: string;
  };
}

// CartItem
export interface CartItem {
  id: string;
  movieId: number;
  movieTitle: string;
  motif: Motif;
  design: StickerDesign;
  unitPriceSek: number;
  quantity: number;
}

// Currency
export type Currency = string;
export type Rates = Record<Currency, number>;