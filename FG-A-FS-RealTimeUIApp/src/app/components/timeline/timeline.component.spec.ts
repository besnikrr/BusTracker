import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MatExpansionModule } from "@angular/material/expansion";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { TaskService } from "src/app/services/task/task.service";
import { RouteTaskRunStop } from "src/first-student-api";
import { TimelineComponent } from "./timeline.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AppStateService } from "src/app/services/state/app-state.service";

describe("TimelineComponent", () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;
  let appStateService: AppStateService;
  let taskService: TaskService;
  let getTaskRunsSpy: jasmine.Spy<() => Promise<void>>;
  let setRouteStatusSpy: jasmine.Spy<(task: any) => void>;
  let isExpandedSpy: jasmine.Spy<(run: any, index: number) => boolean>;
  const res: RouteTaskRunStop = {
    id: "52e9c629-8814-4903-bde5-27fad8176b85",
    name: "387",
    templateId: "11734819",
    templateName: "387",
    type: "HTS",
    status: "TP",
    scheduledStartTime: "2023-04-04 18:50:00",
    scheduledEndTime: "2023-04-04 21:43:00",
    totalRuns: 4,
    completedRuns: 0,
    runs: [
      {
        id: "2561f9bd-91ed-44d8-ac8b-6e9eb0158100",
        templateId: "19756061",
        name: "NXT_1_PM",
        description: "NXTGEN PM",
        status: "Completed",
        stops: [
          {
            id: "",
            templateId: "",
            description: "",
            performed: "",
            actualArrivalTime: "",
            type: "",
            status: "",
            name: "",
            number: 1,
          },
          {
            id: "",
            templateId: "",
            description: "",
            performed: "Y",
            actualArrivalTime: "",
            type: "",
            status: "",
            name: "",
            number: 1,
          },
        ],
      },
    ],
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineComponent],
      imports: [
        MatExpansionModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    component.runId = "2561f9bd-91ed-44d8-ac8b-6e9eb0158100";
    taskService = TestBed.inject(TaskService);
    appStateService = TestBed.inject(AppStateService);
    fixture.detectChanges();

    getTaskRunsSpy = spyOn(component, "getTaskRuns").and.returnValue(Promise.resolve());
    setRouteStatusSpy = spyOn(component, "setRouteStatus");
    isExpandedSpy = spyOn(component, "isExpanded").and.returnValue(true);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fully initialize once service ids are set", fakeAsync(() => {
    component.task = res;
    component.runs = res.runs ? res.runs : [];
    appStateService.selectedBusinessUnit = { id: 1, name: "<name>" };
    appStateService.setSelectedTaskId("1");
    appStateService.setSelectedRunId("2");
    //Need to call to make async call resolve
    tick(1);
    expect(component.taskId).toEqual("1");
    expect(component.runId).toEqual("2");
    expect(getTaskRunsSpy).toHaveBeenCalled();
    expect(setRouteStatusSpy).toHaveBeenCalledWith(res);
    expect(isExpandedSpy).toHaveBeenCalledTimes(1);
    expect(component.expandedRuns).toEqual([true]);
  }));
  it("should not fully initialize until service ids are set", () => {
    expect(getTaskRunsSpy).not.toHaveBeenCalled();
  });
  it("should get task runs and set task + run info", async () => {
    const runStops = spyOn(taskService, "runStops").and.returnValue(Promise.resolve(res));
    const statusSpy = spyOn(appStateService, "setSelectedStatus");
    component.runs = [];
    getTaskRunsSpy.and.callThrough();
    await component.getTaskRuns();
    expect(runStops).toHaveBeenCalled();
    expect(component.runs[0].stops.length).toBeGreaterThan(0);
    expect(statusSpy).toHaveBeenCalledWith("Completed");
  });
  it("should logit", () => {
    expect(component.logit(false)).toBe(true);
  });
  it('should set routeStatus to "Not Started" when task status is TP', () => {
    const task = { status: "TP", runs: [] };
    setRouteStatusSpy.and.callThrough();
    component.setRouteStatus(task);
    expect(component.routeStatus).toEqual(component.statusValues.NOT_STARTED);
  });
  it('should set routeStatus to "EnRoute" when task status is DD', () => {
    const task = { status: "DD", runs: [] };
    setRouteStatusSpy.and.callThrough();
    component.setRouteStatus(task);
    expect(component.routeStatus).toEqual(component.statusValues.EN_ROUTE);
  });
  it('should set routeStatus to "Complete" when task status is DR', () => {
    const task = { status: "DR", runs: [] };
    setRouteStatusSpy.and.callThrough();
    component.setRouteStatus(task);
    expect(component.routeStatus).toEqual(component.statusValues.COMPLETED);
  });
  it("should return true for run with status ACTIVE", () => {
    const run = { status: component.runStatus.ACTIVE };
    const index = 0;

    isExpandedSpy.and.callThrough();
    const result = component.isExpanded(run, index);

    expect(result).toBeTrue();
  });

  it("should return true for the first run with status INACTIVE", () => {
    const run = { status: component.runStatus.INACTIVE };
    const index = 0;

    isExpandedSpy.and.callThrough();
    const result = component.isExpanded(run, index);

    expect(result).toBeTrue();
  });
  it("should return false for runs with status INACTIVE and non-first index", () => {
    const run = { status: component.runStatus.INACTIVE };
    const index = 1;

    isExpandedSpy.and.callThrough();
    const result = component.isExpanded(run, index);

    expect(result).toBeFalse();
  });

  it("should return false for runs with other statuses", () => {
    const run = { status: "OTHER_STATUS" };
    const index = 0;

    isExpandedSpy.and.callThrough();
    const result = component.isExpanded(run, index);

    expect(result).toBeFalse();
  });
});
