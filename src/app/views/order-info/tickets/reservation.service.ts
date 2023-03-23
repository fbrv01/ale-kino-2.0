import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { environment } from "src/app/shared/constants/urls";

export interface ReservedSeat {
  id: string;
  rowSeat: string;
  columnSeat: number;
  showingID: number;
  userID: number;
}

@Injectable({
  providedIn: "root",
})
export class ReservationService {
  private reservedSeats$$ = new BehaviorSubject<ReservedSeat[]>([]);

  get reservedSeats$() {
    return this.reservedSeats$$.asObservable();
  }

  private http = inject(HttpClient);

  getByShowing(showingId: number) {
    return this.http.get<ReservedSeat[]>(
      environment.baseUrl + `reservedSeats?showingID=${showingId}`
    );
  }

  reserveSeatCall(
    rowSeat: string,
    columnSeat: number,
    userID: number,
    showingID: number
  ) {
    return this.http.post<ReservedSeat>(environment.baseUrl + "reservedSeats", {
      rowSeat,
      columnSeat,
      showingID,
      userID,
      id: showingID + rowSeat + columnSeat,
    });
  }

  removeSeatCall(seatID: string) {
    return this.http.delete<ReservedSeat>(
      environment.baseUrl + `reservedSeats/${seatID}`
    );
  }

  getReservedSeats(showingId: number) {
    this.getByShowing(showingId)
      .pipe(
        tap({
          next: (seatsList) => {
            this.reservedSeats$$.next([...seatsList]);
          },
        })
      )
      .subscribe();
  }

  canReserve(row: string, column: number): boolean {
    return this.reservedSeats$$.value.some(
      (element) => element.rowSeat === row && element.columnSeat === column
    );
  }

  reserveSeat(
    rowSeat: string,
    columnSeat: number,
    userID: number,
    showingID: number
  ) {
    if (!userID) {
      userID = -1;
    }

    this.reserveSeatCall(rowSeat, columnSeat, userID, showingID)
      .pipe(
        tap({
          next: (response) => {
            this.reservedSeats$$.next([
              ...this.reservedSeats$$.value,
              response,
            ]);
          },
        })
      )
      .subscribe();
  }

  removeSeat(row: string, column: number, showingID: number) {
    const seatID = showingID + row + column;
    this.removeSeatCall(seatID)
      .pipe(
        tap({
          next: () => {
            this.reservedSeats$$.next(
              this.reservedSeats$$.value.filter((seat) => seat.id !== seatID)
            );
          },
          error: (e) => {
            console.log(e);
          },
        })
      )
      .subscribe();
  }
}
