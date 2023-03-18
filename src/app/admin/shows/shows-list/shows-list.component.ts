import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { ShowsActions } from "../store/Actions/shows.actions";
import { selectShowsList } from "../store/Selector/shows.selector";

@Component({
  selector: "app-showings-list",
  templateUrl: "shows-list.component.html",
  styles: [
    `
      li {
        border: 2px solid white;
        padding: 5px;
        border-radius: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowsListComponent implements OnInit {
  private store = inject(Store);
  showings$ = this.store.select(selectShowsList);
  allShowings$ = this.showings$;

  ngOnInit() {
    this.store.dispatch(ShowsActions.getAllShowings());
  }
}
