import { RestAPI } from "@aws-amplify/api-rest";
import { Injectable } from "@angular/core";

import { Api } from "src/app/app-config";
import {
  VehicleApi,
  VehicleEventFeature,
  VehicleEventRouteTaskNearbyStopDriver,
  VehicleSearchPageable,
} from "src/first-student-api";

@Injectable({
  providedIn: "root",
})
export class VehicleService {
  search(
    query: string,
    searchDate?: Date,
    offset?: number,
    limit?: number,
    sort?: string[]
  ): Promise<VehicleSearchPageable> {
    return RestAPI.get(Api.ADB, VehicleApi.search, {
      queryStringParameters: {
        query: query,
        ...(searchDate && { searchDate: searchDate }),
        ...(offset !== undefined && { offset: offset }),
        ...(limit !== undefined && { limit: limit }),
        ...(sort && { sort: sort }),
      },
    });
  }

  location(): Promise<VehicleEventFeature[]> {
    return RestAPI.get(Api.ADB, VehicleApi.location, {});
  }

  task(vehicleId: string, eventId: string): Promise<VehicleEventRouteTaskNearbyStopDriver> {
    return RestAPI.get(Api.ADB, VehicleApi.task(vehicleId, eventId), {});
  }
}
