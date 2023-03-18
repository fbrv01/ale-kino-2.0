import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/shared/interfaces/user.type";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  user$!: Observable<User | null>;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user$ = this.auth.userInfo$;
  }

  logout() {
    this.auth.logout();
    this.auth.user.next(null);
  }
}
