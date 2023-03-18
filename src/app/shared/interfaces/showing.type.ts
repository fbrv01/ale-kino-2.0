import { Movie } from "./movie.type";

export interface Showing {
  id?: number;
  movieId: string;
  movieTitle: string;
  date: string;
  break: number;
  timeFrom: string;
  timeTo: string;
  rows: number;
  columns: number;
  hallId: number;
  availableHallTime: string;
}

interface Shows {
  showingId: number;
  timeFrom: string;
  date: string;
}
export interface MovieShows {
  movieId: string;
  showings: Shows[];
  movieDetails?: Movie;
}
