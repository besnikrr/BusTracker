import { TestBed } from "@angular/core/testing";
import { RestAPI } from "@aws-amplify/api-rest";

import { v4 as uuidv4 } from "uuid";

import { Api } from "src/app/app-config";
import { TaskApi } from "src/first-student-api";
import { TaskService } from "./task.service";
import { of } from "rxjs";
import { mockTasks } from "src/app/mock/mockData";

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = TestBed.inject(TaskService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("search", async () => {
    const query = "<query>";

    const search = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.search(query);

    expect(search).toHaveBeenCalledOnceWith(Api.ADB, TaskApi.search, {
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

    expect(search).toHaveBeenCalledOnceWith(Api.ADB, TaskApi.search, {
      queryStringParameters: {
        query: query,
        searchDate: searchDate,
        offset: offset,
        limit: limit,
        sort: sort,
      },
    });
  });

  it("task", async () => {
    const routeId = 1;

    const task = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.task(routeId);

    expect(task).toHaveBeenCalledOnceWith(Api.ADB, TaskApi.task(routeId), {});
  });

  it("runStops", async () => {
    const taskId = uuidv4();

    const runStops = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.runStops(taskId);

    expect(runStops).toHaveBeenCalledOnceWith(Api.ADB, TaskApi.runStops(taskId), {});
  });

  it("latest", async () => {
    const taskId = uuidv4();
    const runId = uuidv4();
    const gpsEventTime = "2023-02-23 17:35:01";

    const latest = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.latest(taskId, runId, gpsEventTime);

    expect(latest).toHaveBeenCalledOnceWith(Api.ADB, TaskApi.latest(taskId, runId), {
      queryStringParameters: {
        gpsEventTime,
      },
    });
  });

  it("replay", async () => {
    const taskId = uuidv4();
    const runId = uuidv4();
    const gpsEventTime = "2023-02-23 17:35:01";
    const replay = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.replay(taskId, runId, gpsEventTime);

    expect(replay).toHaveBeenCalledOnceWith(Api.ADB, TaskApi.replay(taskId, runId), {
      queryStringParameters: { gpsEventTime: gpsEventTime },
    });
  });

  it("should getTasks", () => {
    service.getTasks().subscribe(res => {
      expect(res.length).toBeGreaterThan(0);
    });
  });
  it("should getTasksByName when there's a match", () => {
    const getTasksSpy = spyOn(service, "getTasks").and.returnValue(of(mockTasks));
    const res = service.getTasksByName("aa");
    expect(getTasksSpy).toHaveBeenCalled();
    expect(res.length).toBeGreaterThan(0);
  });
  it("should getTasksByName when no match", () => {
    const getTasksSpy = spyOn(service, "getTasks").and.returnValue(of(mockTasks));
    const res = service.getTasksByName("123");
    expect(getTasksSpy).toHaveBeenCalled();
    expect(res.length).toEqual(0);
  });
  it("should getTasksSortedByName when sorted is false", () => {
    const getTasksSpy = spyOn(service, "getTasks").and.returnValue(of(mockTasks));
    const res = service.getTasksSortedByName("aa", false);
    expect(getTasksSpy).toHaveBeenCalled();
    expect(res[0].name).toEqual("AABBB");
  });
  it("should getTasksSortedByName when sorted is true", () => {
    const getTasksSpy = spyOn(service, "getTasks").and.returnValue(of(mockTasks));
    const res = service.getTasksSortedByName("aa", true);
    expect(getTasksSpy).toHaveBeenCalled();
    expect(res[0].name).toEqual("AAAA");
  });
  it("should sort tasks in ascending order by name", () => {
    const tasks = [{ name: "Task C" }, { name: "Task B" }, { name: "Task A" }];
    spyOn(service, "getTasksByName").and.returnValue(tasks);

    const sortedTasks = service.getTasksSortedByName("Task", true);

    expect(sortedTasks.length).toBe(3);
    expect(sortedTasks[0].name).toBe("Task A");
    expect(sortedTasks[1].name).toBe("Task B");
    expect(sortedTasks[2].name).toBe("Task C");
  });

  it("should sort tasks in descending order by name", () => {
    const tasks = [{ name: "Task A" }, { name: "Task B" }, { name: "Task C" }];
    spyOn(service, "getTasksByName").and.returnValue(tasks);

    const sortedTasks = service.getTasksSortedByName("Task", false);

    expect(sortedTasks.length).toBe(3);
    expect(sortedTasks[0].name).toBe("Task C");
    expect(sortedTasks[1].name).toBe("Task B");
    expect(sortedTasks[2].name).toBe("Task A");
  });
  it("should return zero if x and y are equal", () => {
    const tasks = [{ name: "Task A" }, { name: "Task B" }, { name: "Task A" }];
    spyOn(service, "getTasksByName").and.returnValue(tasks);

    const sortedTasks = service.getTasksSortedByName("Task", true);

    expect(sortedTasks.length).toBe(3);
    expect(sortedTasks[0].name).toBe("Task A");
    expect(sortedTasks[1].name).toBe("Task A");
    expect(sortedTasks[2].name).toBe("Task B");
  });
  it("should return a negative number if x > y is true", () => {
    const tasks = [{ name: "Task B" }, { name: "Task A" }, { name: "Task C" }];
    spyOn(service, "getTasksByName").and.returnValue(tasks);

    const sortedTasks = service.getTasksSortedByName("Task", true);

    expect(sortedTasks.length).toBe(3);
    expect(sortedTasks[0].name).toBe("Task A");
    expect(sortedTasks[1].name).toBe("Task B");
    expect(sortedTasks[2].name).toBe("Task C");
  });

  it("should return a positive number if x < y is true", () => {
    const tasks = [{ name: "Task B" }, { name: "Task A" }, { name: "Task C" }];
    spyOn(service, "getTasksByName").and.returnValue(tasks);

    const sortedTasks = service.getTasksSortedByName("Task", false);

    expect(sortedTasks.length).toBe(3);
    expect(sortedTasks[0].name).toBe("Task C");
    expect(sortedTasks[1].name).toBe("Task B");
    expect(sortedTasks[2].name).toBe("Task A");
  });
});
