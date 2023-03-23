/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable, switchMap, tap } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/app/shared/constants/urls";
import { User } from "src/app/shared/interfaces/user.type";
import { BookedSeat } from "../../order-info";

interface Tickets {
  rowSeat: string;
  columnSeat: number;
  ticketTypeName: string;
  ticketPrice: number;
  showingID: number;
  userID: number;
  id: number;
}

export interface TransformedOrder {
  orderID: string;
  date: string;
  tickets: Tickets[];
}

@Injectable({
  providedIn: "root",
})
export class UserTicketsApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  private userTickets$$ = new BehaviorSubject<TransformedOrder[]>([]);

  get userTickets$() {
    return this.userTickets$$.asObservable();
  }

  getUserTickets() {
    this.auth.userInfo$
      .pipe(
        switchMap((user: User | null) =>
          this.getUserOrders(user!.userID as number)
        ),
        tap((result) => this.userTickets$$.next(result))
      )
      .subscribe();
  }

  getUserOrders(userID: number) {
    return this.http
      .get<BookedSeat[]>(
        environment.baseUrl +
          `bookedSeats?userID=${userID}&_sort=date&_order=desc`
      )
      .pipe(map((response) => this.transformOrders(response)));
  }

  getOrderById(orderID: string): Observable<TransformedOrder[]> {
    return this.http
      .get<BookedSeat[]>(environment.baseUrl + `bookedSeats?orderID=${orderID}`)
      .pipe(map((response) => this.transformOrders(response)));
  }

  transformOrders(list: BookedSeat[]) {
    return list.reduce<TransformedOrder[]>((acc, current) => {
      const existingOrder = acc.find(
        (order) => order.orderID === current.orderID
      );
      if (existingOrder) {
        (existingOrder.date = current.date),
          existingOrder.tickets.push({
            rowSeat: current.rowSeat,
            columnSeat: current.columnSeat,
            ticketTypeName: current.ticketTypeName,
            ticketPrice: current.ticketPrice,
            showingID: current.showingID,
            userID: current.userID!,
            id: current.id,
          });
      } else {
        acc.push({
          orderID: current.orderID,
          date: current.date,
          tickets: [
            {
              rowSeat: current.rowSeat,
              columnSeat: current.columnSeat,
              ticketTypeName: current.ticketTypeName,
              ticketPrice: current.ticketPrice,
              showingID: current.showingID,
              userID: current.userID!,
              id: current.id,
            },
          ],
        });
      }
      return acc;
    }, []);
  }
}
