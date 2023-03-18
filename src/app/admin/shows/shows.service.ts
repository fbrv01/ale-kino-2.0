import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { map, Observable, tap } from "rxjs";
import { environment } from "src/app/shared/constants/urls";
import { Movie } from "src/app/shared/interfaces/movie.type";
import { Showing } from "src/app/shared/interfaces/showing.type";
import { DatesService } from "src/app/shared/services/dates/dates.service";
import { TimeslotShowingsService } from "./timeslot-showings.service";

export interface ScreeningHall {
  id: number;
  name: string;
  rows: number;
  columns: number;
}

@Injectable({
  providedIn: "root",
})
export class ShowingsApiService {
  currDay;

  constructor(
    private http: HttpClient,
    private date: DatesService,
    private timeShowingsService: TimeslotShowingsService
  ) {
    this.currDay = this.date.getCurrentDay();
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(environment.baseUrl + "movies");
  }
  getHalls(): Observable<ScreeningHall[]> {
    return this.http.get<ScreeningHall[]>(
      environment.baseUrl + "screeningHalls"
    );
  }

  add(showingData: Partial<Showing>) {
    return this.http.post<Showing>(environment.baseUrl + "showings", {
      movieId: showingData.movieId,
      movieTitle: showingData.movieTitle,
      date: showingData.date,
      break: showingData.break,
      timeFrom: showingData.timeFrom,
      timeTo: showingData.timeTo,
      availableHallTime: showingData.availableHallTime,
      hallId: showingData.hallId,
      rows: showingData.rows,
      columns: showingData.columns,
    });
  }

  getShowings() {
    return this.http.get<Showing[]>(
      environment.baseUrl +
        `showings?date_gte=${this.currDay}&_sort=date,timeFrom&_order=asc`
    );
  }

  getShowingsWithParams(formValue: Showing) {
    const date = moment(formValue.date, "MM-DD-YYYY").format().slice(0, 10);
    return this.http
      .get<Showing[]>(
        environment.baseUrl +
          `showings?date_like=${date}&hallId=${formValue.hallId}`
      )
      .pipe(
        map((showing) =>
          showing.filter(
            (item) =>
              (formValue.timeFrom > item.timeFrom &&
                formValue.timeFrom < item.availableHallTime) ||
              (formValue.availableHallTime > item.timeFrom &&
                formValue.availableHallTime < item.availableHallTime) ||
              (formValue.timeFrom < item.timeFrom &&
                formValue.availableHallTime > item.availableHallTime)
          )
        ),
        tap((result) => this.timeShowingsService.update(result))
      );
  }
}
