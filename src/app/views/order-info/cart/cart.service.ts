import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { environment } from "src/app/shared/constants/urls";
import { Showing } from "src/app/shared/interfaces/showing.type";

export interface TicketDetails {
  ticketTypeName: string;
  ticketPrice: number;
  rowSeat: string;
  columnSeat: number;
  userID: number;
  showingId: number;
  id: string;
}

export interface TicketInCartDetails extends TicketDetails {
  inCart: boolean;
  timestamp: string;
  showingDetails: Showing;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cart$$ = new BehaviorSubject<TicketInCartDetails[]>([]);

  private http = inject(HttpClient);

  get cart$() {
    return this.cart$$.asObservable();
  }

  get cartValue() {
    return this.cart$$.value;
  }

  get cartPrices$(): Observable<number> {
    return this.cart$.pipe(
      map((cart) =>
        cart.reduce((accTotal, cartItem) => accTotal + cartItem.ticketPrice, 0)
      )
    );
  }

  getCartItems(now: string, userID: number) {
    return this.http.get<TicketInCartDetails[]>(
      environment.baseUrl +
        `cart?userId=${userID}&timestamp_gte=${now}&toBeDeleted=false`
    );
  }

  patchTicketvalue(
    ticketID: string,
    ticketTypeName: string,
    ticketPrice: number
  ) {
    return this.http.patch(environment.baseUrl + `cart/${ticketID}`, {
      ticketTypeName,
      ticketPrice,
    });
  }

  createUuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  postCartItems(
    ticket: TicketDetails,
    timestamp: string,
    showingDetails: Showing
  ): Observable<TicketInCartDetails> {
    return this.http.post<TicketInCartDetails>(environment.baseUrl + `cart`, {
      ticketTypeName: ticket.ticketTypeName,
      ticketPrice: ticket.ticketPrice,
      rowSeat: ticket.rowSeat,
      columnSeat: ticket.columnSeat,
      userID: ticket.userID,
      showingId: ticket.showingId,
      id: this.createUuidv4(),
      inCart: true,
      timestamp,
      toBeDeleted: false,
      showingDetails,
    });
  }

  deleteCartItems(ticketID: string) {
    return this.http.patch<TicketDetails[]>(
      environment.baseUrl + `cart/${ticketID}`,
      {
        toBeDeleted: true,
      }
    );
  }

  addToCart(
    ticketList: TicketDetails[],
    userID: number,
    showingDetails: Showing
  ) {
    const timestamp = new Date().toISOString();
    if (userID) {
      this.addToCartAsUser(ticketList, timestamp, showingDetails);
    } else {
      this.addToCartAsGuest(ticketList, timestamp, showingDetails);
    }
  }

  getCart(userID: number) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);

    const guestTickets = localStorage.getItem("guestTickets");

    if (guestTickets) {
      this.getTicketsFromLS(guestTickets, now);
    }

    if (userID) {
      this.getCartItems(now.toISOString(), userID)
        .pipe(
          tap({
            next: (result) => {
              this.cart$$.next([...this.cart$$.value, ...result]);
            },
          })
        )
        .subscribe();
    }

    return;
  }

  removeFromCart(ticketID: string, userID: number) {
    if (userID > 0) {
      this.deleteCartItems(ticketID)
        .pipe(
          tap({
            next: () => {
              this.removeTicketFromCartState(ticketID);
            },
          })
        )
        .subscribe();
    } else {
      this.removeTicketFromCartState(ticketID);
      localStorage.setItem(
        "guestTickets",
        JSON.stringify(this.cart$$.value.filter((item) => item.userID < 0)) //remove tickets added with a role User
      );
      return;
    }
  }

  emptyCart() {
    return this.cart$$.next([]);
  }

  updateTicket(
    ticketID: string,
    ticketTypeName: string,
    ticketPrice: number,
    userID: number
  ) {
    if (userID > 0) {
      this.patchTicketvalue(ticketID, ticketTypeName, ticketPrice)
        .pipe(
          tap({
            next: () => {
              const ticketIndex = this.getTicketIndexinCart(ticketID);
              if (ticketIndex !== -1) {
                this.updateTypeAndPrice(
                  ticketIndex,
                  ticketPrice,
                  ticketTypeName
                );
              }
            },
          })
        )
        .subscribe();
    } else {
      const ticketIndex = this.getTicketIndexinCart(ticketID);
      if (ticketIndex !== -1) {
        this.updateTypeAndPrice(ticketIndex, ticketPrice, ticketTypeName);
        localStorage.setItem("guestTickets", JSON.stringify(this.cart$$.value));
      }
    }
  }

  private removeTicketFromCartState(ticketID: string) {
    this.cart$$.next(this.cart$$.value.filter((item) => item.id !== ticketID));
  }

  private addToCartAsUser(
    ticketList: TicketDetails[],
    timestamp: string,
    showingDetails: Showing
  ) {
    return ticketList.forEach((ticket) => {
      if (this.cart$$.value.find((item) => item.id === ticket.id)) {
        return;
      } else {
        this.postCartItems(ticket, timestamp, showingDetails)
          .pipe(
            tap({
              next: (response) => {
                this.cart$$.next([...this.cart$$.value, response]);
              },
            })
          )
          .subscribe();
      }
    });
  }

  private addToCartAsGuest(
    ticketList: TicketDetails[],
    timestamp: string,
    showingDetails: Showing
  ) {
    let guestTickets: TicketInCartDetails[] = [];

    if (localStorage.getItem("guestTickets")! == "") {
      guestTickets = localStorage.getItem(
        "guestTickets"
      ) as unknown as TicketInCartDetails[];
    }

    ticketList.forEach((ticket) => {
      if (this.cart$$.value.find((item) => item.id === ticket.id)) {
        return;
      } else {
        guestTickets.push({
          ticketTypeName: ticket.ticketTypeName,
          ticketPrice: ticket.ticketPrice,
          rowSeat: ticket.rowSeat,
          columnSeat: ticket.columnSeat,
          userID: -1,
          showingId: ticket.showingId,
          id: this.createUuidv4(),
          inCart: true,
          timestamp: timestamp,
          showingDetails,
        });
      }
    });

    localStorage.setItem("guestTickets", JSON.stringify(guestTickets));
    this.cart$$.next([...this.cart$$.value, ...guestTickets]);
    return;
  }

  private getTicketsFromLS(guestTickets: string, now: Date) {
    this.cart$$.next(JSON.parse(guestTickets));
    this.cart$$.next(
      this.cart$$.value.filter(
        (cartItem) => cartItem.timestamp > now.toISOString()
      )
    );
  }

  private getTicketIndexinCart(ticketID: string) {
    return this.cart$$.value.findIndex((ticket) => ticket.id === ticketID);
  }

  private updateTypeAndPrice(
    ticketIndex: number,
    ticketPrice: number,
    ticketTypeName: string
  ) {
    this.cart$$.value[ticketIndex].ticketPrice = ticketPrice;
    this.cart$$.value[ticketIndex].ticketTypeName = ticketTypeName;
  }
}
