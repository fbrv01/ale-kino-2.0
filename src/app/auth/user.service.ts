import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/shared/constants/urls";
import { retry, catchError } from "rxjs/operators";

import { User } from "src/app/shared/interfaces/user.type";
import { ErrorHandlerService } from "../shared/services/error-handle/error-handler.service";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}
  getAll() {
    return this.http
      .get<User[]>(environment.baseUrl + environment.users)
      .pipe(retry(1), catchError(this.errorHandler.handleError));
  }
}
