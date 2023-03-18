import { createReducer, on } from "@ngrx/store";
import { Movie } from "src/app/shared/interfaces/movie.type";
import {
  addMovies,
  addMoviesSuccess,
  getMoviesSuccess,
} from "../Actions/movie.action";

export interface MovieState {
  movies: ReadonlyArray<Movie>;
}

const initialState: ReadonlyArray<Movie> = [];

export const movieReducer = createReducer(
  initialState,
  on(getMoviesSuccess, (state, { movies }) => [...movies]),
  on(addMoviesSuccess, (state, { movie }) => [...state, movie])
);
