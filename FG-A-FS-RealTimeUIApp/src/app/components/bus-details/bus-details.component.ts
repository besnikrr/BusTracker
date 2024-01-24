import { Component, Input } from "@angular/core";
import { Bus, BusService } from "src/app/services/bus/bus.service";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";
import { DashboardMapService } from "src/app/services/dashboard-map/dashboard-map.service";
import { VehicleSearchPageable } from "../../../first-student-api";

@Component({
  selector: "app-bus-details",
  templateUrl: "./bus-details.component.html",
  styleUrls: ["./bus-details.component.scss"],
})
export class BusDetailsComponent {
  @Input() bus!: Bus;
  @Input() clicked!: boolean;
  @Input() busData?: VehicleSearchPageable;
  phoneNumber = "";
  element?: TrimbleMaps.Marker;
  bussesOnTheMap?: (string | undefined)[] = [];
  constructor(
    private routeDetailsService: RouteDetailsService,
    private dashboardMapService: DashboardMapService,
    private busService: BusService
  ) {}
  ngOnChanges() {
    this.bussesOnMap();
  }
  onViewDetailsClick() {
    this.routeDetailsService.openViewDetails(this.bus?.route.id);
  }

  onZoomIn(item: string) {
    this.element = this.dashboardMapService.markers?.find(
      marker => marker.getElement().id === item
    );
    if (this.element === undefined) {
      return;
    }
    const coordinates = this.element.getLngLat();

    this.busService.setSelectedBusId(this.element.getElement().id);
    this.dashboardMapService.setMapCenter([coordinates?.lng, coordinates?.lat], false);
    this.dashboardMapService.zoomInPopUp();
  }
  bussesOnMap() {
    this.bussesOnTheMap = this.dashboardMapService.markers?.flatMap(marker => {
      const markerById = marker.getElement().id;
      return this.busData?.items
        ?.filter(result => result.id === markerById)
        ?.map(element => {
          return element.id;
        });
    });
  }
}
