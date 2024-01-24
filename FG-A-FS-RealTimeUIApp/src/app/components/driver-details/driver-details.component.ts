import { Component, Input, OnInit } from "@angular/core";
import { Bus, BusService } from "src/app/services/bus/bus.service";
import { DriverService } from "src/app/services/driver/driver.service";
import { format } from "date-fns";
import { formatTimeRange, TIME_FORMAT } from "src/app/utilities/date.format";
import { DashboardMapService } from "src/app/services/dashboard-map/dashboard-map.service";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";

@Component({
  selector: "app-driver-details",
  templateUrl: "./driver-details.component.html",
  styleUrls: ["./driver-details.component.scss"],
})
export class DriverDetailsComponent implements OnInit {
  @Input() driver!: Bus;
  @Input() clicked!: boolean;

  bus!: Bus | null;

  constructor(
    private mapService: DashboardMapService,
    private busService: BusService,
    private driverService: DriverService,
    private routeDetailsService: RouteDetailsService
  ) {}

  ngOnInit(): void {
    const result = this.busService.getBusByIDandDriver(
      this.driver.driver.id,
      this.driver.driver.lastName
    );
    if (result) this.bus = result[0];
  }
  getClockedIn() {
    return format(new Date(this.driver.driver.actualStartTime), TIME_FORMAT).toLowerCase();
  }
  getPlannedRouteTime() {
    const startTime = new Date(this.driver.route.scheduledStartTime);
    const endTime = new Date(this.driver.route.scheduledEndTime);
    return formatTimeRange(startTime, endTime);
  }
  onViewBus() {
    if (this.bus) {
      this.mapService.setMapCenter(this.bus.vehicle.geometry.coordinates);
      this.mapService.zoomInPopUp();
      this.driverService.setSelectedDriverId(this.driver.driver.id);
    }
  }
  onViewDetailsClick() {
    this.routeDetailsService.openViewDetails(this.driver.route.id);
  }
}
