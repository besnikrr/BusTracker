import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { mockTasks } from "src/app/mock/mockData";
import { DashboardMapService } from "src/app/services/dashboard-map/dashboard-map.service";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";

import { TaskDetailsComponent } from "./task-details.component";
import { AppStateService } from "src/app/services/state/app-state.service";

describe("TaskDetailsComponent", () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let routeService: RouteDetailsService;
  let appStateService: AppStateService;
  let dashboardMapService: DashboardMapService;
  beforeEach(async () => {
    routeService = jasmine.createSpyObj("RouteDetailsService", ["openViewDetails"]);
    dashboardMapService = jasmine.createSpyObj("DashboardMapService", [
      "setMapCenter",
      "zoomInPopUp",
    ]);
    appStateService = jasmine.createSpyObj("AppStateService", ["setSelectedTaskId"]);

    await TestBed.configureTestingModule({
      imports: [MatIconModule],
      providers: [
        { provide: RouteDetailsService, useValue: routeService },
        { provide: DashboardMapService, useValue: dashboardMapService },
        { provide: AppStateService, useValue: appStateService },
      ],
      declarations: [TaskDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.task = mockTasks[0];
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call onViewDetailsClick and set clicked to a value", () => {
    routeService.openViewDetails(component.task.routeId);
    expect(routeService.openViewDetails).toHaveBeenCalledWith(component.task.routeId);
    fixture.detectChanges();
    const viewDetBtn = fixture.debugElement.nativeElement.querySelector("#viewDetailsBtn");
    viewDetBtn.click();
    const onViewDetailsClick = spyOn(component, "onViewDetailsClick");
    component.onViewDetailsClick();
    expect(onViewDetailsClick).toHaveBeenCalled();
  });
  it("should call onZoomIn when the Zoom in Button is clicked", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    // Simulate a click event on the button
    const zoomBtn = fixture.debugElement.nativeElement.querySelector("#zoomIn");
    zoomBtn.click();
    const onZoomIn = spyOn(component, "onZoomIn");
    component.onZoomIn();
    expect(onZoomIn).toHaveBeenCalled();
  });
  it("should getTimeRange", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const res = component.getTimeRange();
    expect(res.length).toBeGreaterThan(0);
  });
});
