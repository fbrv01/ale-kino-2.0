import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { CartService } from "../../cart/cart.service";
import { BookedSeatsService } from "../../tickets/seat/booked-seats.service";
import { CouponRateService } from "../../cart/coupon-rate.service";
import { OrderService } from "./order.service";
import { combineLatest, map } from "rxjs";
import { DatesService } from "src/app/shared/services/dates/dates.service";
import { CheckoutService } from "../checkout.service";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit, OnDestroy {
  private builder = inject(NonNullableFormBuilder);
  private cartValue = inject(CartService).cartValue;
  private datesService = inject(DatesService);
  private bookedSeatsService = inject(BookedSeatsService);
  private orderService = inject(OrderService);
  private checkoutService = inject(CheckoutService);
  private couponRateService = inject(CouponRateService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  cartPrices$ = this.cartService.cartPrices$;
  couponRate$ = this.couponRateService.couponRate$;
  paymentData$ = combineLatest([this.cartPrices$, this.couponRate$]).pipe(
    map(([cart, couponRate]) => ({ cart, couponRate }))
  );
  readonly INPUT_LENGTH = 6;
  orderID = this.createUuidv4();
  notPaid = true;
  showSpinner = false;

  blikForm = this.builder.group({
    blikNum: this.builder.control(null, {
      validators: [Validators.required, Validators.pattern("[0-9]{6}")],
    }),
  });

  ngOnInit() {
    if (this.checkoutService.checkoutUserDataValues.couponCode) {
      this.couponRateService.updateCouponRate(
        this.checkoutService.checkoutUserDataValues.couponCode
      );
    }
  }

  ngOnDestroy() {
    this.couponRateService.updateCouponRate("");
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

  onSubmit() {
    this.blikForm.markAllAsTouched();
    if (this.blikForm.valid) {
      const currDay = this.datesService.getCurrentDay();
      this.bookSeats(currDay);
      this.postOrder(currDay);
      this.couponRateService.updateWasUsed();
      this.showConfirmation();
    } else {
      alert("Enter the correct code");
    }
  }

  private showConfirmation() {
    this.showSpinner = true;
    return setTimeout(() => {
      this.notPaid = false;
      this.showSpinner = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  private bookSeats(currDay: string) {
    this.cartValue.forEach((ticket) => {
      this.bookedSeatsService.bookSeat(ticket, this.orderID, currDay);
    });
  }

  private postOrder(currDay: string) {
    this.orderService.postOrderData(
      this.orderID,
      currDay,
      this.checkoutService.checkoutUserDataValues
    );
  }
}
