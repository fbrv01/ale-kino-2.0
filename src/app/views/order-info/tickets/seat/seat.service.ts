import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { environment } from "src/app/shared/constants/urls";
import { Showing } from "src/app/shared/interfaces/showing.type";

export interface SeatElements {
  columns: number[];
  rows: string[];
}

@Injectable({
  providedIn: "root",
})
export class SeatService {
  private http = inject(HttpClient);
  private seatGrid$$ = new BehaviorSubject<SeatElements>({
    columns: [],
    rows: [],
  });
  rows: number[] = [];
  columns: number[] = [];
  rowsA: string[] = [];

  get seatGrid$() {
    return this.seatGrid$$.asObservable();
  }
  get seatGridColumns$() {
    return this.seatGrid$.pipe(map((grid) => grid.columns));
  }

  get seatGridRows$() {
    return this.seatGrid$.pipe(map((grid) => grid.rows));
  }

  getSeatGrid(showingId: number) {
    this.http
      .get<Showing[]>(environment.baseUrl + `showings?id=${showingId}`)
      .pipe(
        tap({
          next: (response: Showing[]) => {
            this.createSeatsGrid(response);
          },
        })
      )
      .subscribe();
  }

  private createSeatsGrid(showing: Showing[]) {
    this.columns = [...Array(showing[0].columns + 1).keys()];
    this.columns.shift();
    this.rows = Array.from(Array(showing[0].rows)).map((e, i) => i + 65);
    this.rowsA = this.rows.map((x) => String.fromCharCode(x));
    this.seatGrid$$.next({ columns: this.columns, rows: this.rowsA });
  }
}
