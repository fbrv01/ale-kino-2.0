import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from './reservation.service';
import { CartService } from '../cart/cart.service';
import {
  MovieTicketTypesService,
  TicketType,
} from './movie-ticket-types.service';
import { ShowingDetailsService } from '../showing-details/showing-details.service';
import { Subscription } from 'rxjs';
import { Showing } from 'src/app/shared/interfaces/showing.type';
import { AuthService } from 'src/app/auth/auth.service';

export type ITicketFormGroup = FormGroup<{
  tickets: FormArray<FormGroup<TicketDataForm>>;
}>;
export type AmountOptionsTypes =
  | 'Normalny'
  | 'Uczniowski'
  | 'Karta dużej rodziny'
  | 'Voucher';

type AmountForTickets = {
  [ticketName: string]: number;
};
export interface TicketDataForm {
  ticketTypeName: FormControl<string>;
  ticketPrice: FormControl<number>;
  rowSeat: FormControl<string>;
  columnSeat: FormControl<number>;
  userID: FormControl<number>;
  showingId: FormControl<number>;
  inCart: FormControl<boolean>;
  id: FormControl<string>;
}

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit, OnDestroy {
  constructor(
    private movieResponseService: MovieTicketTypesService,
    private cartService: CartService,
    private fb: NonNullableFormBuilder,
    private reservationService: ReservationService,
    private showingService: ShowingDetailsService
  ) {}
  private paramsInfo = inject(ActivatedRoute).snapshot.paramMap;
  private userID = inject(AuthService).getSessionInfo()?.userID!;
  private subscriptions = new Subscription();
  private readonly MAX_TICKETS_COUNT = 10;
  cart$ = this.cartService.cart$;
  ticketPrices: AmountForTickets = {};
  myTicketInfoForm = this.createForm();
  ticketTypes: TicketType[] = [];
  showingIdFromRoute = Number(this.paramsInfo.get('id'));
  showingDetails$ = this.showingService.getShowingDetails(
    this.showingIdFromRoute
  );
  totalPrice = 0;

  ngOnInit(): void {
    this.movieResponseService.fetchMovieTicketTypes().subscribe({
      next: (tickets) => {
        this.ticketPrices = tickets.reduce((acc: AmountForTickets, curr) => {
          acc[curr.name] = curr.price;
          return acc;
        }, {});
        this.ticketTypes = tickets;
      },
    });

    const cartSub = this.updateTicketsFromCart();
    this.subscriptions.add(cartSub);
  }

  deleteTicket(index: number, row: string, column: number) {
    this.myTicketInfoForm.controls.tickets.removeAt(index);
    this.reservationService.removeSeat(row, column, this.showingIdFromRoute);
    this.updateTotalPrice();
  }

  updateTicketPrice(index: number, event: { value: AmountOptionsTypes }) {
    this.myTicketInfoForm.controls.tickets
      .at(index)
      .patchValue({ ticketPrice: this.ticketPrices[event.value] });
    this.updateTotalPrice();
  }

  handleSeatReservation(row: string, column: number) {
    if (
      this.myTicketInfoForm.controls.tickets.length < this.MAX_TICKETS_COUNT
    ) {
      this.myTicketInfoForm.controls.tickets.push(
        this.generateFormForTicket(row, column)
      );

      this.reservationService.reserveSeat(
        row,
        column,
        this.userID,
        this.showingIdFromRoute
      );
      this.updateTotalPrice();
    } else {
      alert(`Cannot book more than ${this.MAX_TICKETS_COUNT} tickets`);
    }
  }
  updateTicketsFromCart() {
    return this.cartService.cart$.subscribe({
      next: () => {
        return this.handleCartTickets();
      },
    });
  }
  submit(showingDetails: Showing) {
    if (
      this.myTicketInfoForm.value.tickets &&
      this.myTicketInfoForm.value.tickets.filter(
        (item) => item.inCart === false
      ).length > 0
    ) {
      this.cartService.addToCart(
        this.myTicketInfoForm.getRawValue().tickets,
        this.userID,
        showingDetails
      );
      this.handleCartTickets();
      alert('bilety dodane do koszyka');
    } else {
      alert('bilety są już w koszyku!!!');
    }
  }

  updateTicket(
    ticketID: string,
    ticketTypeName: string,
    ticketPrice: number,
    ticketUserID: number,
    index: number
  ) {
    this.cartService.updateTicket(
      ticketID,
      ticketTypeName,
      ticketPrice,
      ticketUserID
    );
    this.myTicketInfoForm.controls.tickets.at(index).markAsPristine();
  }

  private updateTotalPrice() {
    this.totalPrice = 0;
    for (const control of this.myTicketInfoForm.controls.tickets.controls) {
      this.totalPrice += control.value.ticketPrice!;
    }
  }

  private createForm(): ITicketFormGroup {
    const form = this.fb.group({
      tickets: this.fb.array<FormGroup<TicketDataForm>>([]),
    });
    return form;
  }

  private generateFormForTicket(
    row: string,
    column: number,
    userID = this.userID,
    showingId = this.showingIdFromRoute,
    id: string = +new Date() + '',
    ticketTypeName = 'Normalny',
    ticketPrice = 25,
    inCart = false
  ) {
    return this.fb.group<TicketDataForm>({
      rowSeat: this.fb.control(row, Validators.required),
      columnSeat: this.fb.control(column, Validators.required),
      userID: this.fb.control(userID, Validators.required),
      showingId: this.fb.control(showingId, Validators.required),
      id: this.fb.control(id, Validators.required),
      ticketTypeName: this.fb.control(ticketTypeName, Validators.required),
      ticketPrice: this.fb.control(ticketPrice, Validators.required),
      inCart: this.fb.control(inCart, Validators.required),
    });
  }

  private handleCartTickets() {
    this.myTicketInfoForm.controls.tickets.clear();
    this.cartService.cartValue.forEach((ticket) => {
      if (ticket.showingId === this.showingIdFromRoute) {
        this.myTicketInfoForm.controls.tickets.push(
          this.generateFormForTicket(
            ticket.rowSeat,
            ticket.columnSeat,
            ticket.userID,
            ticket.showingId,
            ticket.id,
            ticket.ticketTypeName,
            ticket.ticketPrice,
            ticket.inCart
          )
        );
      }
    });
    this.updateTotalPrice();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
