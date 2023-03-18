/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/app/shared/constants/urls";
import { MovieShows, Showing } from "src/app/shared/interfaces/showing.type";
import { DatesService } from "src/app/shared/services/dates/dates.service";
import { MovieService } from "src/app/shared/services/movies/movies.service";

@Injectable({
  providedIn: "root",
})
export class MoviesShowingService {
  private currDay = "";
  constructor(
    private movieService: MovieService,
    private date: DatesService,
    private http: HttpClient
  ) {
    this.currDay = this.date.getCurrentDay();
  }
  private showings$$ = new BehaviorSubject<MovieShows[]>([]);

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
}
