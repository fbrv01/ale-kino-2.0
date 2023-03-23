import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/app/shared/constants/urls";
import { CartService, TicketInCartDetails } from "../../cart/cart.service";

export interface BookedSeat {
  id: number;
  ticketTypeName: string;
  ticketPrice: number;
  rowSeat: string;
  columnSeat: number;
  showingID: number;
  userID: number | undefined;
  orderID: string;
  date: string;
}

export interface BookedSeat {
  id: number;
  ticketTypeName: string;
  ticketPrice: number;
  rowSeat: string;
  columnSeat: number;
  showingID: number;
  userID: number | undefined;
  orderID: string;
  date: string;
}

@Injectable({
  providedIn: "root",
})
export class BookedSeatsService {
  private bookedSeats$$ = new BehaviorSubject<BookedSeat[]>([]);
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private cartService: CartService
  ) {}
  get bookedSeats$() {
    return this.bookedSeats$$.asObservable();
  }

  getBookedSeats(showingId: number) {
    this.fetchBookedSeats(showingId)
      .pipe(
        tap({
          next: (seatsList) => {
            this.bookedSeats$$.next([...seatsList]);
          },
        })
      )
      .subscribe();
  }

  bookSeat(ticket: TicketInCartDetails, orderID: string, date: string) {
    this.postBookSeat(ticket, orderID, date)
      .pipe(
        tap({
          next: (response) => {
            this.bookedSeats$$.next([...this.bookedSeats$$.value, response]);
            this.cartService.removeFromCart(ticket.id, ticket.userID);
          },
        })
      )
      .subscribe();
  }

  canBook(row: string, column: number): boolean {
    return this.bookedSeats$$.value.some(
      (element) => element.rowSeat === row && element.columnSeat === column
    );
  }

  fetchBookedSeats(showingId: number) {
    return this.http.get<BookedSeat[]>(
      environment.baseUrl + `bookedSeats?showingID=${showingId}`
    );
  }
  postBookSeat(ticket: TicketInCartDetails, orderID: string, date: string) {
    return this.http.post<BookedSeat>(environment.baseUrl + "bookedSeats", {
      rowSeat: ticket.rowSeat,
      columnSeat: ticket.columnSeat,
      ticketTypeName: ticket.ticketTypeName,
      ticketPrice: ticket.ticketPrice,
      showingID: ticket.showingId,
      userID: this.auth.getSessionInfo()?.userID,
      orderID,
      date,
    });
  }
}
