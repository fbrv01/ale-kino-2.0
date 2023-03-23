/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/app/shared/constants/urls";
import { MovieShows, Showing } from "src/app/shared/interfaces/showing.type";
import { DatesService } from "src/app/shared/services/dates/dates.service";
import { MovieService } from "src/app/shared/services/movies/movies.service";

export interface MovieRatings {
  id: number;
  movieId: number;
  userID: number;
  rating: number;
}
@Injectable({
  providedIn: "root",
})
export class MoviesShowingService {
  private currDay = "";
  constructor(
    private movieService: MovieService,
    private date: DatesService,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.currDay = this.date.getCurrentDay();
  }
  private showings$$ = new BehaviorSubject<MovieShows[]>([]);

  private movieRating$$ = new BehaviorSubject<MovieRatings[]>([]);

  get showings$() {
    return this.showings$$.asObservable();
  }

  fetchShowings(date: string) {
    if (date === this.currDay) {
      this.getForToday(date).subscribe({
        next: (response) => {
          this.updateShowingsState(response);
        },
        error: (e) => console.log(e),
      });
    } else {
      this.getForDate(date).subscribe({
        next: (response) => {
          this.updateShowingsState(response);
        },
        error: (e) => console.log(e),
      });
    }
  }

  private updateShowingsState(showings: Showing[]) {
    let transformedShowings = [];
    transformedShowings = this.transformShowings(showings);
    transformedShowings.forEach((showing) =>
      this.movieService
        .get(showing.movieId)
        .subscribe((result) => (showing.movieDetails = result))
    );
    this.showings$$.next(transformedShowings);
  }

  private transformShowings(list: Showing[]): MovieShows[] {
    return list.reduce<MovieShows[]>((acc, current) => {
      const existingMovie = acc.find(
        (movie) => movie.movieId === current.movieId
      );
      if (existingMovie) {
        existingMovie.showings.push({
          showingId: current.id!,
          timeFrom: current.timeFrom,
          date: current.date,
        });
      } else {
        acc.push({
          movieId: current.movieId,
          showings: [
            {
              showingId: current.id!,
              timeFrom: current.timeFrom,
              date: current.date,
            },
          ],
        });
      }
      return acc;
    }, []);
  }

  getForToday(date: string) {
    const now = new Date();
    const currHour = now.getHours();
    let padStart;
    currHour < 10 ? (padStart = 0) : (padStart = "");
    const currMinutes = now.getMinutes();
    return this.http.get<Showing[]>(
      environment.baseUrl +
        `showings?date_like=${date}&timeFrom_gte=${padStart}${currHour}:${currMinutes}`
    );
  }
  getForDate(date: string) {
    return this.http.get<Showing[]>(
      environment.baseUrl + `showings?date_like=${date}`
    );
  }

  getRating(movieId: string) {
    return this.http.get<MovieRatings[]>(
      environment.baseUrl + `movieRatings?movieId=${movieId}`
    );
  }

  updateRating(userID: number, rating: number, movieId: string) {
    return this.http.post<MovieRatings>(environment.baseUrl + `movieRatings`, {
      movieId,
      userID,
      rating,
    });
  }

  get movieRating$() {
    return this.movieRating$$.asObservable();
  }
  get movieRatingList$() {
    return this.movieRating$.pipe(
      map((item) => item.map(({ rating }) => rating))
    );
  }

  fetchMovieRating(movieId: string) {
    this.getRating(movieId)
      .pipe(
        tap({
          next: (result) => {
            console.log(result);
            this.movieRating$$.next(result);
          },
        })
      )
      .subscribe();
  }

  putMovieRating(userID: number, rating: number, movieId: string) {
    this.updateRating(userID, rating, movieId)
      .pipe(
        tap({
          next: (result: MovieRatings) => {
            this.movieRating$$.next([...this.movieRating$$.value, result]);
          },
        })
      )
      .subscribe();
  }
}
