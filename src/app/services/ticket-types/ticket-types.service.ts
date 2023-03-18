import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/shared/constants/urls";
import { retry, catchError } from "rxjs/operators";

import { TicketType } from "src/app/shared/interfaces/ticket-type";
import { ErrorHandlerService } from "../../shared/services/error-handle/error-handler.service";

@Injectable({ providedIn: "root" })
export class TicketTypesService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getAll() {
    return this.http
      .get<TicketType[]>(environment.baseUrl + environment.ticketTypes)
      .pipe(retry(1), catchError(this.errorHandler.handleError));
  }
}
