import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnDestroy } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MultiplyByDirective } from "src/app/shared/directives/multiply.directive";
import { CouponRateService } from "../coupon-rate.service";

interface PaymentInformation {
  cart: number;
  couponRate: {
    couponRate: number;
    id: number;
  };
}
@Component({
  selector: "app-cart-price",
  standalone: true,
  templateUrl: "cart-price.component.html",
  imports: [RouterModule, CommonModule, MultiplyByDirective],
})
export class CartPriceComponent implements OnDestroy {
  @Input() payment!: PaymentInformation;
  constructor(private couponRateService: CouponRateService) {}
  url = inject(Router).url;

  ngOnDestroy() {
    this.couponRateService.updateCouponRate("");
  }
}
