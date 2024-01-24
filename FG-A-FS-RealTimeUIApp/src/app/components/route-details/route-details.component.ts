import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Bus, BusService } from "src/app/services/bus/bus.service";
import { differenceInMinutes } from "date-fns";
import { VehicleService } from "src/app/services/vehicle/vehicle.service";
import { VehicleEventRouteTaskNearbyStopDriver } from "src/first-student-api";
import { getDirection } from "src/app/utilities/vehicleDirection";

@Component({
  selector: "app-route-details",
  templateUrl: "./route-details.component.html",
  styleUrls: ["./route-details.component.scss"],
})
export class RouteDetailsComponent implements OnInit {
  isNearbyBuses = false;
  sortAZ = true;
  nearbyBuses!: Array<Bus>;
  busNotAvailable = true;
  routeDetails!: VehicleEventRouteTaskNearbyStopDriver;
  isLoading = false;
  minAgo = 0;

  constructor(
    private busService: BusService,
    private router: Router,
    private vehicleService: VehicleService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getRouteDetails();
  }
  closeViewDetails() {
    this.router.navigate(["/dashboard"], { replaceUrl: true });
  }
  setIsBusConnected(routeDetails: VehicleEventRouteTaskNearbyStopDriver) {
    if (
      routeDetails.eventEndTime &&
      ((routeDetails.eventType !== "reasons_poweroff" && !routeDetails.eventType) ||
        routeDetails.eventType === "reasons_poweroff")
    ) {
      this.minAgo = differenceInMinutes(new Date(), new Date(routeDetails.eventEndTime));
      this.busNotAvailable = this.minAgo >= 3;
    }
  }
  isResultSelected(id: string) {
    let selectedID = "";
    this.busService.selectedBusIdOb.subscribe(busID => {
      selectedID = busID;
    });
    return selectedID == id;
  }
  getRouteDetails() {
    this.isLoading = true;
    const routeId = this.activatedRoute.snapshot.paramMap.get("routeId");
    const eventId = this.activatedRoute.snapshot.queryParamMap.get("eventId");
    if (routeId && eventId)
      this.vehicleService.task(routeId, eventId).then(res => {
        this.routeDetails = res;
        this.isLoading = false;
        this.setIsBusConnected(res);
      });
  }
}
