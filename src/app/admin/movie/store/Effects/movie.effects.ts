import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { EmptyError } from "rxjs";
import { catchError, concatMap, exhaustMap, map, tap } from "rxjs/operators";
import { ErrorHandlerService } from "src/app/shared/services/error-handle/error-handler.service";
import { MovieService } from "src/app/shared/services/movies/movies.service";

import {
  getMovies,
  getMoviesSuccess,
  addMovies,
  addMoviesSuccess,
} from "../Actions/movie.action";

@Injectable()
export class MovieEffects {
  loadMovie$ = createEffect(() =>
    this.action$.pipe(
      ofType(getMovies),
      exhaustMap(() =>
        this.movieService.getAll().pipe(
          map((movies) => getMoviesSuccess(movies)),
          catchError(this.errorHandler.handleError)
        )
      )
    )
  );

  addMovie$ = createEffect(() =>
    this.action$.pipe(
      ofType(addMovies),
      tap((movie) => console.log(movie)),
      concatMap(({ movie }) =>
        this.movieService.add(movie).pipe(
          map((newMovie) => addMoviesSuccess(newMovie)),
          catchError(this.errorHandler.handleError)
        )
      )
    )
  );

  constructor(
    private action$: Actions,
    private movieService: MovieService,
    private errorHandler: ErrorHandlerService
  ) {}
}
