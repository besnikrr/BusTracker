import { Injectable } from "@angular/core";
import TrimbleMaps, { LngLat, LngLatBounds } from "@trimblemaps/trimblemaps-js";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";
import { getPopUpContent, getLoading } from "../../components/dashboard-map/popup";
import { mapConfig } from "src/app/app-config";
import MapMenus from "@trimblemaps/trimblemaps-mapmenus";
import { VehicleService } from "../vehicle/vehicle.service";
import { VehicleEventRouteTaskNearbyStopDriver } from "src/first-student-api";
import { VehicleEventFeature } from "src/first-student-api";
import { calculateBoundingBox } from "src/app/utilities/boundingbox";
@Injectable({
  providedIn: "root",
})
export class DashboardMapService {
  map!: TrimbleMaps.Map;
  markers: TrimbleMaps.Marker[] = [];
  vehicleData?: VehicleEventRouteTaskNearbyStopDriver;

  constructor(
    private routeDetailsService: RouteDetailsService,
    private vehicleService: VehicleService
  ) {}

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

  setMapCenter(lngLat: { lng: number; lat: number } | [number, number], panTo?: boolean) {
    if (panTo) {
      this.map.panTo(lngLat);
    } else {
      this.map.setCenter(lngLat);
    }
  }

  // Adds new markers and removes the old ones so that is shows the vehicles moving.
  // We are using this approach instead of geojson, because addLayer() doesn't support a way to add our bus icons
  addVehicleMarkerIcon(vehicles: VehicleEventFeature[]) {
    // removes the the outdated marker of all vehicles
    if (this.markers.length) {
      this.removeMarkers();
    }

    // creates the markers for all new vehicles
    vehicles.forEach((vehicle: VehicleEventFeature) => {
      const icon = `<svg width="48" height="48" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${vehicle.properties.heading}deg)">
			<g id="Bus Status Icon=Active">
			<g id="Ellipse 7" filter="url(#filter0_d_336_1042)">
			<circle cx="31" cy="28" r="28" transform="rotate(90 31 28)" fill="#0B2265"/>
			</g>
			<g id="Bus Icons">
			<path id="Vector 6 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M20.3463 40.93C19.5284 41.2516 18.7359 40.4067 19.0843 39.5846L30.0929 13.6089C30.437 12.797 31.563 12.797 31.9071 13.6089L42.9157 39.5846C43.2641 40.4067 42.4716 41.2516 41.6537 40.93L31.3549 36.8798C31.1265 36.79 30.8735 36.79 30.6451 36.8798L20.3463 40.93ZM23.679 36.3702L29.5804 34.0494C30.4942 33.69 31.5058 33.69 32.4196 34.0494L38.321 36.3702L31 19.0956L23.679 36.3702Z" fill="white"/>
			</g>
			</g>
			<defs>
			<filter id="filter0_d_336_1042" x="0" y="0" width="62" height="62" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
			<feFlood flood-opacity="0" result="BackgroundImageFix"/>
			<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
			<feOffset dy="3"/>
			<feGaussianBlur stdDeviation="1.5"/>
			<feComposite in2="hardAlpha" operator="out"/>
			<feColorMatrix type="matrix" values="0 0 0 0 0.0431373 0 0 0 0 0.133333 0 0 0 0 0.396078 0 0 0 0.2 0"/>
			<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_336_1042"/>
			<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_336_1042" result="shape"/>
			</filter>
			</defs>
			</svg>`;

      const div = document.createElement("div");
      div.className = "iconBase";
      div.innerHTML = icon;
      div.id = vehicle.id;
      const popup = new TrimbleMaps.Popup({
        offset: 20,
        className: "iconPopup",
        closeButton: false,
      }).setMaxWidth("none");

      const marker = new TrimbleMaps.Marker({
        element: div,
      })
        .setLngLat(vehicle.geometry["coordinates"] as [number, number])
        .setPopup(popup)
        .addTo(this.map);
      this.markers.push(marker);
      popup.once("open", () => {
        let isLoading = true;
        const openRouteDetails = () =>
          this.handleRouteDetails(
            popup,
            vehicle.id,
            this.vehicleData?.task?.id,
            this.vehicleData?.task?.runId,
            vehicle.properties.eventId
          );
        const handleCloseBtn = () => this.handleCloseBtn(popup);
        if (isLoading) {
          popup.setHTML(getLoading());
        }
        this.vehicleService
          .task(vehicle.id, vehicle.properties.eventId)
          .then((vehicleData: VehicleEventRouteTaskNearbyStopDriver) => {
            isLoading = false;
            this.vehicleData = vehicleData;
            popup.setHTML(getPopUpContent(this.vehicleData));
            const viewRouteBtn = document.getElementById("viewRouteDetails");
            const closeBtn = document.getElementById("closePopup");
            viewRouteBtn?.addEventListener("click", openRouteDetails, false);
            closeBtn?.addEventListener("click", handleCloseBtn, false);
          });
      });
      this.onMapClickClosePopup(vehicle.id);

      if (this.vehicleData?.id === vehicle.id) {
        marker.togglePopup();
      }
    });
  }

  onMapClickClosePopup(vehicleId: string) {
    if (this.vehicleData && this.vehicleData.id !== vehicleId) {
      this.map.on("click", () => {
        this.vehicleData = undefined;
      });
    }
  }

  zoomToBoundingBox(vehicles: VehicleEventFeature[]) {
    const coordinates = vehicles.map(vehicles => vehicles.geometry["coordinates"]);
    const boundingBox = calculateBoundingBox(coordinates);
    const bounds = new LngLatBounds(
      new LngLat(boundingBox.south, boundingBox.west), // southwest corner
      new LngLat(boundingBox.north, boundingBox.east) // northeast corner
    );
    this.map.fitBounds(bounds, { padding: mapConfig.padding });
  }
  removeMarkers() {
    this.markers.forEach(marker => {
      marker.remove();
    });
    this.markers = [];
  }
  zoomInPopUp() {
    this.map.setZoom(mapConfig.focusZoom);
    this.map.zoomTo(20, { duration: 2000, animate: true });
  }
  handleRouteDetails(
    popup: TrimbleMaps.Popup,
    vehicleId: string,
    taskId?: string,
    runId?: string,
    eventId?: string
  ) {
    this.routeDetailsService.openViewDetails(vehicleId, taskId, runId, eventId);
    this.vehicleData = undefined;
    popup.remove();
  }
  handleCloseBtn(popup: TrimbleMaps.Popup) {
    this.vehicleData = undefined;
    popup.remove();
  }
}
