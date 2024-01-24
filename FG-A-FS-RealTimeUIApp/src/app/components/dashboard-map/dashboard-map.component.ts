import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { DashboardMapService } from "../../services/dashboard-map/dashboard-map.service";
import { BusService } from "src/app/services/bus/bus.service";
import { DriverService } from "src/app/services/driver/driver.service";
import { ErrorOverlayService } from "src/app/services/overlay/error-overlay.service";
import polling from "rx-polling";
import { Subscription, defer } from "rxjs";
import { VehicleService } from "src/app/services/vehicle/vehicle.service";
import { AppStateService } from "src/app/services/state/app-state.service";
import { pollingConfig } from "src/app/app-config";
import { VehicleEventFeature } from "src/first-student-api";
@Component({
  selector: "app-dashboard-map",
  templateUrl: "./dashboard-map.component.html",
  styleUrls: ["./dashboard-map.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardMapComponent implements OnInit, OnDestroy {
  @Input() mapStyle: keyof typeof TrimbleMaps.Common.Style = "TRANSPORTATION";
  @Input() mapCenter = {
    lon: -95,
    lat: 38,
    zoom: 3.7,
  };
  @ViewChild("map", { static: true }) mapElement!: ElementRef;
  map!: TrimbleMaps.Map;
  dataError = false;
  lastPing!: string;
  subscription?: Subscription;
  zoomToBuses = true;

  constructor(
    private dashboardMapService: DashboardMapService,
    private busService: BusService,
    private driverService: DriverService,
    private errorService: ErrorOverlayService,
    private vehicleService: VehicleService,
    private appStateService: AppStateService
  ) {}

  ngOnInit() {
    this.map = this.dashboardMapService.initMap({
      container: this.mapElement.nativeElement,
      style: TrimbleMaps.Common.Style[this.mapStyle],
      center: [this.mapCenter.lon, this.mapCenter.lat],
      zoom: this.mapCenter.zoom,
      hash: false,
    });
    this.map.on("zoomend", () => {
      //check if zoom from search selection
      if (this.map.getZoom() != 7.5001111111111) {
        this.busService.setSelectedBusId("");
        this.driverService.setSelectedDriverId("");
      }
    });
    this.map.on("dragend", () => {
      this.busService.setSelectedBusId("");
      this.driverService.setSelectedDriverId("");
    });

    // Reset subscription when user changes business unit - in order to load buses in that new area and restart the polling
    this.appStateService.selectedBusinessUnit$.subscribe(() => {
      this.setSubscription();
      this.zoomToBuses = true;
    });
  }

  ngOnDestroy(): void {
    this.removeSubscription();
  }

  setSubscription(): void {
    this.removeSubscription();

    this.subscription = polling(
      defer(() => this.vehicleService.location()),
      pollingConfig
    ).subscribe((vehicles: VehicleEventFeature[]) => {
      this.dashboardMapService.addVehicleMarkerIcon(vehicles);
      if (this.zoomToBuses && vehicles.length) {
        this.dashboardMapService.zoomToBoundingBox(vehicles);
        this.zoomToBuses = false;
      }
    });
  }

  removeSubscription(): void {
    this.subscription?.unsubscribe();
  }
}
