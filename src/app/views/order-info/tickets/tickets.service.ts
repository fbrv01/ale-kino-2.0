/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/app/shared/constants/urls";
import { BookedSeat } from "./seat/booked-seats.service";

interface ITickets {
  rowSeat: string;
  columnSeat: number;
  ticketTypeName: string;
  ticketPrice: number;
  showingID: number;
  userID: number;
  id: number;
}

export interface OrderData {
  orderID: string;
  date: string;
  tickets: ITickets[];
}

@Injectable({
  providedIn: "root",
})
export class TicketsService {
  constructor(private http: HttpClient) {}

  getUserOrders(userID: number) {
    return this.http
      .get<BookedSeat[]>(
        environment.baseUrl +
          `bookedSeats?userID=${userID}&_sort=date&_order=desc`
      )
      .pipe(map((response) => this.restructructuredOrdersData(response)));
  }

  getOrderById(orderID: string): Observable<OrderData[]> {
    return this.http
      .get<BookedSeat[]>(environment.baseUrl + `bookedSeats?orderID=${orderID}`)
      .pipe(map((response) => this.restructructuredOrdersData(response)));
  }

  restructructuredOrdersData(list: BookedSeat[]) {
    return list.reduce<OrderData[]>((acc, current) => {
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
