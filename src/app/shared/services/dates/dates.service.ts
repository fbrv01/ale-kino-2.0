import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DatesService {
  getCurrentWeek() {
    const today = new Date();
    const week = [];

    for (let i = 1; i <= 7; i++) {
      const first = today.getDate() - today.getDay() + i;
      const day = new Date(today.setDate(first)).toISOString().slice(0, 10);
      week.push(day);
    }
    return week;
  }
  getCurrentDay() {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }
}
