import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core";
import { CartService } from "./cart.service";
import { Router, RouterModule } from "@angular/router";
import SumPipe from "src/app/shared/pipes/sum.pipe";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MultiplyPipe } from "src/app/shared/pipes/multiply.pipe";
import { ReservationService } from "../tickets/reservation.service";
import ShowingDetailsComponent from "../showing-details/showing-details.component";
import { CartPriceComponent } from "./cart-price/cart-price.component";
import { MatIconModule } from "@angular/material/icon";
import { combineLatest, map } from "rxjs";
import { CouponRateService } from "./coupon-rate.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-cart",
  standalone: true,
  templateUrl: "./cart.component.html",
  styles: [],
  imports: [
    RouterModule,
    ShowingDetailsComponent,
    SumPipe,
    MultiplyPipe,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CartPriceComponent,
  ],
})
export default class CartComponent implements OnInit {
  @Input() couponRate = 1;
  private reservationService = inject(ReservationService);
  private cartService = inject(CartService);
  private couponRateService = inject(CouponRateService);
  couponRate$ = this.couponRateService.couponRate$;
  cartPrices$ = this.cartService.cartPrices$;
  paymentData$ = combineLatest([this.cartPrices$, this.couponRate$]).pipe(
    map(([cart, couponRate]) => ({ cart, couponRate }))
  );
  cart$ = this.cartService.cart$;
  routerUrl = inject(Router).url;
  userID = inject(AuthService).getSessionInfo()?.userID;

  ngOnInit() {
    this.cartService.getCart(this.userID!);
  }

  onRemoveFromCart(
    ticketID: string,
    row: string,
    column: number,
    showingID: number,
    userID: number
  ) {
    this.cartService.removeFromCart(ticketID, userID);
    this.reservationService.removeSeat(row, column, showingID);
  }
}
