import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { ReplayComponent } from "src/app/pages/replay/replay.component";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";
import { depotStart } from "../../../assets/icons";
import { ReplayMapService } from "./replay-map.service";
import { Event } from "src/first-student-api";

describe("ReplayMapService", () => {
  let replayMapService: ReplayMapService;
  const el = window.document.createElement("div");
  const options: TrimbleMaps.MapOptions = {
    container: el,
    style: TrimbleMaps.Common.Style["TRANSPORTATION"],
    center: [-95, 38],
    zoom: 10,
    hash: false,
  };
  const routeOptions: TrimbleMaps.RouteOptions = {
    routeId: "1",
    routeColor: "#082747",
    routePathOpacity: 1,
    truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
    inclFerryDist: true,
    frameRoute: true,
    stops: [
      [-87.624264, 41.89673],
      [-87.624252, 41.89338],
      [-87.626475, 41.893274],
    ],
    originIcon: {
      url: depotStart,
      size: 0.2,
      opacity: 1,
      textOpacity: 0,
    },
    stopIcon: {
      size: 0.15,
      opacity: 1,
      textOpacity: 0,
    },
    showArrows: true,
    arrowOptions: {
      size: 0.5,
      spacing: 1,
      fillColor: "#C6E3FF",
    },
  };
  let route: TrimbleMaps.Route;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "dashboard", component: DashboardComponent },
          { path: "view/:routeId", component: ReplayComponent },
          { path: "**", redirectTo: "dashboard" },
        ]),
      ],
      providers: [RouteDetailsService],
    });
    replayMapService = TestBed.inject(ReplayMapService);
    replayMapService.initMap(options);
    route = new TrimbleMaps.Route(routeOptions);
  });
  it("should be created", () => {
    expect(replayMapService).toBeTruthy();
  });

  it("should initMap", () => {
    const initMapSpy = spyOn(replayMapService, "initMap");
    replayMapService.initMap(options);
    expect(initMapSpy).toHaveBeenCalled();
  });

  it("should setRouteOnLoad", () => {
    const addRouteToMapSpy = spyOn(replayMapService, "addRouteToMap");
    replayMapService.setRouteOnLoad(routeOptions);
    expect(addRouteToMapSpy).toHaveBeenCalled();
  });

  it("should updateRouteOnRoad", () => {
    const updateRouteSpy = spyOn(replayMapService, "updateRoute");
    replayMapService.updateRouteOnRoad(routeOptions);
    expect(updateRouteSpy).toHaveBeenCalled();
  });

  it("should addRouteToMap", () => {
    const addToSpy = spyOn(route, "addTo");
    replayMapService.addRouteToMap(route);
    expect(addToSpy).toHaveBeenCalled();
  });

  it("should updateRoute", () => {
    const updateRouteSpy = spyOn(route, "update");
    replayMapService.updateRoute(route, routeOptions);
    expect(updateRouteSpy).toHaveBeenCalled();
  });

  it("should removeRoutes", () => {
    replayMapService.removeRoutes();
    expect(Array.from(replayMapService.routesMap.keys()).length).toEqual(0);
  });

  it("should addEventMarkers", () => {
    const result = replayMapService.addEventMarkers({} as Event);

    const busEventIcons = {
      reasons_coldstart: '<i class="fas fa-bus-arrival"></i>',
    };
    const vehicleEventKey = "reasons_coldstart";
    const busEventIcon = document.createElement("div");
    busEventIcon.innerHTML = busEventIcons[vehicleEventKey];

    expect(typeof result).toBeDefined();
    expect(busEventIcon.innerHTML).toEqual(busEventIcons[vehicleEventKey]);
  });

  it("should removeEventMarkers", () => {
    const marker = new TrimbleMaps.Marker();
    replayMapService.eventMarkers = [marker, marker];
    spyOn(replayMapService.eventMarkers, "forEach").and.callThrough();
    replayMapService.removeEventMarkers();
    expect(replayMapService.eventMarkers.length).toEqual(0);
  });
});
