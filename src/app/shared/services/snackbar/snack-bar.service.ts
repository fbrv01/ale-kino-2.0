import { inject, Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition = "center";
  private verticalPosition: MatSnackBarVerticalPosition = "bottom";

  openSnackBar(
    message: string,
    duration: number | undefined,
    action = "Close",
    horizontalPosition = this.horizontalPosition,
    verticalPosition = this.verticalPosition
  ) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition,
      verticalPosition,
    });
  }
}
