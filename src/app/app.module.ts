import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthService } from "./auth/auth.service";
import { StoreModule } from "@ngrx/store";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RangePipe } from "./shared/pipes/range-pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

//Material Imports
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { EffectsModule } from "@ngrx/effects";
import { movieReducer } from "./admin/movie/store/Reducers/movie.reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { MovieEffects } from "./admin/movie/store/Effects/movie.effects";
import { FooterComponent } from "./layout";
import { NavbarComponent } from "./layout";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MoviesComponent } from "./views/movies/movies.component";
import { NotFoundComponent } from "./not-found/not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    RangePipe,
    FooterComponent,
    NavbarComponent,
    MoviesComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ movies: movieReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    EffectsModule.forRoot([MovieEffects]),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
