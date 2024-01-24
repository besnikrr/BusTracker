import { TestBed } from "@angular/core/testing";
import { RouteDetailsService } from "./route-details.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";

describe("RouteDetailsService", () => {
  let service: RouteDetailsService;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [],
    });
    service = TestBed.inject(RouteDetailsService);
    router = TestBed.inject(Router);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should getRouteByRouteId", () => {
    const res = service.getRouteByRouteId("3fa85f64-5717-4562-b3fc-2c963f66afa6");
    expect(res).toBeDefined();
  });
  it("should openViewDetails", () => {
    const navigateSpy = spyOn(router, "navigate");
    service.openViewDetails(
      "KB258004",
      "4f7e157b-2ca7-4726-98fb-7e3617892a88",
      "a18f92ca-f93c-45be-acd2-3fbc9879ba76",
      "87206351"
    );
    expect(navigateSpy).toHaveBeenCalledWith(
      [
        "/view/KB258004/task/4f7e157b-2ca7-4726-98fb-7e3617892a88/run/a18f92ca-f93c-45be-acd2-3fbc9879ba76",
      ],
      { replaceUrl: true, queryParams: { eventId: "87206351" } }
    );
    service.openViewDetails(
      "KB258004",
      "4f7e157b-2ca7-4726-98fb-7e3617892a88",
      "a18f92ca-f93c-45be-acd2-3fbc9879ba76"
    );
    expect(navigateSpy).toHaveBeenCalledWith(
      [
        "/view/KB258004/task/4f7e157b-2ca7-4726-98fb-7e3617892a88/run/a18f92ca-f93c-45be-acd2-3fbc9879ba76",
      ],
      { replaceUrl: true }
    );
  });
});
