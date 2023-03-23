import { Component, Input } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { MovieRatings, MoviesShowingService } from "../movie-shows.service";

@Component({
  selector: "app-add-rating",
  templateUrl: "./add-rating.component.html",
  styleUrls: ["./add-rating.component.scss"],
})
export class AddRatingComponent {
  @Input() role!: string;
  @Input() movieId!: string;
  showRater = false;
  ratingValue = "1";
  ratingBtnDisable = false;
  ratingList$;
  userId!: number;
  constructor(
    private showingsService: MoviesShowingService,
    private auth: AuthService
  ) {
    this.ratingList$ = this.showingsService.movieRatingList$;
  }

  ngOnInit() {
    this.userId = this.auth.getSessionInfo()?.userID as number;
    this.showingsService.fetchMovieRating(this.movieId);
    this.showingsService.movieRating$.subscribe((val) => {
      if (
        val.filter(
          (element: MovieRatings) =>
            element.userID == this.auth.getSessionInfo()?.userID
        ).length > 0
      ) {
        this.ratingBtnDisable = true;
      } else {
        this.ratingBtnDisable = false;
      }
    });
  }

  setRating() {
    this.showingsService.putMovieRating(
      this.userId,
      +this.ratingValue,
      this.movieId
    );
    this.showRater = false;
    this.ratingBtnDisable = true;
  }
}
