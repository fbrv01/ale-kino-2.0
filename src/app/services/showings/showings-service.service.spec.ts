import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { ShowingsService } from "./showings-service.service";
import { environment } from "src/app/shared/constants/urls";
import { Showing } from "src/app/shared/interfaces/showing.type";

describe("ShowingsService", () => {
  let service: ShowingsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShowingsService],
    });
    service = TestBed.inject(ShowingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should be able to retrieve showing from the API via GET", () => {
    const showings: Showing[] = [
      {
        id: 16,
        movieId: "1213644",
        movieTitle: "Totalny kataklizm",
        date: "2023-03-05",
        break: 20,
        timeFrom: "14:30",
        timeTo: "16:30",
        availableHallTime: "17:00",
        rows: 10,
        columns: 11,
        hallId: 1,
      },
      {
        id: 24,
        movieId: "270846",
        movieTitle: "Superdzieciaki: Geniusze w pieluchach II",
        date: "2023-03-07",
        break: 15,
        timeFrom: "16:00",
        timeTo: "17:30",
        availableHallTime: "18:00",
        rows: 10,
        columns: 12,
        hallId: 1,
      },
    ];
    service.getAll().subscribe((respose) => {
      expect(respose.length).toBe(2);
      expect(respose).toEqual(showings);
    });
    const request = httpMock.expectOne(
      environment.baseUrl + environment.showings
    );
    expect(request.request.method).toBe("GET");
    request.flush(showings);
  });
});
