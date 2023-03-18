import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { User } from "src/app/shared/interfaces/user.type";

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  userInfo$ = this.user.asObservable();
  constructor(private router: Router) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return Boolean(token);
  }

  public setSession(user: User): void {
    const token = btoa(JSON.stringify(user));
    localStorage.setItem("token", token);
    this.user.next(user);
  }

  public getSessionInfo(): User | null {
    try {
      const token = localStorage.getItem("token") || "";
      const user = JSON.parse(atob(token));
      return user;
    } catch {
      return null;
    }
  }

  public logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/"]);
  }
}
