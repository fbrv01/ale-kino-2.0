import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, map, Observable } from "rxjs";
import { Movie } from "src/app/shared/interfaces/movie.type";
import { Showing } from "src/app/shared/interfaces/showing.type";
import { ScreeningHall, ShowingsApiService } from "../shows.service";
import { ShowsActions } from "../store/Actions/shows.actions";
import { TimeslotShowingsService } from "../timeslot-showings.service";
import { AddShowingFormService } from "./add-shows.form.service";

@Component({
  selector: "app-add-shows",
  templateUrl: "add-shows.component.html",
  styleUrls: ["add-shows.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddShowsComponent {
  constructor(
    private addShowingFormService: AddShowingFormService,
    private showingsApiService: ShowingsApiService,
    private store: Store,
    private TimeslotShowingsService: TimeslotShowingsService
  ) {}
  addShowingForm = this.addShowingFormService.createShowingForm();
  showings$!: Observable<Showing[]>;
  movies$ = this.showingsApiService.getMovies();
  halls$ = this.showingsApiService.getHalls();
  dataForShowing$ = combineLatest([this.movies$, this.halls$]).pipe(
    map(([movies, halls]) => ({ movies, halls }))
  );
  tomorrow = this.addShowingFormService.tomorrow;

  get movieTitleControl() {
    return this.addShowingForm.controls.movieTitle;
  }
  get dateControl() {
    return this.addShowingForm.controls.date;
  }
  get breakControl() {
    return this.addShowingForm.controls.break;
  }
  get hallIdControl() {
    return this.addShowingForm.controls.hallId;
  }
  get timeFromControl() {
    return this.addShowingForm.controls.timeFrom;
  }

  get timeToControl() {
    return this.addShowingForm.controls.timeTo;
  }
  get hallAvailableControl() {
    return this.addShowingForm.controls.availableHallTime;
  }
  get rowsControl() {
    return this.addShowingForm.controls.rows;
  }
  get columnsControl() {
    return this.addShowingForm.controls.columns;
  }

  getShowings() {
    this.showings$ = this.TimeslotShowingsService.timeslotShowings$;
  }

  setTimeControlValues(movies: Movie[]) {
    this.addShowingFormService.setTimeToValue(
      movies,
      this.movieTitleControl.value,
      this.timeToControl,
      this.timeFromControl
    );
    this.addShowingFormService.setHallAvailableValue(
      this.hallAvailableControl,
      this.timeToControl,
      this.breakControl
    );
  }

  addShowing(movies: Movie[]) {
    this.addShowingForm.markAllAsTouched();
    this.addShowingFormService.setControlsValues(
      movies,
      this.movieTitleControl.value,
      this.timeToControl,
      this.timeFromControl,
      this.hallAvailableControl,
      this.breakControl,
      this.dateControl
    );

    this.store.dispatch(
      ShowsActions.addNewShowing(this.addShowingForm.getRawValue())
    );
    this.addShowingForm.reset();
  }

  updateMovieId(event: { value: string }, movies: Movie[]) {
    this.addShowingFormService.updateMovieId(
      event,
      movies,
      this.addShowingForm
    );
  }
  updateRowsAndColumns(event: { value: string }, halls: ScreeningHall[]) {
    this.addShowingFormService.updateRowsAndColumns(
      event,
      halls,
      this.addShowingForm
    );
  }
}
