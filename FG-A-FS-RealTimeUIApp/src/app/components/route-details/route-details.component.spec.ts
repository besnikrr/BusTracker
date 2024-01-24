import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouteDetailsComponent } from "./route-details.component";
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
import { TimelineComponent } from "src/app/components/timeline/timeline.component";
import { BusService } from "src/app/services/bus/bus.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { BusDetailsComponent } from "../bus-details/bus-details.component";
import { FormatTimePipe } from "src/app/utilities/pipes/time/formatTime.pipe";
import { mockRoute, mockVehicle } from "src/app/mock/mockData";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { VehicleService } from "src/app/services/vehicle/vehicle.service";
import { DriverFullNamePipe } from "src/app/utilities/pipes/driverName/formatDriverName.pipe";
import { VehicleEventRouteTaskNearbyStopDriver } from "src/first-student-api";

describe("RouteDetailsComponent", () => {
  let component: RouteDetailsComponent;
  let fixture: ComponentFixture<RouteDetailsComponent>;
  let busService: BusService;
  let vehicleService: VehicleService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
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
        MatProgressBarModule,
        RouterTestingModule.withRoutes([
          { path: "dashboard", component: DashboardComponent },
          { path: "view/:routeId/task/:taskId/run/:runId", component: DashboardComponent },
          { path: "**", redirectTo: "dashboard" },
        ]),
        FormatTimePipe,
        DriverFullNamePipe,
      ],
      declarations: [RouteDetailsComponent, TimelineComponent, BusDetailsComponent],
      providers: [
        BusService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (routeId: string) => {
                  routeId = "1";
                  return routeId;
                },
              },
              queryParamMap: {
                get: (routeId: string) => {
                  routeId = "1";
                  return routeId;
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(RouteDetailsComponent);
    component = fixture.componentInstance;
    busService = TestBed.inject(BusService);
    vehicleService = TestBed.inject(VehicleService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    component.routeDetails = mockRoute;
    fixture.detectChanges();
  });

  it("should create and should set default route details", () => {
    spyOn(vehicleService, "task").and.returnValue(Promise.resolve(mockRoute));
    expect(component).toBeTruthy();
  });
  it("should openViewDetails", fakeAsync(() => {
    router.navigate(["/dashboard"], { replaceUrl: true });
    tick();
    component.closeViewDetails();
    expect(component.routeDetails).toEqual(mockRoute);
  }));

  // it("should search toggle on X click", async () => {
  //   component.isNearbyBuses = true;
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   const closeIcon = fixture.debugElement.query(By.css("#closeNearby")).nativeElement;
  //   closeIcon.click();
  //   const toggleNearbyBusesSpy = spyOn(component, "toggleNearbyBuses");
  //   component.toggleNearbyBuses();
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   expect(toggleNearbyBusesSpy).toHaveBeenCalled();
  //   expect(component.isNearbyBuses).toEqual(false);
  // });
  // it("should search toggle on X click", async () => {
  //   component.isNearbyBuses = true;
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   const closeIcon = fixture.debugElement.query(By.css("#nearbyBtn")).nativeElement;
  //   closeIcon.click();
  //   const toggleNearbyBusesSpy = spyOn(component, "toggleNearbyBuses");
  //   component.toggleNearbyBuses();
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   expect(toggleNearbyBusesSpy).toHaveBeenCalled();
  //   expect(component.isNearbyBuses).toEqual(false);
  // });
  // it("should call onSortChange() and change sortDirection", async () => {
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   busService.selectedBusIdOb.subscribe(() => {
  //     return false;
  //   });
  //   spyOn(busService, "getNearByBusesSorted").and.returnValue([mockData]);
  //   component.routeDetails = mockData;
  //   component.nearbyBuses = [mockData];
  //   component.isNearbyBuses = true;
  //   component.sortAZ = true;
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   const sortElementDb = fixture.debugElement.query(By.css("#sortSelect"));
  //   const mockEvent: MatSelectChange = {
  //     source: sortElementDb.nativeElement,
  //     value: "Name (Z-A)",
  //   };
  //   sortElementDb.triggerEventHandler("selectionChange", mockEvent);
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   expect(component.sortAZ).toEqual(false);
  // });
  it("should return false if given result is not Bus", () => {
    spyOn(busService.selectedBusIdOb, "subscribe").and.callThrough();
    const result = component.isResultSelected("123");
    expect(result).toBeFalse();
  });
  it("should setIsBusConnected", () => {
    component.busNotAvailable = true;
    component.setIsBusConnected(mockRoute);
    expect(component.busNotAvailable).toEqual(true);
  });
  it("should getRouteDetails", async () => {
    component.isLoading = true;
    spyOn(vehicleService, "task").and.returnValue(Promise.resolve(mockRoute));
    spyOn(activatedRoute.snapshot.paramMap, "get").and.returnValue("1");
    spyOn(activatedRoute.snapshot.queryParamMap, "get").and.returnValue("1");
    await component.getRouteDetails();
    expect(component.isLoading).toEqual(false);
  });
  it("should set isBusConnected to true when routeDetails meet the conditions", () => {
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

    component.setIsBusConnected(vehicle);

    expect(component.busNotAvailable).toBe(true);
  });

  it("should set isBusConnected to false when routeDetails do not meet the conditions", () => {
    const vehicle: VehicleEventRouteTaskNearbyStopDriver = {
      assetNumber: "G1103858",
      eventEndTime: "",
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

    component.setIsBusConnected(vehicle);

    expect(component.busNotAvailable).toBe(true);
  });
});
