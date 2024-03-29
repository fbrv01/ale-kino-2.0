import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CheckAdminGuard } from "./admin/check-admin.guard";
import { LoginComponent } from "./auth/login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { MoviesComponent } from "./views/movies/movies.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
        canActivate: [CheckAdminGuard],
      },
      {
        path: "",
        children: [
          { path: "", redirectTo: `movies-shows`, pathMatch: "full" },
          {
            path: "movies-shows",
            component: MoviesComponent,
          },
          { path: "movies-shows/:date", component: MoviesComponent },
          {
            path: "wishlist",
            loadComponent: () =>
              import("./views/user-basket/wish-list/wish-list.component"),
          },
          {
            path: "user-tickets",
            loadComponent: () =>
              import("./views/user-basket/user-tickets/user-tickets.component"),
          },
          {
            path: "shows/:id",
            loadChildren: () =>
              import("./views/order-info/tickets/tickets.module"),
          },
          {
            path: "cart",
            loadComponent: () =>
              import("./views/order-info/cart/cart.component"),
          },
          {
            path: "checkout",
            loadChildren: () =>
              import("./views/order-info/checkout/checkout.module"),
          },
          {
            path: "tickets/:id",
            loadComponent: () =>
              import(
                "./views/order-info/order-information/order-information.component"
              ),
          },
        ],
      },
      { path: "login", component: LoginComponent },
      { path: "**", component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
