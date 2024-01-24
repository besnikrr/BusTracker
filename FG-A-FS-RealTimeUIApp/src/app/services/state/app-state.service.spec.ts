import { TestBed } from "@angular/core/testing";

import { cold } from "jasmine-marbles";

import { BusinessUnit } from "src/first-student-api";
import { AppStateService } from "./app-state.service";

describe("AppStateService", () => {
  let service: AppStateService;

  beforeEach(() => {
    service = TestBed.inject(AppStateService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("should set business unit", async () => {
    const businessUnit: BusinessUnit = { id: 1, name: "<name>" };

    const expectedBusinessUnit$ = cold("a", { a: businessUnit });

    service.selectedBusinessUnit = businessUnit;

    expect(service.selectedBusinessUnit$).toBeObservable(expectedBusinessUnit$);
    expect(service.selectedBusinessUnit).toEqual(businessUnit);
  });

  it("business unit subscription should filter out falsy values", async () => {
    let count = 0;
    const subscription = service.selectedBusinessUnit$.subscribe(value => {
      count++;
      expect(value).toBeFalsy();
    });

    expect(count).toEqual(0);
    expect(service.selectedBusinessUnit).toBeFalsy();

    subscription.unsubscribe();
  });

  it("business unit subscription should have changes only after being set", async () => {
    const businessUnit: BusinessUnit = { id: 1, name: "<name>" };

    let count = 0;
    const subscription = service.selectedBusinessUnit$.subscribe(value => {
      count++;
      expect(value).toEqual(businessUnit);
    });

    expect(count).toEqual(0);
    expect(service.selectedBusinessUnit).toBeFalsy();

    service.selectedBusinessUnit = businessUnit;

    expect(count).toEqual(1);
    expect(service.selectedBusinessUnit).toEqual(businessUnit);

    subscription.unsubscribe();
  });

  it("should setSelectedTaskId", () => {
    service.setSelectedTaskId("1");
    service.selectedTaskId.subscribe(id => {
      expect(id).toEqual("1");
    });
  });

  it("should setSelectedRunId", () => {
    service.setSelectedRunId("1");
    service.selectedRunId.subscribe(id => {
      expect(id).toEqual("1");
    });
  });

  it("should setSelectedStatus", () => {
    service.setSelectedStatus("1");
    service.selectedRunStatus.subscribe(id => {
      expect(id).toEqual("1");
    });
  });
});
