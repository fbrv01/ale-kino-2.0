import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "src/app/shared/constants/urls";
import { CheckoutUserData } from "../checkout.service";
interface Order {
  id: string;
  date: string;
  userData: CheckoutUserData;
}

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) {}

  postOrderData(id: string, date: string, userData: CheckoutUserData) {
    return this.http
      .post<Order>(environment.baseUrl + "orders", {
        id,
        date,
        userData,
      })
      .subscribe();
  }
}
