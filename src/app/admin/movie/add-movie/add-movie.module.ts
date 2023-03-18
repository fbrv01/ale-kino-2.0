import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AddMovieComponent } from "./add-movie.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NumberDirective } from "src/app/shared/directives/numbers-only.directive";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { SharedModule } from "src/app/shared/shared.module";
const routes: Routes = [
  {
    path: "",
    component: AddMovieComponent,
  },
];

@NgModule({
  declarations: [AddMovieComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class AddMovieModule {}
