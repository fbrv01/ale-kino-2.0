import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import ShowingDetailsComponent from '../showing-details/showing-details.component';
import { OrderData, TicketsService } from '../tickets/tickets.service';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-order-information',
  standalone: true,
  templateUrl: './order-information.component.html',
  styleUrls: ['./order-information.component.scss'],
  imports: [CommonModule, ShowingDetailsComponent],
})
export default class OrderSummaryComponent implements OnInit {
  constructor(private ticketsService: TicketsService) {}
  private routeParams = inject(ActivatedRoute).snapshot.paramMap;
  orderTickets$?: Observable<OrderData[]>;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = 'https://www.techiediaries.com/';

  ngOnInit() {
    const orderId = this.routeParams.get('id');
    this.orderTickets$ = this.ticketsService.getOrderById(orderId!);
  }
}
