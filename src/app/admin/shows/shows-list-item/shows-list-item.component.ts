import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Showing } from "src/app/shared/interfaces/showing.type";

@Component({
  selector: "app-shows-list-item[showing]",
  standalone: true,
  templateUrl: "./shows-list-item.component.html",
  styles: [
    `
      .shows-list-item {
        border: 2px solid;
        padding: 5px;
      }
    `,
  ],
})
export class ShowsListItemComponent {
  @Input() showing!: Showing;
}
