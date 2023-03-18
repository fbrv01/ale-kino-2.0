import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = "";

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
