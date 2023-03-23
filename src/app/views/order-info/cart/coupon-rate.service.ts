import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { environment } from "src/app/shared/constants/urls";
export interface Coupon {
  id: number;
  code: string;
  couponRate: number;
  wasUsed: boolean;
}

@Injectable({
  providedIn: "root",
})
export class CouponRateService {
  private couponRate$$ = new BehaviorSubject<{
    couponRate: number;
    id: number;
  }>({
    couponRate: 1,
    id: 0,
  });

  constructor(private http: HttpClient) {}

  get couponRate$() {
    return this.couponRate$$.asObservable();
  }

  get couponId() {
    return this.couponRate$$.value.id;
  }

  getCouponByName(coupon: string): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(
      environment.baseUrl + `coupons?code=${coupon}`
    );
  }

  patchCoupon(couponId: number): Observable<Coupon> {
    return this.http.patch<Coupon>(
      environment.baseUrl + `coupons/${couponId}`,
      {
        wasUsed: true,
      }
    );
  }

  updateCouponRate(coupon: string) {
    if (coupon) {
      this.getCouponByName(coupon)
        .pipe(
          map((code) => code[0]),
          tap({
            next: (result) =>
              this.couponRate$$.next({
                couponRate: result.couponRate,
                id: result.id,
              }),
            error: (e) => {
              alert(
                "Failed to download discount codes, please try again later"
              );
            },
          })
        )
        .subscribe();
    } else {
      return this.couponRate$$.next({ couponRate: 1, id: 0 });
    }
  }

  updateWasUsed() {
    if (this.couponId) {
      this.patchCoupon(this.couponId).subscribe();
    }
  }
}
