import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, throwError } from "rxjs";
import { ShowingsApiService } from "../../shows.service";
import { ShowsActions, ShowsAPIActions } from "../Actions/shows.actions";

@Injectable()
export class ShowingsEffects {
  constructor(
    private router: Router,
    private showingsApiService: ShowingsApiService,
    private actions$: Actions
  ) {}

  addShowingEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShowsActions.addNewShowing),
      exhaustMap((action) =>
        this.showingsApiService.add(action).pipe(
          catchError((error) => {
            return throwError(() => new Error(error));
          })
        )
      ),
      map((movieShowing) => {
        this.router.navigate(["admin/add-shows/shows-list"]);
        return ShowsAPIActions.addNewShowingSuccess(movieShowing);
      })
    );
  });

  getShowingEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShowsActions.getAllShowings),
      exhaustMap(() =>
        this.showingsApiService.getShowings().pipe(
          catchError((error) => {
            return throwError(() => new Error(error));
          })
        )
      ),
      map((showings) =>
        ShowsAPIActions.getAllShowingsSuccess({ showsList: showings })
      )
    );
  });
}
