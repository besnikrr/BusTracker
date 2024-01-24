import { RestAPI } from "@aws-amplify/api-rest";
import { Injectable } from "@angular/core";
import { Api } from "src/app/app-config";
import {
  RouteTaskNearbyStopDriverVehicleEvent,
  RouteTaskRunStop,
  RouteTaskStopEventVehicleFeature,
  TaskApi,
  TaskSearchPageable,
} from "src/first-student-api";
import { of } from "rxjs";
import { mockTasks } from "src/app/mock/mockData";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  search(
    query: string,
    searchDate?: Date,
    offset?: number,
    limit?: number,
    sort?: string[]
  ): Promise<TaskSearchPageable> {
    return RestAPI.get(Api.ADB, TaskApi.search, {
      queryStringParameters: {
        query: query,
        ...(searchDate && { searchDate: searchDate }),
        ...(offset !== undefined && { offset: offset }),
        ...(limit !== undefined && { limit: limit }),
        ...(sort && { sort: sort }),
      },
    });
  }

  task(routeId: number): Promise<RouteTaskNearbyStopDriverVehicleEvent> {
    return RestAPI.get(Api.ADB, TaskApi.task(routeId), {});
  }

  runStops(taskId: string): Promise<RouteTaskRunStop> {
    return RestAPI.get(Api.ADB, TaskApi.runStops(taskId), {});
  }

  latest(
    taskId: string,
    runId: string,
    gpsEventTime?: string
  ): Promise<RouteTaskStopEventVehicleFeature> {
    return RestAPI.get(
      Api.ADB,
      TaskApi.latest(taskId, runId),
      gpsEventTime
        ? {
            queryStringParameters: { gpsEventTime: gpsEventTime },
          }
        : {}
    );
  }

  replay(
    taskId: string,
    runId: string,
    gpsEventTime: string
  ): Promise<RouteTaskStopEventVehicleFeature> {
    return RestAPI.get(
      Api.ADB,
      TaskApi.replay(taskId, runId),
      gpsEventTime
        ? {
            queryStringParameters: { gpsEventTime: gpsEventTime },
          }
        : {}
    );
  }
  getTasks() {
    return of(mockTasks);
  }
  getTasksByName(name: string) {
    let results: Array<any> = [];
    let data: any = [];
    this.getTasks().subscribe(tasks => {
      data = tasks;
    });
    results = data.filter((task: any) => {
      if (task.name.replaceAll(" ", "").toLowerCase().includes(name.replaceAll(" ", "")))
        return task;
      else return;
    });
    return results;
  }
  getTasksSortedByName(name: string, sortAZ: boolean) {
    let data: any = [];
    data = this.getTasksByName(name);
    if (sortAZ) {
      return data.sort(function (a: any, b: any) {
        let x = "";
        let y = "";
        x = a.name;
        y = b.name;
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      return data.sort(function (a: any, b: any) {
        let x = "";
        let y = "";
        x = a.name;
        y = b.name;
        return x > y ? -1 : x < y ? 1 : 0;
      });
    }
  }
}
