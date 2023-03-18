import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ShowsListComponent } from "./shows-list/shows-list.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { ShowingsEffects } from "./store/Effects/shows.effects";
import { showsReducer } from "./store/Reducer/shows.reducer";
import { showsFeatureKey } from "./store/States/shows.state";
import { MatIconModule } from "@angular/material/icon";
import { ShowsListItemComponent } from "./shows-list-item/shows-list-item.component";
import { AddShowsComponent } from "./add-shows/add-shows.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ShowsListComponent, AddShowsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ShowsListItemComponent,
    MatProgressSpinnerModule,
    SharedModule,
    StoreModule.forFeature(showsFeatureKey, showsReducer),
    EffectsModule.forFeature([ShowingsEffects]),
    RouterModule.forChild([
      { path: "", component: AddShowsComponent },
      {
        path: "shows-list",
        component: ShowsListComponent,
      },
    ]),
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    {
      provide: MAT_DATE_LOCALE,
      useValue: "pl-PL",
    },
  ],
})
export default class ShowsModule {}
