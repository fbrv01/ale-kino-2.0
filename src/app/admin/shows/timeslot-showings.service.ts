import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Showing } from "src/app/shared/interfaces/showing.type";
@Injectable({
  providedIn: "root",
})
export class TimeslotShowingsService {
  private timeslotShowings$$ = new ReplaySubject<Showing[]>(1);

  get timeslotShowings$() {
    return this.timeslotShowings$$.asObservable();
  }

  update(showings: Showing[]) {
    this.timeslotShowings$$.next(showings);
  }
}
