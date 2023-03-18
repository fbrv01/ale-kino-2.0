import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { combineLatest, map } from "rxjs";
import { addMovies } from "src/app/admin/movie/store/Actions/movie.action";
import { Movie } from "src/app/shared/interfaces/movie.type";
import { MovieService } from "src/app/shared/services/movies/movies.service";

@Component({
  selector: "app-add-movie",
  templateUrl: "./add-movie.component.html",
  styleUrls: ["./add-movie.component.scss"],
})
export class AddMovieComponent {
  constructor(
    private store: Store<{ movies: Movie[] }>,
    private _snackBar: MatSnackBar,
    private movie: MovieService
  ) {}

  form = new FormGroup({
    title: new FormControl({ value: "", disabled: false }, [
      Validators.required,
    ]),
    imageUrl: new FormControl("", [Validators.required]),
    genres: new FormControl("", [Validators.required]),
    time: new FormControl(""),
    ageRestriction: new FormControl("", [Validators.required]),
    descriptionShort: new FormControl("", [Validators.required]),
    descriptionLong: new FormControl("", [Validators.required]),
    duration: new FormControl("", [Validators.required]),
    isPremiere: new FormControl({ value: false, disabled: false }),
  });
  genres$ = this.movie.getGenres();
  ageRestriction$ = this.movie.getAgeRestrictions();
  movieData$ = combineLatest([this.genres$, this.ageRestriction$]).pipe(
    map(([genres, ageRestrictions]) => ({ genres, ageRestrictions }))
  );
  horizontalPosition: MatSnackBarHorizontalPosition = "left";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";

  openSnackBar() {
    this._snackBar.open("Added Movie Succeesfully", "close", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onSubmit() {
    console.log(this.form);

    if (this.form.invalid) {
      return;
    }
    const movie: Movie = {
      id: new Date().valueOf(),
      title: this.form.value.title,
      imageUrl: this.form.value.imageUrl,
      genres: this.form.value.genres,
      time: this.form.value.time,
      ageRestriction: this.form.value.ageRestriction,
      descriptionShort: this.form.value.descriptionShort,
      descriptionLong: this.form.value.descriptionLong,
      duration: this.form.value.duration,
      isPremiere: this.form.value.isPremiere,
    } as Movie;
    this.store.dispatch(addMovies(movie));
    this.form.reset();
    this.openSnackBar();
  }
}
