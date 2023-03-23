import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CouponRateService } from "../cart/coupon-rate.service";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/shared/interfaces/user.type";
import { verifyYourCouponCode } from "src/app/shared/validators/verifyYourCouponCode";
import { verifyConfirmEmail } from "src/app/shared/validators/verifyConfirmEmail";
import { CheckoutService } from "./checkout.service";

export type CheckoutForm = FormGroup<{
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<number>;
  email: FormControl<string>;
  confirmEmail: FormControl<string>;
  newsletter: FormControl<boolean>;
  couponCode: FormControl<string>;
}>;

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private couponRateService = inject(CouponRateService);
  private checkoutService = inject(CheckoutService);
  user = inject(AuthService).getSessionInfo();
  checkoutForm = this.createCheckoutForm();
  couponCodes$ = this.couponRateService.couponRate$;
  confirmEmailErrorMessages = {
    required: "Potwierdzenie email jest wymaganym polem",
    pattern: "Niewłaściwy format adresu email",
    notMatch: "Adresy email nie są zgodne",
  };

  ngOnInit() {
    if (this.user!.userID > 0) {
      this.fillForm(this.user!);
    }
    this.couponValue();
  }

  get checkoutFormCtrls() {
    return this.checkoutForm.controls;
  }

  get firstNameCtrl() {
    return this.checkoutForm.controls.firstName;
  }
  get lastNameCtrl() {
    return this.checkoutForm.controls.lastName;
  }
  get phoneNumberCtrl() {
    return this.checkoutForm.controls.phoneNumber;
  }
  get emailCtrl() {
    return this.checkoutForm.controls.email;
  }
  get confirmEmailCtrl() {
    return this.checkoutForm.controls.confirmEmail;
  }
  get couponCodeCtrl() {
    return this.checkoutForm.controls.couponCode;
  }

  fillForm(user: User) {
    this.checkoutFormCtrls.firstName.setValue(user.firstName);
    this.checkoutFormCtrls.lastName.setValue(user.lastName);
    this.checkoutFormCtrls.phoneNumber.setValue(user.phoneNumber);
    this.checkoutFormCtrls.email.setValue(user.email);
    this.checkoutFormCtrls.confirmEmail.setValue(user.email);
  }

  sendForm() {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.invalid) {
      alert("Niepoprawnie wypełniony formularz");
    } else {
      this.checkoutService.updateUserDataState(this.checkoutForm.getRawValue());
      this.router.navigate(["checkout/payment"]);
    }
  }

  couponValue() {
    return this.couponCodeCtrl.statusChanges.subscribe(() =>
      this.couponCodeCtrl.valid && this.couponCodeCtrl.value
        ? this.couponRateService.updateCouponRate(this.couponCodeCtrl.value)
        : this.couponRateService.updateCouponRate("")
    );
  }

  private createCheckoutForm(): CheckoutForm {
    const form = this.builder.group({
      firstName: this.builder.control("", {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      }),
      lastName: this.builder.control("", {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      }),
      phoneNumber: this.builder.control(null as unknown as number, {
        validators: [Validators.required, Validators.pattern(/^\d{9}$/)],
      }),
      email: this.builder.control("", {
        validators: [Validators.required, Validators.email],
      }),
      confirmEmail: this.builder.control("", {
        validators: [
          Validators.required,
          Validators.email,
          verifyConfirmEmail("email"),
        ],
      }),
      newsletter: this.builder.control(false),
      couponCode: this.builder.control("", {
        validators: [Validators.minLength(1)],
        asyncValidators: [verifyYourCouponCode(this.couponRateService)],
        updateOn: "blur" || "submit",
      }),
    });
    return form;
  }

  ngOnDestroy() {
    this.couponValue().unsubscribe();
  }
}
