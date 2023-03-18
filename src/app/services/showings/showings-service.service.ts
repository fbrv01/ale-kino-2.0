import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/shared/constants/urls";
import { retry, catchError } from "rxjs/operators";

import { Showing } from "src/app/shared/interfaces/showing.type";
import { ErrorHandlerService } from "../../shared/services/error-handle/error-handler.service";

@Injectable({ providedIn: "root" })
export class ShowingsService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getAll() {
    return this.http
      .get<Showing[]>(environment.baseUrl + environment.showings)
      .pipe(retry(1), catchError(this.errorHandler.handleError));
  }
}
