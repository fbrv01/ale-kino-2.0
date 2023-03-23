import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/app/shared/constants/urls";

export interface TicketType {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: "root",
})
export class MovieTicketTypesService {
  constructor(private http: HttpClient) {}

  fetchMovieTicketTypes(): Observable<TicketType[]> {
    return this.http.get<TicketType[]>(environment.baseUrl + `ticketTypes`);
  }
}
