import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import TrimbleMaps, { LngLatLike } from "@trimblemaps/trimblemaps-js";
import { ReplayMapService } from "src/app/services/replay-map/replay-map.service";
import { Subscription, combineLatest, defer } from "rxjs";
import { TaskService } from "src/app/services/task/task.service";
import { pollingConfig } from "src/app/app-config";
import { AppStateService } from "src/app/services/state/app-state.service";
import polling from "rx-polling";
import { Event, RouteTaskStopEventVehicleFeature } from "src/first-student-api";
import { UtilitiesService } from "src/app/services/utilities/utilities.service";
import { RUN_STATUS } from "../timeline/timeline.component";

export enum BusEventType {
  reasons_coldstart = "Cold Start",
  reasons_dooropenclose = "Door Open/Close",
  reasons_hardbreak = "Hard Break",
  reasons_idling = "Idling",
  reasons_motionstart = "Motion Start",
  reasons_motionstop = "Motion Stop",
  reasons_poweron = "Power On",
  reasons_poweroff = "Power Off",
}
@Component({
  selector: "app-replay-map",
  templateUrl: "./replay-map.component.html",
  styleUrls: ["./replay-map.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReplayMapComponent implements OnInit, OnDestroy {
  @ViewChild("mapLayer") mapLayer!: ElementRef;
  @ViewChild("eventsLayer") eventsLayer!: ElementRef;
  @Input() mapStyle: keyof typeof TrimbleMaps.Common.Style = "TRANSPORTATION";
  @Input() mapCenter = {
    lon: -95,
    lat: 38,
    zoom: 4.7,
  };
  @ViewChild("map", { static: true }) mapElement!: ElementRef;
  map!: TrimbleMaps.Map;
  selectedOption = "live";
  modalOpened = false;
  selectedDate: Date | null = null;
  maxDate = new Date();
  showHistoryLayers = false;
  dataError = false;
  lastPing!: string;
  eventValues = BusEventType;
  selectedEventOptions: string[] = [];
  selectedEventKeys: string[] = [];
  isEventModalOpen = false;
  eventsOption = "Events";
  subscription?: Subscription;
  taskId = "";
  runId = "";
  runStatus = "";
  serviceObs?: Subscription;
  gpsEventTime?: Date;
  init = true;
  events: Event = {};
  busPath: LngLatLike[] = [];

  constructor(
    private replayMapService: ReplayMapService,
    private appStateService: AppStateService,
    private taskService: TaskService,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {
    this.map = this.replayMapService.initMap({
      container: this.mapElement.nativeElement,
      style: TrimbleMaps.Common.Style[this.mapStyle],
      center: [this.mapCenter.lon, this.mapCenter.lat],
      zoom: this.mapCenter.zoom,
      hash: false,
    });
    this.serviceObs = combineLatest([
      this.appStateService.selectedTaskId,
      this.appStateService.selectedRunId,
      this.appStateService.selectedRunStatus,
      this.appStateService.selectedBusinessUnit$,
    ]).subscribe(values => {
      this.taskId = values[0];
      this.runId = values[1];
      this.runStatus = values[2];
      if (values.every(val => val)) {
        this.setSubscription();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.serviceObs?.unsubscribe();
  }

  setSubscription(): void {
    if (this.runStatus === RUN_STATUS.ACTIVE) {
      this.subscription = polling(
        defer(() => {
          const oldTime = this.gpsEventTime;
          this.gpsEventTime = new Date();
          return this.taskService.latest(this.taskId, this.runId, oldTime?.toJSON());
        }),
        pollingConfig
      ).subscribe((taskData: RouteTaskStopEventVehicleFeature) => {
        this.events = taskData.events;
        if (this.init) {
          this.formatCoordinates(taskData.coordinates?.geometry?.["coordinates"] as LngLatLike[]);
          this.initializeRoutes(
            this.utilitiesService.constructRoutes(taskData, this.busPath, this.init, false)
          );
          this.init = false;
        } else {
          const vehicleCoordinates: LngLatLike = taskData.vehicle?.geometry
            ?.coordinates as LngLatLike;
          if (vehicleCoordinates) {
            this.busPath.push(vehicleCoordinates);
            this.updateRoutes(
              this.utilitiesService.constructRoutes(taskData, this.busPath, this.init, false)
            );
          }
        }
      });
    } else {
      this.gpsEventTime = new Date();
      this.taskService
        .replay(this.taskId, this.runId, this.gpsEventTime?.toJSON())
        .then((taskData: RouteTaskStopEventVehicleFeature) => {
          this.events = taskData.events;

          if (this.runStatus === RUN_STATUS.COMPLETED) {
            this.formatCoordinates(taskData.coordinates?.geometry?.["coordinates"] as LngLatLike[]);
          }
          this.initializeRoutes(
            this.utilitiesService.constructRoutes(
              taskData,
              this.busPath,
              true,
              this.runStatus === RUN_STATUS.COMPLETED
            )
          );
        });
    }
  }

  formatCoordinates(coordinates: LngLatLike[]) {
    const coorAdded: { [key: string]: boolean } = {};
    let lastAdded;
    for (let i = 0; i < coordinates.length; i++) {
      const coor: number[] = coordinates[i] as number[];
      coor[0] = parseFloat(coor[0].toFixed(3));
      coor[1] = parseFloat(coor[1].toFixed(3));

      //Ensure this logic is ok when we get correct gps coors for a route
      if (!coorAdded[coor[0] + "," + coor[1]]) {
        if (lastAdded) {
          const dif1 = Math.abs(lastAdded[0] - coor[0]);
          const dif2 = Math.abs(lastAdded[1] - coor[1]);

          if (dif1 > 0.01 || dif2 > 0.01) {
            coorAdded[coor[0] + "," + coor[1]] = true;
            this.busPath.push(coor as LngLatLike);
            lastAdded = [...coor];
          }
        } else {
          coorAdded[coor[0] + "," + coor[1]] = true;
          this.busPath.push(coor as LngLatLike);
          lastAdded = [...coor];
        }
      }
    }
  }
  initializeRoutes(routesOptions: TrimbleMaps.RouteOptions[]) {
    routesOptions.forEach((routeOption: TrimbleMaps.RouteOptions) => {
      this.replayMapService.setRouteOnLoad(routeOption);
    });
    this.replayMapService.moveLayers();
  }

  updateRoutes(routeOptions: TrimbleMaps.RouteOptions[]) {
    routeOptions.forEach((routeOption: TrimbleMaps.RouteOptions) => {
      this.replayMapService.updateRouteOnRoad(routeOption);
    });
  }

  // Live dropdown
  handleModalClick() {
    this.modalOpened = !this.modalOpened;
    this.isEventModalOpen = false;
  }

  handleOnApplyClick() {
    this.modalOpened = false;
    if (this.selectedOption === "history") {
      this.showHistoryLayers = true;
    } else {
      this.onLiveViewReturn();
    }
  }

  onLiveViewReturn() {
    this.selectedOption = "live";
    this.showHistoryLayers = false;
    this.selectedDate = null;
  }

  handleDropdownClick() {
    this.isEventModalOpen = !this.isEventModalOpen;
    this.modalOpened = false;
  }

  handleCheckboxChange(optionValue: string, optionKey: string, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedEventOptions.push(optionValue);
      this.selectedEventKeys.push(optionKey);
    } else {
      const index = this.selectedEventOptions.indexOf(optionValue);
      if (index !== -1) {
        this.selectedEventOptions.splice(index, 1);
        this.selectedEventKeys.splice(index, 1);
      }
    }
    if (this.selectedEventOptions.length === 0) {
      this.eventsOption = "Events";
    }
  }

  handleApplyClick() {
    if (this.selectedEventOptions.length > 0) {
      this.eventsOption = this.selectedEventOptions[0];
      if (this.selectedEventOptions.length > 1) {
        this.eventsOption += "/" + this.selectedEventOptions[1] + "...";
      }
    }
    this.isEventModalOpen = false;
    this.initializeSelectedEvents();
  }

  handleClearClick() {
    this.selectedEventOptions = [];
    this.selectedEventKeys = [];
    this.isEventModalOpen = true;
    this.eventsOption = "Events";
  }

  getEventsLayerStyle() {
    const mapLayerWidth = this.mapLayer?.nativeElement.offsetWidth;
    const leftPosition = mapLayerWidth + 40;
    return { left: `${leftPosition}px` };
  }

  initializeSelectedEvents() {
    // Filters events to shown only events that the user selected
    const selectedEvents: Event = {};
    for (const eventId of this.selectedEventKeys) {
      if (this.events[eventId]) {
        selectedEvents[eventId] = this.events[eventId];
      }
    }
    this.addEventsMarkers(selectedEvents);
  }

  addEventsMarkers(selectedEvents: Event) {
    this.replayMapService.addEventMarkers(selectedEvents);
  }
}
