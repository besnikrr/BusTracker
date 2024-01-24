import { components } from "src/first-student-openapi";

export class BusinessUnitApi {
  static businessUnitsAll = "/locations/businessUnits/all";
}

export class PersonApi {
  static driverSearch = "/persons/driver/search";
}

export class PlaceApi {
  static search = "/places/search";
}

export class TaskApi {
  static search = "/tasks/search";
  static task = (routeId: number): string => `/tasks/routes/${routeId}/task`;
  static runStops = (taskId: string): string => `/tasks/${taskId}/runs/stops`;
  static latest = (taskId: string, runId: string): string => `/tasks/${taskId}/gps/${runId}/latest`;
  static replay = (taskId: string, runId: string): string => `/tasks/${taskId}/gps/${runId}/replay`;
}

export class UserApi {
  static userProfile = "/auth/user/profile";
}

export class VehicleApi {
  static search = "/vehicles/search";
  static location = "/vehicles/gps/boundingbox";
  static task = (vehicleId: string, eventId: string): string =>
    `/vehicles/${vehicleId}/gps/${eventId}/task`;
}

export type BusinessUnit = components["schemas"]["BusinessUnit"];

export type Driver = components["schemas"]["Driver"];
export type DriverSearch = components["schemas"]["DriverSearch"];
export type DriverSearchPageable = components["schemas"]["DriverSearchPageable"];

export type Person = components["schemas"]["Person"];

export type Place = components["schemas"]["Place"];
export type PlaceSearch = components["schemas"]["PlaceSearch"];
export type PlaceSearchPageable = components["schemas"]["PlaceSearchPageable"];

export type RouteTaskNearbyStopDriver = components["schemas"]["RouteTaskNearbyStopDriver"];
export type RouteTaskNearbyStopDriverVehicleEvent =
  components["schemas"]["RouteTaskNearbyStopDriverVehicleEvent"];
export type RouteTaskRunStop = components["schemas"]["RouteTaskRunStop"];
export type RouteTaskStopEventVehicleFeature =
  components["schemas"]["RouteTaskStopEventVehicleFeature"];
export type Event = { [key: string]: components["schemas"]["FeatureCollection"] | undefined };

export type Run = components["schemas"]["Run"];
export type RunStop = components["schemas"]["RunStop"];

export type Stop = components["schemas"]["Stop"];
export type StopFeature = components["schemas"]["StopFeature"];

export type Task = components["schemas"]["Task"];
export type TaskDriver = components["schemas"]["TaskDriver"];
export type TaskDriverVehicle = components["schemas"]["TaskDriverVehicle"];
export type TaskSearch = components["schemas"]["TaskSearch"];
export type TaskSearchPageable = components["schemas"]["TaskSearchPageable"];
export type TaskVehicle = components["schemas"]["TaskVehicle"];

export type User = components["schemas"]["User"];

export type Vehicle = components["schemas"]["Vehicle"];
export type VehicleEvent = components["schemas"]["VehicleEvent"];
export type VehicleEventFeature = components["schemas"]["VehicleEventFeature"];
export type VehicleEventRouteTaskNearbyStopDriver =
  components["schemas"]["VehicleEventRouteTaskNearbyStopDriver"];
export type VehicleSearch = components["schemas"]["VehicleSearch"];
export type VehicleSearchPageable = components["schemas"]["VehicleSearchPageable"];
