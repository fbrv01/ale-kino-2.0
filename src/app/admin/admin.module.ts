import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminComponent } from "./admin.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
  },
  {
    path: "add-movie",
    loadChildren: () =>
      import("./movie/add-movie/add-movie.module").then(
        (m) => m.AddMovieModule
      ),
  },
  {
    path: "add-shows",
    loadChildren: () => import("./shows/shows.module"),
  },
];

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatButtonModule],
})
export class AdminModule {}
