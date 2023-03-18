import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { UserService } from "src/app/auth/user.service";
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { User } from "src/app/shared/interfaces/user.type";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class LoginComponent implements OnInit {
  users$!: Observable<User[]>;
  error: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  constructor(
    private userService: UserService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.users$ = this.userService.getAll();
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.users$
      .pipe(
        map((users) =>
          users.filter(
            (user) => user.email === email && user.password == password
          )
        )
      )
      .subscribe((results) => {
        const [user] = results;
        if (user) {
          this.authService.setSession(user);
          if (user.role === "Admin") {
            this.router.navigate(["/admin"]);
          } else {
            this.router.navigate(["/movies-shows"]);
          }
        } else this.error = true;
      });
  }
}
