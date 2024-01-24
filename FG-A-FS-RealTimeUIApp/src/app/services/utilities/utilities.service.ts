import { Injectable } from "@angular/core";
import TrimbleMaps, { LngLatLike } from "@trimblemaps/trimblemaps-js";
import { busAlert, busArrow, depotStart, destinationIcon } from "src/assets/icons";
import { RouteTaskStopEventVehicleFeature, StopFeature } from "src/first-student-api";
import { differenceInMinutes } from "date-fns";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  constructRoutes(
    taskData: RouteTaskStopEventVehicleFeature,
    actualRouteStops: LngLatLike[],
    init: boolean,
    isCompletedRun: boolean
  ): TrimbleMaps.RouteOptions[] {
    const stops: StopFeature[] = taskData.stops.features as StopFeature[];
    const completedRouteStops: LngLatLike[] = [];
    const plannedRouteStops: LngLatLike[] = [];
    const deadheadStartRouteStops: LngLatLike[] = [];
    const deadheadEndRouteStops: LngLatLike[] = [];

    stops.forEach((stop: StopFeature, index: number) => {
      if (stop.properties.type === "DP") {
        if (index === 0) {
          //Need to add depot to planned route to show stop one correctly
          plannedRouteStops.push(stop.geometry.coordinates as LngLatLike);
          deadheadStartRouteStops.push(stop.geometry.coordinates as LngLatLike);
          //Add first stop
          deadheadStartRouteStops.push(stops[1].geometry.coordinates as LngLatLike);
        } else {
          //add the last stop and the end depot stop
          deadheadEndRouteStops.push(stops[index - 1].geometry.coordinates as LngLatLike);
          deadheadEndRouteStops.push(stop.geometry.coordinates as LngLatLike);
        }
      } else {
        if (index === 0) {
          plannedRouteStops.push(stops[index].geometry.coordinates as LngLatLike);
        }
        if (stops[index].properties.performed === "Y") {
          completedRouteStops.push(stops[index].geometry.coordinates as LngLatLike);
        }
        plannedRouteStops.push(stops[index].geometry.coordinates as LngLatLike);
      }
    });

    return [
      {
        routeId: "1",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: init,
        stops: plannedRouteStops,
        showStops: false,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
      {
        routeId: "2",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: deadheadStartRouteStops,
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          opacity: 0,
          textOpacity: 0,
        },
      },
      {
        routeId: "3",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: deadheadEndRouteStops,
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
      },
      {
        routeId: "4",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.0,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: plannedRouteStops,
        showStops: true,
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          size: 0.2,
          opacity: 1,
          textOpacity: 0.9,
        },
        destinationIcon: {
          url: destinationIcon,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        showArrows: false,
      },
      /*
      Leaving in place for future complete route stops ticket
      {
        routeId: "3",
        routeColor: "#082747",
        routePathOpacity: 0.0,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: completedRouteStops,
        showStops: true,
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          size: 0.2,
          opacity: 1,
          textOpacity: 0.9,
        },
        showArrows: false,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },*/
      {
        routeId: "5",
        routeColor: "#082747",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: init,
        stops: actualRouteStops,
        showStops: true,
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: this.getBusIcon(taskData),
          size: 0.2,
          opacity: isCompletedRun ? 0 : 1,
          textOpacity: 0,
        },
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
    ];
  }
  getBusIcon = (taskData: RouteTaskStopEventVehicleFeature): string => {
    if (
      taskData.vehicle.properties.eventEndTime &&
      ((taskData.vehicle.properties.eventType !== "reasons_poweroff" &&
        !taskData.vehicle.properties.eventType) ||
        taskData.vehicle.properties.eventType === "reasons_poweroff")
    ) {
      const minAgo = differenceInMinutes(
        new Date(),
        new Date(taskData.vehicle.properties.eventEndTime)
      );
      if (minAgo > 3) return busAlert;
      return busArrow;
    }
    return "";
  };
}
