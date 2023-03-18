import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/shared/interfaces/user.type";
import { DatesService } from "src/app/shared/services/dates/dates.service";
import { WishListService } from "../user-basket/wish-list/wish-list.service";
import { MoviesShowingService } from "./movie-shows.service";

@Component({
  selector: "app-movies",
  templateUrl: "./movies.component.html",
  styleUrls: ["./movies.component.scss"],
})
export class MoviesComponent implements OnInit {
  today = this.datesService.getCurrentDay();
  week = this.datesService.getCurrentWeek();
  movies$ = this.showingsService.showings$;
  chosenDate = "";
  user$!: Observable<User | null>;
  constructor(
    private showingsService: MoviesShowingService,
    private router: Router,
    private datesService: DatesService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private wishList: WishListService
  ) {
    this.chosenDate = this.route.snapshot.paramMap.get("date") as string;
  }

  ngOnInit() {
    this.user$ = this.auth.userInfo$;
    if (this.chosenDate && this.chosenDate >= this.today) {
      this.onDateChange(this.chosenDate);
    } else {
      this.router.navigate(["movies-shows", this.today]);
    }
  }

  onDateChange(date: string) {
    this.router.navigate(["movies-shows", date]);
    this.showingsService.fetchShowings(date);
  }

  onWatchlist(movieTitle: string): boolean {
    return this.wishList.checkIfOnWatchlist(movieTitle);
  }
  onUpdateWatchlist(movieTitle: string, movieID: string) {
    this.wishList.addToWatchlist(movieTitle, movieID);
  }
}
