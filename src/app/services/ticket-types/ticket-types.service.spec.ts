import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/app/shared/constants/urls';
import { TicketType } from 'src/app/shared/interfaces/ticket-type';

import { TicketTypesService } from './ticket-types.service';

describe('TicketTypesService', () => {
  let service: TicketTypesService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketTypesService],
    });
    service = TestBed.inject(TicketTypesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to retrieve all ticketTypes from getAll()', () => {
    const ticketTypes: TicketType[] = [
      {
        id: 1,
        name: 'Normalny',
        price: 25,
      },
      {
        id: 2,
        name: 'Karta dużej rodziny',
        price: 20,
      },
    ];
    service.getAll().subscribe((respose) => {
      expect(respose.length).toBe(2);
      expect(respose).toEqual(ticketTypes);
    });
    const request = httpMock.expectOne(
      environment.baseUrl + environment.ticketTypes
    );
    expect(request.request.method).toBe('GET');
    request.flush(ticketTypes);
  });
});
