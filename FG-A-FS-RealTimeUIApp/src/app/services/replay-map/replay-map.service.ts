import { Injectable } from "@angular/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { mapConfig } from "src/app/app-config";
import MapMenus from "@trimblemaps/trimblemaps-mapmenus";
import { Event, VehicleEventFeature } from "src/first-student-api";

import {
  coldStart,
  doorOpenCLose,
  motionStop,
  hardBreak,
  idling,
  motionStart,
  powerOff,
  powerOn,
} from "../../../assets/icons";
// import { setVehicleEventPopup } from "../../../app/components/replay-map/bus-event-popup";
interface busEventIconsInterface {
  [key: string]: string;
}

const busEventIcons: busEventIconsInterface = {
  reasons_coldstart: coldStart,
  reasons_dooropenclose: doorOpenCLose,
  reasons_hardbreak: hardBreak,
  reasons_idling: idling,
  reasons_motionstart: motionStart,
  reasons_motionstop: motionStop,
  reasons_poweron: powerOn,
  reasons_poweroff: powerOff,
};

@Injectable({
  providedIn: "root",
})
export class ReplayMapService {
  map!: TrimbleMaps.Map;
  routes: TrimbleMaps.Route[] = [];
  eventMarkers: TrimbleMaps.Marker[] = [];
  routesMap: Map<string, TrimbleMaps.Route> = new Map<string, TrimbleMaps.Route>();

  initMap(options: TrimbleMaps.MapOptions) {
    TrimbleMaps.APIKey = mapConfig.apiKey;

    this.map = new TrimbleMaps.Map(options);
    this.map.addControl(new TrimbleMaps.NavigationControl());
    const ctrlOptions = { showContentLayers: true, showBaseStyles: true };
    const controls = new MapMenus(ctrlOptions);
    this.map.addControl(controls, "top-right");

    const scale = new TrimbleMaps.ScaleControl({
      maxWidth: 80,
      unit: "imperial",
    });
    this.map.addControl(scale);
    return this.map;
  }

  setRouteOnLoad(routeOptions: TrimbleMaps.RouteOptions) {
    const route = new TrimbleMaps.Route(routeOptions);
    this.addRouteToMap(route);
    this.routesMap.set(route.getRouteId(), route);
  }

  updateRouteOnRoad(routeOptions: TrimbleMaps.RouteOptions) {
    this.updateRoute(this.routesMap.get(`${routeOptions.routeId}`), routeOptions);
  }

  addRouteToMap(route: TrimbleMaps.Route) {
    route.addTo(this.map);
  }

  updateRoute(route: TrimbleMaps.Route | undefined, routeOptions: TrimbleMaps.RouteOptions) {
    route?.update(routeOptions);
  }

  moveLayers() {
    for (let i = 0; i < Array.from(this.routesMap.keys()).length; i++) {
      this.map.moveLayer(`route-layer-${i + 1}`, "labels_pointaddress");
    }
  }

  removeRoutes() {
    for (const [, value] of this.routesMap) {
      value.remove();
    }
    this.routesMap.clear();
  }

  addEventMarkers(vehicleEvents: Event) {
    if (this.eventMarkers.length) {
      this.removeEventMarkers();
    }

    for (const vehicleEventKey in vehicleEvents) {
      const events: VehicleEventFeature[] = vehicleEvents[vehicleEventKey]
        ?.features as VehicleEventFeature[];

      // this sets event icon based on the event
      const busEventIcon = document.createElement("div");
      busEventIcon.innerHTML = busEventIcons[vehicleEventKey];

      // Adds event markers
      if (typeof events !== "undefined") {
        for (const event of events) {
          // const busEventPopup = new TrimbleMaps.Popup({
          //   className: "event-popup",
          // })
          //   .setHTML(setVehicleEventPopup(event))
          //   .setMaxWidth("none");

          const eventMarker = new TrimbleMaps.Marker({
            element: busEventIcon,
          })
            .setLngLat(event.geometry.coordinates as [number, number])
            // .setPopup(busEventPopup)
            .addTo(this.map);
          this.eventMarkers.push(eventMarker);
        }
      }
    }
  }

  removeEventMarkers() {
    this.eventMarkers.forEach(marker => {
      marker.remove();
    });
    this.eventMarkers = [];
  }
}
