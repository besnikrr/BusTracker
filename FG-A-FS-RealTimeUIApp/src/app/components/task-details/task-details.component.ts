import { Component, Input } from "@angular/core";
import { format } from "date-fns";
import { DashboardMapService } from "src/app/services/dashboard-map/dashboard-map.service";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";
import { AppStateService } from "src/app/services/state/app-state.service";
import { DATE_FORMAT, formatTimeRange } from "src/app/utilities/date.format";

@Component({
  selector: "app-task-details",
  templateUrl: "./task-details.component.html",
  styleUrls: ["./task-details.component.scss"],
})
export class TaskDetailsComponent {
  @Input() task!: any;
  @Input() clicked!: boolean;
  constructor(
    private appStateService: AppStateService,
    private dashboardMapService: DashboardMapService,
    private routeDetailsService: RouteDetailsService
  ) {}
  onZoomIn() {
    this.appStateService.setSelectedTaskId(this.task.id);
    this.dashboardMapService.setMapCenter(this.task.coordinates);
    this.dashboardMapService.zoomInPopUp();
  }
  onViewDetailsClick() {
    this.routeDetailsService.openViewDetails(this.task.routeId);
  }
  getTimeRange() {
    const weekday = format(new Date(this.task.scheduledArrivalTime), "EEE");
    const date = format(new Date(this.task.scheduledArrivalTime), DATE_FORMAT);
    const timeRange = formatTimeRange(
      new Date(this.task.scheduledArrivalTime),
      new Date(this.task.scheduledDepartureTime)
    );
    return timeRange + " " + weekday + " " + date;
  }
}
