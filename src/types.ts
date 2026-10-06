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
// MovieDeatails
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
