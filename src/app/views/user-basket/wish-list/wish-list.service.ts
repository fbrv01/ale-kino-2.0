import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/app/shared/constants/urls";
import { User } from "src/app/shared/interfaces/user.type";
export interface WatchListItem {
  id: string;
  userID: number;
  movieID: string;
  movieTitle: string;
}
@Injectable({
  providedIn: "root",
})
export class WishListService {
  private currentUserID$ = inject(AuthService).userInfo$;
  private http = inject(HttpClient);
  private watchList$$ = new BehaviorSubject<
    { title: string; titleId: string }[]
  >([]);
  get watchList$() {
    return this.watchList$$.asObservable();
  }

  constructor() {
    this.getWatchList();
  }

  getUserWatchlist(userID: number): Observable<WatchListItem[]> {
    return this.http.get<WatchListItem[]>(
      environment.baseUrl + `watchlist?userID=${userID}`
    );
  }

  post(user: User, movieTitle: string, movieID: string) {
    return this.http.post<WatchListItem>(environment.baseUrl + `watchlist`, {
      userID: user.userID,
      movieID: movieID,
      movieTitle: movieTitle,
    });
  }

  delete(titleId: string) {
    return this.http.delete<WatchListItem>(
      environment.baseUrl + `watchlist/${titleId}`
    );
  }

  getWatchList() {
    this.currentUserID$
      .pipe(
        switchMap((user) => this.getUserWatchlist(user!.userID)),
        map((result) =>
          result.map((res: { movieTitle: string; id: string }) => {
            return { title: res.movieTitle, titleId: res.id };
          })
        )
      )
      .subscribe((myWatchlist) => this.watchList$$.next(myWatchlist));
  }

  addToWatchlist(movieTitle: string, movieID: string) {
    if (this.watchList$$.value.some((item) => item.title === movieTitle)) {
      alert("Already added in list");
    } else {
      this.currentUserID$
        .pipe(switchMap((user) => this.post(user!, movieTitle, movieID)))
        .subscribe({
          next: (response) =>
            this.watchList$$.next([
              ...this.watchList$$.value,
              { title: movieTitle, titleId: response.id },
            ]),
          error: (error) => {
            console.error("ERROR!", error);
          },
        });
    }
  }

  removeFromWatchlist(titleId: string) {
    this.delete(titleId).subscribe({
      next: () =>
        this.watchList$$.next(
          this.watchList$$.value.filter((item) => item.titleId !== titleId)
        ),
      error: (error) => {
        console.error("Error", error);
      },
    });
  }

  checkIfOnWatchlist(movieTitle: string): boolean {
    const filteredWatchlist = this.watchList$$.value.filter(
      (item) => item.title === movieTitle
    );
    return filteredWatchlist.length > 0;
  }
}
