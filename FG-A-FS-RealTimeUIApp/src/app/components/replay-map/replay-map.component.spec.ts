import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { BrowserModule, By } from "@angular/platform-browser";
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
import { FormatDatePipe } from "src/app/utilities/pipes/date/formatDate.pipe";
import { ErrorOverlayService } from "src/app/services/overlay/error-overlay.service";
import { ReplayMapComponent } from "./replay-map.component";
import { ReplayMapService } from "src/app/services/replay-map/replay-map.service";
import TrimbleMaps, { LngLatLike } from "@trimblemaps/trimblemaps-js";
import { depotStart } from "../../../assets/icons";
import { TaskService } from "src/app/services/task/task.service";
import { RouteTaskStopEventVehicleFeature, Event } from "src/first-student-api";
import { STATUS_VALUES } from "../timeline/timeline.component";
import { AppStateService } from "src/app/services/state/app-state.service";
import { UtilitiesService } from "src/app/services/utilities/utilities.service";

describe("ReplayMapComponent", () => {
  let component: ReplayMapComponent;
  let replayMapService: ReplayMapService;
  let taskService: TaskService;
  let appService: AppStateService;
  let utilitiesService: UtilitiesService;
  let fixture: ComponentFixture<ReplayMapComponent>;
  let taskData: RouteTaskStopEventVehicleFeature;
  let mapSpy: jasmine.Spy<(options: TrimbleMaps.MapOptions) => TrimbleMaps.Map>;
  let setSubscriptionSpy: jasmine.Spy<() => void>;
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
      providers: [ReplayMapService, TaskService, ErrorOverlayService],
      declarations: [ReplayMapComponent],
    }).compileComponents();
    replayMapService = TestBed.inject(ReplayMapService);
    taskService = TestBed.inject(TaskService);
    appService = TestBed.inject(AppStateService);
    utilitiesService = TestBed.inject(UtilitiesService);
    mapSpy = spyOn(replayMapService, "initMap");
    fixture = TestBed.createComponent(ReplayMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    setSubscriptionSpy = spyOn(component, "setSubscription");
    taskData = {
      totalRuns: 4,
      completedRuns: 0,
      coordinates: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[-121.401843, 36.8224254]],
        },
      },
      events: {},
      stops: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.86589, 37.279026],
            },
            properties: {
              id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
              templateId: "393088071",
              type: "SC",
              status: null,
              name: "SVCTE",
              description: "SVCTE",
              number: "1",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.9854, 37.270306],
            },
            properties: {
              id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
              templateId: "396457503",
              type: "ST",
              status: null,
              name: "4805 Westmont Ave",
              description: "4805 Westmont Ave",
              number: "3",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-122.000496, 37.292683],
            },
            properties: {
              id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
              templateId: "396457505",
              type: "ST",
              status: null,
              name: "18900 Prospect Rd",
              description: "18900 Prospect Rd",
              number: "4",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.97656, 37.222637],
            },
            properties: {
              id: "347ef156-7705-4837-a0f0-d7f34d06535b",
              templateId: "396457501",
              type: "ST",
              status: null,
              name: "20 High School Ct",
              description: "20 High School Ct",
              number: "2",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "347ef156-7705-4837-a0f0-d7f34d06535b",
          },
        ],
      },
      vehicle: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.401843, 36.8224254],
        },
        properties: {
          id: "101962",
          type: "string",
          assetNumber: "101962",
          fleetNumber: "",
          heading: 311,
          speed: 0,
          speedUnit: "MPH",
          eventId: "426d15de-59b2-4185-aad9-4ffdf226e999",
          eventType: "string",
          eventStartTime: "2023-03-22T13:49:48.000Z",
          eventEndTime: "2023-03-22T13:49:48.000Z",
        },
        id: "101962",
      },
    };
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create map and wait for services on init", () => {
    appService.setSelectedTaskId("1");
    appService.setSelectedRunId("1");
    appService.setSelectedStatus("Completed");
    appService.selectedBusinessUnit = { id: 1, name: "<name>" };

    expect(mapSpy).toHaveBeenCalled();
    expect(setSubscriptionSpy).toHaveBeenCalledTimes(1);
  });

  it("should call latest when a bus is en route and process coordinates on intial call", fakeAsync(() => {
    jasmine.clock().mockDate(new Date("10-10-2010"));
    const taskLatestSpy = spyOn(taskService, "latest").and.returnValue(Promise.resolve(taskData));
    // Spy on methods
    const initRoutesSpy = spyOn(component, "initializeRoutes");
    const formatCoorSpy = spyOn(component, "formatCoordinates").and.callFake(() => {
      component.busPath = [[1, 1]];
    });
    const constructSpy = spyOn(utilitiesService, "constructRoutes").and.returnValue([
      { routeId: "1" },
    ]);

    component.runStatus = "Active";
    component.runId = "1";
    component.taskId = "1";
    component.init = true;
    //Get time before tick because the gpsEvent time is set before then
    const time = new Date();
    //override spy to call through
    setSubscriptionSpy.and.callThrough();
    component.setSubscription();
    // Triggers request
    tick(1);

    expect(taskLatestSpy).toHaveBeenCalledWith(component.taskId, component.runId, undefined);
    expect(formatCoorSpy).toHaveBeenCalledWith(
      taskData.coordinates?.geometry?.["coordinates"] as LngLatLike[]
    );
    expect(constructSpy).toHaveBeenCalledWith(taskData, [[1, 1]], true, false);
    expect(initRoutesSpy).toHaveBeenCalledWith([{ routeId: "1" }]);
    expect(component.init).toEqual(false);
    expect(component.gpsEventTime).toEqual(time);
    expect(component.events).toEqual(taskData.events);
    component.subscription?.unsubscribe();
  }));

  it("should call latest when a bus is en route and process coordinates on follow up calls", fakeAsync(() => {
    jasmine.clock().mockDate(new Date("10-10-2010"));
    const taskLatestSpy = spyOn(taskService, "latest").and.returnValue(Promise.resolve(taskData));
    // Spy on methods
    const updateRoutesSpy = spyOn(component, "updateRoutes");
    const constructSpy = spyOn(utilitiesService, "constructRoutes").and.returnValue([
      { routeId: "1" },
    ]);

    component.runStatus = "Active";
    component.runId = "1";
    component.taskId = "1";
    component.init = false;
    component.gpsEventTime = new Date();
    setSubscriptionSpy.and.callThrough();
    component.setSubscription();
    //Get time before tick because the gpsEvent time is set before then
    const time = new Date();
    // Triggers request
    tick(1);

    expect(taskLatestSpy).toHaveBeenCalledWith(
      component.taskId,
      component.runId,
      component.gpsEventTime?.toJSON()
    );
    expect(component.busPath).toEqual([taskData.vehicle?.geometry?.coordinates as LngLatLike]);
    expect(constructSpy).toHaveBeenCalledWith(
      taskData,
      [taskData.vehicle?.geometry?.coordinates as LngLatLike],
      false,
      false
    );
    expect(updateRoutesSpy).toHaveBeenCalledWith([{ routeId: "1" }]);
    expect(component.gpsEventTime).toEqual(time);

    component.subscription?.unsubscribe();
  }));

  it("should call replay when a bus is not en route and process coordinates", fakeAsync(() => {
    jasmine.clock().mockDate(new Date("10-10-2010"));
    const taskReplaySpy = spyOn(taskService, "replay").and.returnValue(Promise.resolve(taskData));
    // Spy on methods
    const initRoutesSpy = spyOn(component, "initializeRoutes");
    const formatCoorSpy = spyOn(component, "formatCoordinates").and.callFake(() => {
      component.busPath = [[1, 1]];
    });
    const constructSpy = spyOn(utilitiesService, "constructRoutes").and.returnValue([
      { routeId: "1" },
    ]);

    component.runStatus = STATUS_VALUES.COMPLETED;
    component.runId = "1";
    component.taskId = "1";
    setSubscriptionSpy.and.callThrough();
    component.setSubscription();
    const time = new Date();
    tick(1);

    expect(taskReplaySpy).toHaveBeenCalledWith(component.taskId, component.runId, time.toJSON());
    expect(formatCoorSpy).toHaveBeenCalledWith(
      taskData.coordinates?.geometry?.["coordinates"] as LngLatLike[]
    );
    expect(constructSpy).toHaveBeenCalledWith(taskData, [[1, 1]], true, true);
    expect(initRoutesSpy).toHaveBeenCalledWith([{ routeId: "1" }]);
    expect(component.gpsEventTime).toEqual(time);
    expect(component.events).toEqual(taskData.events);
  }));

  it("should format the coors to 3 decimal places and remove duplicates", fakeAsync(() => {
    const coordinates: LngLatLike[] = [
      [-89.123333, 13.432222],
      [-89.123333, 13.432222],
      [-87.123333, 12.432222],
    ];

    component.formatCoordinates(coordinates);
    expect(component.busPath).toEqual([
      [-89.123, 13.432],
      [-87.123, 12.432],
    ]);
  }));

  it("should only format and add cordinates that are a greater then 0.01 difference", fakeAsync(() => {
    const coordinates: LngLatLike[] = [
      [-89.123333, 13.432222],
      [-89.121, 13.431],
      [-89.133, 13.432222],
      [-89.134, 13.432222],
      [-80.123, 15.1233333],
      [-80.123, 15.121],
      [-80.123, 15.133],
      [-80.123, 15.134],
    ];
    component.formatCoordinates(coordinates);
    expect(component.busPath).toEqual([
      [-89.123, 13.432],
      [-89.134, 13.432],
      [-80.123, 15.123],
      [-80.123, 15.134],
    ]);
  }));

  it("should initialize routes on load", () => {
    const routeOptions: TrimbleMaps.RouteOptions[] = [
      {
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
      },
    ];
    const setRouteOnLandSpy = spyOn(replayMapService, "setRouteOnLoad");
    const moveLayersSpy = spyOn(replayMapService, "moveLayers");

    component.initializeRoutes(routeOptions);
    expect(setRouteOnLandSpy).toHaveBeenCalled();
    expect(moveLayersSpy).toHaveBeenCalled();
  });

  it("should updateRoutes", () => {
    const routeOptions: TrimbleMaps.RouteOptions[] = [
      {
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
      },
    ];
    const updateRouteOnRoadSpy = spyOn(replayMapService, "updateRouteOnRoad");
    component.updateRoutes(routeOptions);
    expect(updateRouteOnRoadSpy).toHaveBeenCalled();
  });

  it("should set modalOpened to false", () => {
    component.modalOpened = true;
    component.handleOnApplyClick();
    expect(component.modalOpened).toBe(false);
  });

  it('should set showHistoryLayers to true if selectedOption is "history"', () => {
    component.selectedOption = "history";
    component.handleOnApplyClick();
    expect(component.showHistoryLayers).toBe(true);
  });

  it('should set selectedOption to "live"', () => {
    component.onLiveViewReturn();
    expect(component.selectedOption).toBe("live");
  });

  it("should set showHistoryLayers to false", () => {
    component.onLiveViewReturn();
    expect(component.showHistoryLayers).toBe(false);
  });
  it("should set selectedDate to null", () => {
    component.onLiveViewReturn();
    expect(component.selectedDate).toBeNull();
  });
  it("should toggle the modalOpened flag", () => {
    expect(component.modalOpened).toBe(false);
    component.handleModalClick();
    expect(component.modalOpened).toBe(true);
    component.handleModalClick();
    expect(component.modalOpened).toBe(false);
  });

  it("should addEventsMarkers", () => {
    spyOn(replayMapService, "addEventMarkers");
    component.addEventsMarkers({} as Event);
    expect(replayMapService.addEventMarkers).toHaveBeenCalled();
  });

  it("should toggle isModalOpen when handleDropdownClick is called", () => {
    expect(component.isEventModalOpen).toBe(false);

    component.handleDropdownClick();

    expect(component.isEventModalOpen).toBe(true);

    component.handleDropdownClick();

    expect(component.isEventModalOpen).toBe(false);
  });
  it('should set eventsOption to "Events" when selectedOptions is empty', () => {
    component.selectedEventOptions = [];
    component.handleApplyClick();
    expect(component.eventsOption).toEqual("Events");
  });

  it("should set eventsOption to the first option when only one option is selected", () => {
    component.selectedEventOptions = ["option1"];
    component.handleApplyClick();
    expect(component.eventsOption).toEqual("option1");
  });

  it("should set eventsOption to a concatenated string when multiple options are selected", () => {
    component.selectedEventOptions = ["option1", "option2", "option3"];
    component.handleApplyClick();
    expect(component.eventsOption).toEqual("option1/option2...");
  });

  it("should set isModalOpen to false", () => {
    component.handleApplyClick();
    expect(component.isEventModalOpen).toBe(false);
  });
  it("should set selectedOptions to an empty array", () => {
    component.selectedEventOptions = ["option1", "option2"];
    component.handleClearClick();
    expect(component.selectedEventOptions).toEqual([]);
  });
  it("the modal should stay open if the handleClearClick is called", () => {
    component.isEventModalOpen = false;
    component.handleClearClick();
    expect(component.isEventModalOpen).toBe(true);
  });
  it("should add option to selectedEventOptions when checkbox is checked", () => {
    const option = "Option 1";
    const event = { target: { checked: true } };
    component.handleCheckboxChange(option, option, event);
    expect(component.selectedEventOptions).toContain(option);
    expect(component.selectedEventKeys).toContain(option);
  });

  it("should remove option from selectedEventOptions when checkbox is unchecked", () => {
    const option = "Option 1";
    const event = { target: { checked: false } };
    component.selectedEventOptions = [option];
    component.selectedEventKeys = [option];
    component.handleCheckboxChange(option, option, event);
    expect(component.selectedEventOptions).not.toContain(option);
    expect(component.selectedEventKeys).not.toContain(option);
  });

  it('should set eventsOption to "Events" when selectedEventOptions is empty', () => {
    component.selectedEventOptions = [];
    component.handleCheckboxChange("Option 1", "Option 1", { target: { checked: false } });
    expect(component.eventsOption).toEqual("Events");
  });
  it("should calculate left position based on map layer width", () => {
    const mockMapLayer = {
      nativeElement: {
        offsetWidth: 125,
      },
    };
    component.mapLayer = mockMapLayer;

    fixture.detectChanges();

    const expectedLeftPosition = 165; // calculated manually: 125 + 40
    const eventsLayer = fixture.debugElement.query(By.css(".events-layer")).nativeElement;

    expect(eventsLayer.style.left).toBe(`${expectedLeftPosition}px`);
  });

  it("should initializeSelectedEvents", () => {
    const addEventsMarkersSpy = spyOn(component, "addEventsMarkers");
    component.initializeSelectedEvents();
    expect(addEventsMarkersSpy).toHaveBeenCalled();
  });
});
