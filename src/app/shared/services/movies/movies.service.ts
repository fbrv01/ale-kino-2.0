import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/shared/constants/urls";

import {
  AgeRestriction,
  Genre,
  Movie,
} from "src/app/shared/interfaces/movie.type";
import { ErrorHandlerService } from "../error-handle/error-handler.service";
import { retry, catchError, map } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({ providedIn: "root" })
export class MovieService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}
  add(movie: Movie) {
    return this.http
      .post<Movie>(environment.baseUrl + environment.movies, movie)
      .pipe(retry(1), catchError(this.errorHandler.handleError));
  }

  getAll() {
    return this.http
      .get<Movie[]>(environment.baseUrl + environment.movies)
      .pipe(retry(1), catchError(this.errorHandler.handleError));
  }

  get(movieId: string) {
    return this.http
      .get<Movie[]>(environment.baseUrl + `movies?id=${movieId}`)
      .pipe(map((result) => result[0]));
  }

  getWithQuery(data: { id: number }) {
    return this.http
      .get<Movie>(environment.baseUrl + environment.movies + "/" + data.id)
      .pipe(retry(1), catchError(this.errorHandler.handleError));
  }

  getGenres() {
    return of([
      {
        id: 1,
        name: "Drama",
      },
      {
        id: 2,
        name: "Fantasy",
      },
      {
        id: 3,
        name: "Horror",
      },
      {
        id: 4,
        name: "Comedy",
      },
      {
        id: 5,
        name: "Science fiction",
      },
      {
        id: 6,
        name: "Thriller",
      },
    ]);
  }
  getAgeRestrictions() {
    return of([
      {
        id: 1,
        name: "Dla wszystkich",
      },
      {
        id: 2,
        name: "PG",
      },
      {
        id: 3,
        name: "PG-13",
      },
      {
        id: 4,
        name: "R",
      },
      {
        id: 5,
        name: "NC-17",
      },
    ]);
  }
}
