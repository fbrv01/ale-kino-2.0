import { Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";

interface CheckoutInfo {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  newsletter: boolean;
}

export interface CheckoutUserData {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  newsletter: boolean;
  couponCode?: string;
}

@Injectable({
  providedIn: "root",
})
export class CheckoutService {
  private checkout$$ = new ReplaySubject<CheckoutInfo>(1);

  get checkout$() {
    return this.checkout$$.asObservable();
  }

  private checkoutUserData$$ = new BehaviorSubject<CheckoutUserData>({
    firstName: "",
    lastName: "",
    phoneNumber: 0,
    email: "",
    newsletter: false,
    couponCode: "",
  });

  get checkoutUserDataValues() {
    return this.checkoutUserData$$.value;
  }

  setCheckoutState(data: CheckoutInfo) {
    return this.checkout$$.next({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      newsletter: data.newsletter,
      phoneNumber: data.phoneNumber,
    });
  }

  clearCheckoutState() {
    return this.checkout$$.next({
      email: "",
      firstName: "",
      lastName: "",
      newsletter: false,
      phoneNumber: 0,
    });
  }

  updateUserDataState(checkoutFormValue: CheckoutUserData) {
    this.checkoutUserData$$.next(checkoutFormValue);
  }
}
