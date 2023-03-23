import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserTicketsApiService } from "./user-tickets.service";

@Component({
  selector: "app-user-tickets",
  standalone: true,
  templateUrl: "./user-tickets.component.html",
  imports: [CommonModule, RouterModule],
})
export default class UserTicketsComponent implements OnInit {
  constructor(private userTicketsService: UserTicketsApiService) {}
  userTickets$ = this.userTicketsService.userTickets$;
  ngOnInit() {
    this.userTicketsService.getUserTickets();
  }
}
