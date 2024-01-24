import { Injectable } from "@angular/core";
import data from "../../../assets/data.json";
import { Router } from "@angular/router";

export interface RouteDetails {
  routeName: string;
  driver: string;
  bus: string;
  location: string;
}
@Injectable({
  providedIn: "root",
})
export class RouteDetailsService {
  constructor(private router: Router) {}

  openViewDetails(routeId: string, taskId?: string, runId?: string, eventId?: string) {
    if (eventId)
      this.router.navigate([`/view/${routeId}/task/${taskId}/run/${runId}`], {
        replaceUrl: true,
        queryParams: { eventId: eventId },
      });
    else
      this.router.navigate([`/view/${routeId}/task/${taskId}/run/${runId}`], {
        replaceUrl: true,
      });
  }
  getRouteByRouteId(routeId: string) {
    const res: Array<RouteDetails> = [];
    data.items.map(bus => {
      if (bus.route.id == routeId)
        res.push({
          routeName: bus.route.name,
          driver: bus.driver.firstName + " " + bus.driver.lastName,
          bus: bus.vehicle.properties.name,
          location: bus.route.destination,
        });
    });
    return res[0];
  }
}
