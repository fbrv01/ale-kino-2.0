import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { WishListService } from "./wish-list.service";

@Component({
  selector: "app-wish-list",
  standalone: true,
  templateUrl: "./wish-list.component.html",
  styleUrls: [],
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WishListComponent {
  watchlist: string[] = [];

  titles$ = inject(WishListService).watchList$;
  wishListService = inject(WishListService);

  onDeleteFromWishList(titleId: string) {
    this.wishListService.removeFromWatchlist(titleId);
  }
}
