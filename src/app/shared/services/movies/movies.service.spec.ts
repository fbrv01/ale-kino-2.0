import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { environment } from "src/app/shared/constants/urls";
import { MovieService } from "./movies.service";
import { Movie } from "src/app/shared/interfaces/movie.type";

describe("MovieService", () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService],
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should be able to retrieve all movies from getAll()", () => {
    const movies: Movie[] = [
      {
        title: "Totalny kataklizm",
        id: 1213644,
        imageUrl: "https://fwcdn.pl/fpo/04/94/480494/7217541.6.jpg",
        genres: "Sci-Fi",
        time: "90 minut",
        ageRestriction: "PG-13",
        descriptionShort:
          " Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis dictum turpis, ut viverra orci. In malesuada, diam in consequat malesuada, enim purus faucibus ex, condimentum vulputate mauris ex vel massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis dictum turpis, ut viverra orci. In malesuada, diam in consequat malesuada, enim purus faucibus ex, condimentum vulputate mauris ex vel massa.",
        descriptionLong:
          " Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis dictum turpis, ut viverra orci. In malesuada, diam in consequat malesuada, enim purus faucibus ex, condimentum vulputate mauris ex vel massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis dictum turpis, ut viverra orci. In malesuada, diam in consequat malesuada, enim purus faucibus ex, condimentum vulputate mauris ex vel massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        duration: 87,
        isPremiere: true,
      },
    ];
    service.getAll().subscribe((respose) => {
      expect(respose.length).toBe(1);
      expect(respose).toEqual(movies);
    });
    const request = httpMock.expectOne(
      environment.baseUrl + environment.movies
    );
    expect(request.request.method).toBe("GET");
    request.flush(movies);
  });
});
