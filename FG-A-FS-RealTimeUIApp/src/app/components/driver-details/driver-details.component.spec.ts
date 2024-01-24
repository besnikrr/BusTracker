import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DriverDetailsComponent } from "./driver-details.component";
import { MatIconModule } from "@angular/material/icon";
import { BusService, mockData } from "src/app/services/bus/bus.service";
import { DriverService } from "src/app/services/driver/driver.service";
import { By } from "@angular/platform-browser";
import { DashboardMapService } from "src/app/services/dashboard-map/dashboard-map.service";

describe("DriverDetailsComponent", () => {
  let component: DriverDetailsComponent;
  let fixture: ComponentFixture<DriverDetailsComponent>;
  let busServiceSpy: jasmine.SpyObj<BusService>;
  let dashboardMapServiceSpy: jasmine.SpyObj<DashboardMapService>;
  let driverServiceSpy: jasmine.SpyObj<DriverService>;

  beforeEach(async () => {
    busServiceSpy = jasmine.createSpyObj("BusService", [
      "setSelectedBusId",
      "getBusByIDandDriver",
      "getBusesSortedByName",
    ]);
    dashboardMapServiceSpy = jasmine.createSpyObj("DashboardMapService", [
      "setMapCenter",
      "zoomInPopUp",
    ]);
    driverServiceSpy = jasmine.createSpyObj("MapService", [
      "setSelectedDriverId",
      "getDriversSortedByName",
    ]);
    await TestBed.configureTestingModule({
      imports: [MatIconModule],
      providers: [
        { provide: BusService, useValue: busServiceSpy },
        { provide: DashboardMapService, useValue: dashboardMapServiceSpy },
        { provide: DriverService, useValue: driverServiceSpy },
      ],
      declarations: [DriverDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverDetailsComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    // Set the data roperty before triggering ngOnInit()
    component.driver = mockData;
    component.bus = mockData;
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should show driver name", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    busServiceSpy.getBusByIDandDriver.and.returnValue([mockData]);
    const fullname =
      component.driver.driver.firstName.toLowerCase() +
      " " +
      component.driver.driver.lastName.toLowerCase();
    expect(fixture.nativeElement.querySelector("h3").innerText.toLowerCase()).toEqual(fullname);
  });

  it("should call onViewBus when clicked", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    busServiceSpy.getBusByIDandDriver.and.returnValue([mockData]);
    const viewBusBtn = fixture.debugElement.query(By.css("#viewBus"));
    spyOn(component, "onViewBus");
    if (viewBusBtn) {
      viewBusBtn.triggerEventHandler("click", {});
      component.onViewBus();
      expect(component.onViewBus).toHaveBeenCalled();
    }
  });

  it("should call onViewBus on viewBussLocation Button", async () => {
    const onViewBus = spyOn(component, "onViewBus").and.callThrough();

    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector("#viewBus");
    button?.click();

    await fixture.whenStable();

    expect(onViewBus).toHaveBeenCalled();
  });
  it("should getClockedIn", () => {
    expect(component.getClockedIn().length).toBeGreaterThan(0);
  });

  it("getPlannedRouteTime", () => {
    expect(component.getPlannedRouteTime()).toMatch(/\d{2}:\d{2} - \d{2}:\d{2}/);
  });
  it("should not set bus property if result is falsy and run the if check", async () => {
    const getBusByIDandDriver = busServiceSpy.getBusByIDandDriver.and.returnValue([]);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(getBusByIDandDriver).toHaveBeenCalled();
    expect(component.bus).toBeUndefined();
  });
  it("should call onViewDetailsClick and set clicked to a value", () => {
    fixture.detectChanges();
    const viewDetBtn = fixture.debugElement.nativeElement.querySelector("#viewDetailsBtn");
    viewDetBtn.click();
    const onViewDetailsClick = spyOn(component, "onViewDetailsClick");
    component.onViewDetailsClick();
    expect(onViewDetailsClick).toHaveBeenCalled();
  });
});
