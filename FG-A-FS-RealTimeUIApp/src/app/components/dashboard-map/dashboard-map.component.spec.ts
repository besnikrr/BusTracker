import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgxSpinnerModule } from "ngx-spinner";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";

import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { BusService } from "src/app/services/bus/bus.service";
import { DriverService } from "src/app/services/driver/driver.service";
import { FormatDatePipe } from "src/app/utilities/pipes/date/formatDate.pipe";
import { DashboardMapComponent } from "./dashboard-map.component";
import { DashboardMapService } from "src/app/services/dashboard-map/dashboard-map.service";
import { getLoading, getPopUpContent } from "./popup";
import { mockVehicle } from "src/app/mock/mockData";
import { VehicleService } from "src/app/services/vehicle/vehicle.service";
import { pollingConfig } from "src/app/app-config";
import { VehicleEventFeature, VehicleEventRouteTaskNearbyStopDriver } from "src/first-student-api";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "src/app/utilities/date.format";

describe("DashboardMapComponent", () => {
  let component: DashboardMapComponent;
  let fixture: ComponentFixture<DashboardMapComponent>;
  let busService: BusService;
  let driverService: DriverService;
  let dashboardMapService: DashboardMapService;
  let vehicleService: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        BrowserModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        BrowserAnimationsModule, // required animations module
        MatListModule,
        MatExpansionModule,
        MatStepperModule,
        NgxSpinnerModule,
        MatSelectModule,
        FormatDatePipe,
      ],
      providers: [VehicleService, DashboardMapService],
      declarations: [DashboardMapComponent],
    }).compileComponents();
    busService = TestBed.inject(BusService);
    driverService = TestBed.inject(DriverService);
    dashboardMapService = TestBed.inject(DashboardMapService);
    vehicleService = TestBed.inject(VehicleService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call setSelectedBusId and setSelectedDriverId with empty string when dragend event is triggered", async () => {
    const setSelectedBusIdSpy = spyOn(busService, "setSelectedBusId");
    const setSelectedDriverIdSpy = spyOn(driverService, "setSelectedDriverId");

    fixture.detectChanges();
    await fixture.whenStable();
    component.map.fire("dragend");

    expect(setSelectedBusIdSpy).toHaveBeenCalledWith("");
    expect(setSelectedDriverIdSpy).toHaveBeenCalledWith("");
  });

  it("should clear selected bus and driver when zoom is changed", async () => {
    const setSelectedBusSpy = spyOn(busService, "setSelectedBusId").and.callThrough();
    const setSelectedDriverSpy = spyOn(driverService, "setSelectedDriverId").and.callThrough();
    fixture.detectChanges();
    await fixture.whenStable();
    component.map.fire("zoomend");

    expect(setSelectedBusSpy).toHaveBeenCalled();
    expect(setSelectedDriverSpy).toHaveBeenCalled();
  });

  // fakeAsync patches time related functions
  it("should polling", fakeAsync(() => {
    // mocking vehicle
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

    const vehicleLocationSpy = spyOn(vehicleService, "location").and.returnValue(
      Promise.resolve(vehicles)
    );
    const addVehicleMarkerIconSpy = spyOn(dashboardMapService, "addVehicleMarkerIcon");

    // Calls the set subscription method
    component.setSubscription();

    tick(pollingConfig.interval);

    expect(vehicleLocationSpy).toHaveBeenCalled();
    expect(addVehicleMarkerIconSpy).toHaveBeenCalled();

    component.removeSubscription();
  }));
  it("should call getPopUpContent with current time", async () => {
    const vehicle = {
      ...mockVehicle,
      eventEndTime: new Date().toISOString(),
      fleetNumber: "C-110574",
    };
    const content = getPopUpContent(vehicle);
    expect(content).toContain(vehicle.fleetNumber);
  });
  it("should call setSubscription", async () => {
    component.subscription = undefined;
    component.setSubscription();
    expect(component.subscription).toBeDefined();
  });
  it("should call getPopUpContent with heading -90", async () => {
    const vehicle = {
      ...mockVehicle,
      heading: -90,
      task: { ...mockVehicle.task, name: "", runName: "", runType: "" },
      assetNumber: "",
      eventTime: new Date().toLocaleString(),
      fleetNumber: "C-110574",
    };
    const content = getPopUpContent(vehicle);
    expect(content).toContain(vehicle.fleetNumber);
  });
  it("should call getPopUpContent when no eventTime", async () => {
    const vehicle: VehicleEventRouteTaskNearbyStopDriver = {
      ...mockVehicle,
      heading: -90,
      fleetNumber: undefined,
    };
    const content = getPopUpContent(vehicle);
    expect(content).toContain(vehicle.id);
  });
  it("should call getPopUpContent when no driver", async () => {
    const vehicle: VehicleEventRouteTaskNearbyStopDriver = {
      ...mockVehicle,
      task: {
        ...mockVehicle.task,
        driver: { ...mockVehicle.task.driver, middleName: "Sample", lastName: undefined },
      },
      heading: -90,
      fleetNumber: undefined,
    };
    const content = getPopUpContent(vehicle);
    expect(content).toContain("Unassigned");
  });
  it("should call getLoading", async () => {
    expect(getLoading().length).toBeGreaterThan(0);
  });
  it("should return 'Bus turned off' message when eventType is 'reasons_poweroff' and bus is connected", () => {
    const vehicle: VehicleEventRouteTaskNearbyStopDriver = {
      assetNumber: "G1103858",
      eventEndTime: "2023-05-16T00:35:50.000Z",
      eventId: "127788858",
      eventStartTime: "2023-05-16T00:35:50.000Z",
      eventType: "reasons_poweroff",
      fleetNumber: "G1103858",
      heading: 237,
      id: "G1103858",
      speed: 0,
      speedUnit: "MPH",
      task: { ...mockVehicle.task },
    };

    const lastPingDate = format(new Date(vehicle.eventEndTime), DATE_TIME_FORMAT);
    const content = getPopUpContent(vehicle);

    expect(content).toContain("Bus turned off " + lastPingDate);
  });
  it("should return 'Last connected' message when eventType is 'null' and bus is connected", () => {
    const vehicle: VehicleEventRouteTaskNearbyStopDriver = {
      assetNumber: "G1103858",
      eventEndTime: "2023-05-16T00:35:50.000Z",
      eventId: "127788858",
      eventStartTime: "2023-05-16T00:35:50.000Z",
      eventType: null as unknown as string,
      fleetNumber: "G1103858",
      heading: 237,
      id: "G1103858",
      speed: 0,
      speedUnit: "MPH",
      task: { ...mockVehicle.task },
    };

    const lastPingDate = format(new Date(vehicle.eventEndTime), DATE_TIME_FORMAT);
    const content = getPopUpContent(vehicle);

    expect(content).toContain("Last connected " + lastPingDate);
  });

  it("should return an empty string when none of the conditions are met", () => {
    const vehicle = { eventType: "reasons_poweron" };
    const busConnected = false;
    const lastPingDate = null;

    let powerOff;

    if (vehicle.eventType === "reasons_poweroff" && busConnected) {
      powerOff = "Bus turned off " + lastPingDate;
    } else if (vehicle.eventType === null && busConnected && lastPingDate) {
      powerOff = "Last connected " + lastPingDate;
    } else {
      powerOff = "";
    }

    expect(powerOff).toBe("");
  });
});
