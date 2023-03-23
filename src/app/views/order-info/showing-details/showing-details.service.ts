import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/app/shared/constants/urls";
import { Showing } from "src/app/shared/interfaces/showing.type";

@Injectable({
  providedIn: "root",
})
export class ShowingDetailsService {
  constructor(private http: HttpClient) {}

  getShowingDetails(showId: number) {
    return this.http
      .get<Showing[]>(environment.baseUrl + `showings?id=${showId}`)
      .pipe(map((result) => result[0]));
  }
}
