import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { mockVehicle } from "src/app/mock/mockData";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { ReplayComponent } from "src/app/pages/replay/replay.component";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";
import { VehicleEventFeature } from "src/first-student-api";
import { VehicleService } from "../vehicle/vehicle.service";
import { DashboardMapService } from "./dashboard-map.service";

describe("DashboardMapService", () => {
  let dashboardMapService: DashboardMapService;
  const el = window.document.createElement("div");
  const options: TrimbleMaps.MapOptions = {
    container: el,
    style: TrimbleMaps.Common.Style["TRANSPORTATION"],
    center: [-95, 38],
    zoom: 10,
    hash: false,
  };

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
    dashboardMapService = TestBed.inject(DashboardMapService);
    dashboardMapService.initMap(options);
  });

  it("should be created", () => {
    expect(dashboardMapService).toBeTruthy();
  });

  it("should initMap", () => {
    const initMapSpy = spyOn(dashboardMapService, "initMap");
    dashboardMapService.initMap(options);
    expect(initMapSpy).toHaveBeenCalled();
  });

  it("should setMapCenter panTo true", () => {
    const panTo = true;
    const lngLat: { lng: number; lat: number } | [number, number] = [-93, 40];
    spyOn(dashboardMapService.map, "panTo");
    dashboardMapService.setMapCenter(lngLat, panTo);
    expect(dashboardMapService.map.panTo).toHaveBeenCalled();
  });

  it("should setMapCenter panTo false", () => {
    const panTo = false;
    const lngLat: { lng: number; lat: number } | [number, number] = [-93, 40];
    spyOn(dashboardMapService.map, "setCenter");
    dashboardMapService.setMapCenter(lngLat, panTo);
    expect(dashboardMapService.map.setCenter).toHaveBeenCalled();
  });

  it("should zoomInPopUp", () => {
    const setZoomSpy = spyOn(dashboardMapService.map, "setZoom");
    dashboardMapService.zoomInPopUp();
    expect(setZoomSpy).toHaveBeenCalled();
  });

  it("should addVehicleMarkerIcon", () => {
    const vehicles: VehicleEventFeature[] = [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.401843, 36.8224254],
        },
        properties: {
          id: "101962",
          type: "SD",
          assetNumber: "101962",
          eventId: "426d15de-59b2-4185-aad9-4ffdf226e999",
          eventStartTime: "2023-03-22T13:49:48.000Z",
          eventEndTime: "2023-03-22T13:49:48.000Z",
          heading: 311,
          speed: 0,
          speedUnit: "MPH",
        },
        id: "101962",
      },
    ];
    expect(dashboardMapService.markers.length).toEqual(0);
    dashboardMapService.addVehicleMarkerIcon(vehicles);
    expect(dashboardMapService.markers.length).toBeGreaterThan(0);
  });

  it("should addVehicleMarkerIcon and show popup", () => {
    const vehicles: VehicleEventFeature[] = [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.401843, 36.8224254],
        },
        properties: {
          id: "101978",
          type: "SD",
          assetNumber: "101962",
          eventId: "426d15de-59b2-4185-aad9-4ffdf226e999",
          eventStartTime: "2023-03-22T13:49:48.000Z",
          eventEndTime: "2023-03-22T13:49:48.000Z",
          heading: 311,
          speed: 0,
          speedUnit: "MPH",
        },
        id: "101978",
      },
    ];

    const popupHtmlSpy = spyOn(TrimbleMaps.Popup.prototype, "setHTML");
    const vehicleTask = spyOn(VehicleService.prototype, "task").and.returnValue(
      Promise.resolve(mockVehicle)
    );

    dashboardMapService.vehicleData = mockVehicle;
    dashboardMapService.addVehicleMarkerIcon(vehicles);

    expect(dashboardMapService.markers.length).toBeGreaterThan(0);
    expect(popupHtmlSpy).toHaveBeenCalled();
    expect(vehicleTask).toHaveBeenCalled();
  });

  it("should zoomToBoundingBox", () => {
    const vehicles: VehicleEventFeature[] = [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.401843, 36.8224254],
        },
        properties: {
          id: "101962",
          type: "SD",
          assetNumber: "101962",
          eventId: "426d15de-59b2-4185-aad9-4ffdf226e999",
          eventStartTime: "2023-03-22T13:49:48.000Z",
          eventEndTime: "2023-03-22T13:49:48.000Z",
          heading: 311,
          speed: 0,
          speedUnit: "MPH",
        },
        id: "101962",
      },
    ];
    spyOn(dashboardMapService.map, "fitBounds");
    dashboardMapService.zoomToBoundingBox(vehicles);
    expect(dashboardMapService.map.fitBounds).toHaveBeenCalled();
  });

  it("should show route details", () => {
    const routeId = "<route-id>";
    const popup = new TrimbleMaps.Popup();
    const popupSpy = spyOn(popup, "remove");

    const openViewDetailsSpy = spyOn(RouteDetailsService.prototype, "openViewDetails");

    dashboardMapService.handleRouteDetails(popup, routeId);

    expect(openViewDetailsSpy).toHaveBeenCalled();
    expect(popupSpy).toHaveBeenCalled();
  });

  it("should remove popup on close", () => {
    const popup = new TrimbleMaps.Popup();
    const popupSpy = spyOn(popup, "remove");

    dashboardMapService.handleCloseBtn(popup);

    expect(popupSpy).toHaveBeenCalled();
  });

  it("should removeMarkers", () => {
    const marker = new TrimbleMaps.Marker();
    dashboardMapService.markers = [marker, marker];
    spyOn(dashboardMapService.markers, "forEach").and.callThrough();
    dashboardMapService.removeMarkers();
    expect(dashboardMapService.markers.length).toEqual(0);
  });
});
