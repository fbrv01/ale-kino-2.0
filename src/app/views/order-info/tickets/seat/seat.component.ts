import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { BookedSeatsService } from "./booked-seats.service";
import { ReservationService } from "../reservation.service";
import { SeatService } from "./seat.service";

@Component({
  selector: "app-seat",
  templateUrl: "./seat.component.html",
  styleUrls: ["seat.component.scss"],
})
export class SeatComponent implements OnInit {
  @Input() showingId = 0;
  @Output() chooseSeat = new EventEmitter<{ row: string; column: number }>();
  private gridSeatService = inject(SeatService);
  private reservationService = inject(ReservationService);
  private bookedSeatsService = inject(BookedSeatsService);
  rows$ = inject(SeatService).seatGridRows$;
  columns$ = inject(SeatService).seatGridColumns$;

  ngOnInit() {
    this.reservationService.getReservedSeats(this.showingId);
    this.bookedSeatsService.getBookedSeats(this.showingId);
    this.gridSeatService.getSeatGrid(this.showingId);
  }

  onCheckReservedSeats(row: string, column: number): boolean {
    return this.reservationService.canReserve(row, column);
  }

  onCheckBookedSeats(row: string, column: number): boolean {
    return this.bookedSeatsService.canBook(row, column);
  }

  onChooseSeat(row: string, column: number) {
    this.chooseSeat.emit({ row: row, column: column });
  }
}
