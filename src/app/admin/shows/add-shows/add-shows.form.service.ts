import { inject, Injectable } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import * as moment from "moment";
import { Observable, of, EMPTY, delay, switchMap, map } from "rxjs";
import { Movie } from "src/app/shared/interfaces/movie.type";
import { ScreeningHall, ShowingsApiService } from "../shows.service";

export type ShowingForm = FormGroup<{
  movieTitle: FormControl<string>;
  movieId: FormControl<string>;
  date: FormControl<string>;
  timeFrom: FormControl<string>;
  timeTo: FormControl<string>;
  break: FormControl<number>;
  hallId: FormControl<number>;
  rows: FormControl<number>;
  columns: FormControl<number>;
  availableHallTime: FormControl<string>;
}>;

@Injectable({
  providedIn: "root",
})
export class AddShowingFormService {
  constructor(
    private fb: NonNullableFormBuilder,
    private showingsApiService: ShowingsApiService
  ) {}

  get tomorrow() {
    const today = moment();
    const tomorrow = today.clone().add(1, "days").toISOString();
    return tomorrow;
  }

  createShowingForm(): ShowingForm {
    const form = this.fb.group(
      {
        movieTitle: this.fb.control("", {
          validators: [Validators.required],
        }),
        movieId: this.fb.control("0", {
          validators: [Validators.required, Validators.minLength(2)],
        }),
        date: this.fb.control("", {
          validators: [Validators.required],
        }),
        break: this.fb.control(15, {
          validators: [Validators.required],
        }),
        timeFrom: this.fb.control("", {
          validators: [Validators.required],
        }),
        timeTo: this.fb.control(""),
        availableHallTime: this.fb.control(""),
        hallId: this.fb.control(null as unknown as number, Validators.required),
        rows: this.fb.control(10, {
          validators: [Validators.required],
        }),
        columns: this.fb.control(10, {
          validators: [Validators.required],
        }),
      },
      {
        validators: [],
        asyncValidators: [this.validate.bind(this)],
      }
    );
    return form;
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const form = control as ShowingForm;
    return of(EMPTY).pipe(
      delay(500),
      switchMap(() => {
        return this.showingsApiService
          .getShowingsWithParams(form.getRawValue())
          .pipe(
            map((showing) =>
              showing.length > 0 ? { timeslotTaken: true } : null
            )
          );
      })
    );
  }

  clearForm(form: ShowingForm) {
    form.reset();
    form.markAsPristine();
  }

  updateMovieId(event: { value: string }, movies: Movie[], form: ShowingForm) {
    const movie = movies.find((movie) => movie.title === event.value);
    movie ? form.controls.movieId.setValue(movie.id + "") : null;
  }

  updateRowsAndColumns(
    event: { value: string },
    halls: ScreeningHall[],
    form: ShowingForm
  ) {
    const hall = halls.find((hall) => hall.name === event.value);

    if (hall) {
      form.controls.rows.setValue(hall.rows);
      form.controls.columns.setValue(hall.columns);
      form.controls.hallId.setValue(hall.id);
    }
  }

  setControlsValues(
    movies: Movie[],
    titleFromForm: string,
    timeToControl: FormControl,
    timeFromControl: FormControl,
    hallAvailableControl: FormControl,
    breakControl: FormControl,
    dateControl: FormControl
  ) {
    this.setTimeToValue(movies, titleFromForm, timeToControl, timeFromControl);
    this.setHallAvailableValue(
      hallAvailableControl,
      timeToControl,
      breakControl
    );
    this.setDateValue(dateControl);
  }

  setTimeToValue(
    movies: Movie[],
    titleFromForm: string,
    timeToControl: FormControl,
    timeFromControl: FormControl
  ) {
    const movie = movies.find((movie) => movie.title === titleFromForm);
    const movieDuration = movie?.duration as string;
    timeToControl.setValue(
      this.countTimeTo(timeFromControl.value, movieDuration).slice(1, 6)
    );
  }

  setHallAvailableValue(
    hallAvailableControl: FormControl,
    timeToControl: FormControl,
    breakControl: FormControl
  ) {
    hallAvailableControl.setValue(
      this.countTimeTo(
        timeToControl.value,
        breakControl.value.toString()
      ).slice(1, 6)
    );
  }
  private setDateValue(dateControl: FormControl) {
    dateControl.setValue(
      moment(dateControl.value, "MM-DD-YYYY").format().slice(0, 10)
    );
  }

  private countTimeTo(timeFrom: string, duration: string) {
    return new Date(
      new Date("1970/01/01 " + timeFrom).getTime() + parseInt(duration) * 60000
    )
      .toString()
      .slice(15, 21);
  }
}
