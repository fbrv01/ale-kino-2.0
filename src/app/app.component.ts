import { Component } from "@angular/core";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "cinema";

  constructor(private auth: AuthService) {}
  ngOnInit() {
    const user = this.auth.getSessionInfo();
    this.auth.user.next(user);
  }
}
