import { TestBed } from "@angular/core/testing";
import { RestAPI } from "@aws-amplify/api-rest";

import { v4 as uuidv4 } from "uuid";

import { Api } from "src/app/app-config";
import { VehicleApi } from "src/first-student-api";
import { VehicleService } from "./vehicle.service";

describe("VehicleService", () => {
  let service: VehicleService;

  beforeEach(() => {
    service = TestBed.inject(VehicleService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("search", async () => {
    const query = "<query>";

    const search = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.search(query);

    expect(search).toHaveBeenCalledOnceWith(Api.ADB, VehicleApi.search, {
      queryStringParameters: {
        query: query,
      },
    });
  });

  it("search with paging and sort", async () => {
    const query = "<query>";
    const searchDate = new Date(new Date().toDateString());
    const offset = 0;
    const limit = 10;
    const sort = ["assetNumber,asc"];

    const search = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.search(query, searchDate, offset, limit, sort);

    expect(search).toHaveBeenCalledOnceWith(Api.ADB, VehicleApi.search, {
      queryStringParameters: {
        query: query,
        searchDate: searchDate,
        offset: offset,
        limit: limit,
        sort: sort,
      },
    });
  });

  it("location", async () => {
    const location = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.location();

    expect(location).toHaveBeenCalledOnceWith(Api.ADB, VehicleApi.location, {});
  });

  it("task", async () => {
    const vehcileId = "<vehicleId>";
    const eventId = uuidv4();

    const task = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.task(vehcileId, eventId);

    expect(task).toHaveBeenCalledOnceWith(Api.ADB, VehicleApi.task(vehcileId, eventId), {});
  });
});
