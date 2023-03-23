import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Showing } from "src/app/shared/interfaces/showing.type";

@Component({
  selector: "app-showing-details",
  standalone: true,
  templateUrl: "./showing-details.component.html",
  imports: [CommonModule],
})
export default class ShowingDetailsComponent {
  @Input() showingId = 0;
  @Input() showsInfo!: Showing;
}
