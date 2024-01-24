import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BusDetailsComponent } from "./bus-details.component";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";
import { BusService, mockData } from "src/app/services/bus/bus.service";
import { DashboardMapService } from "src/app/services/dashboard-map/dashboard-map.service";
import { MatIconModule } from "@angular/material/icon";
import { By } from "@angular/platform-browser";
import { VehicleService } from "../../services/vehicle/vehicle.service";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";

describe("BusDetailsComponent", () => {
  let component: BusDetailsComponent;
  let fixture: ComponentFixture<BusDetailsComponent>;
  let routeService: RouteDetailsService;
  let busService: BusService;
  let dashboardMapService: DashboardMapService;
  let vehicleService: VehicleService;

  beforeEach(() => {
    routeService = jasmine.createSpyObj("RouteDetailsService", ["openViewDetails"]);
    busService = jasmine.createSpyObj("BusService", [
      "setSelectedBusId",
      "getBusesSortedByName",
      "getBusByBusName",
      "getBusByIDandDriver",
    ]);
    dashboardMapService = jasmine.createSpyObj("DashboardMapService", [
      "setMapCenter",
      "zoomInPopUp",
      "zoomOut",
    ]);
    vehicleService = jasmine.createSpyObj("VehicleService", ["locationById"]);
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      providers: [
        { provide: RouteDetailsService, useValue: routeService },
        { provide: DashboardMapService, useValue: dashboardMapService },
        { provide: BusService, useValue: busService },
        { provide: VehicleService, useValue: vehicleService },
      ],
      declarations: [BusDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusDetailsComponent);
    component = fixture.componentInstance;

    component.bus = mockData;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call onZoomIn when the Zoom in Button is clicked", async () => {
    const mockItems = [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.8798529, 37.3914889],
        },
        properties: {},
        id: "142604",
      },
    ];
    const onZoomIn = spyOn(component, "onZoomIn").and.callThrough();

    fixture.detectChanges();
    await fixture.whenStable();
    component.onZoomIn(mockItems[0].id);
    const zoomBtn = fixture.debugElement.query(By.css("#zoomIn"));
    zoomBtn?.triggerEventHandler("click", null);
    expect(onZoomIn).toHaveBeenCalledWith(mockItems[0].id);
  });
  it("should call openViewDetails method with bus route id", async () => {
    const openViewDetailsSpy = spyOn(component, "onViewDetailsClick").and.callThrough();
    fixture.detectChanges();
    await fixture.whenStable();
    component.onViewDetailsClick();
    const button = fixture.debugElement.query(By.css("#viewDetailsBtn"));
    button?.triggerEventHandler("click", null);
    expect(openViewDetailsSpy).toHaveBeenCalled();
  });
  it("should not perform any actions if item is null or undefined", () => {
    const item = "";

    component.onZoomIn(item);

    expect(dashboardMapService.setMapCenter).not.toHaveBeenCalled();
    expect(dashboardMapService.zoomInPopUp).not.toHaveBeenCalled();
  });

  it("should not perform any actions if item does not match any markers", () => {
    const item = "marker_1";
    spyOn(Array.prototype, "find").and.returnValue(undefined);

    component.onZoomIn(item);

    expect(busService.setSelectedBusId).not.toHaveBeenCalled();
    expect(dashboardMapService.setMapCenter).not.toHaveBeenCalled();
    expect(dashboardMapService.zoomInPopUp).not.toHaveBeenCalled();
  });
  it("should not perform any actions if dashboardMapService.markers is null or undefined", () => {
    const item = "marker_1";
    dashboardMapService.markers = [];

    component.onZoomIn(item);

    expect(busService.setSelectedBusId).not.toHaveBeenCalled();
    expect(dashboardMapService.setMapCenter).not.toHaveBeenCalled();
    expect(dashboardMapService.zoomInPopUp).not.toHaveBeenCalled();
  });
  it("should return an empty array if markers or busData is not defined", () => {
    dashboardMapService.markers = [];
    component.busData = {};

    component.bussesOnMap();

    expect(component.bussesOnTheMap).toEqual([]);
  });
  it("should find the marker with the same id", () => {
    const div = document.createElement("div");
    div.id = "marker2";
    const marker = new TrimbleMaps.Marker({
      element: div,
    });
    dashboardMapService.markers = [marker];

    component.busData = {
      items: [
        { id: "marker1", assetNumber: "value1" },
        { id: "marker2", assetNumber: "value2" },
        { id: "marker3", assetNumber: "value3" },
      ],
    };
    component.busData.items = [{ id: "marker2", assetNumber: "value2" }];

    component.bussesOnMap();

    expect(component.bussesOnTheMap).toEqual(["marker2"]);
  });
});
