import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CheckoutComponent } from "./checkout.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { PaymentComponent } from "./payment/payment.component";
import CartComponent from "../cart/cart.component";
import { MultiplyByDirective } from "src/app/shared/directives/multiply.directive";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SharedModule } from "src/app/shared/shared.module";

const routes: Routes = [
  {
    path: "",
    component: CheckoutComponent,
  },
];
@NgModule({
  declarations: [CheckoutComponent, PaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CartComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
    MultiplyByDirective,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: CheckoutComponent,
      },
      {
        path: "payment",
        component: PaymentComponent,
      },
    ]),
  ],
})
export default class CheckoutModule {}
