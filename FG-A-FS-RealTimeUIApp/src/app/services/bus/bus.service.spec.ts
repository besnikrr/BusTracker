import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { BusService, mockData } from "./bus.service";

describe("BusService", () => {
  let service: BusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    });
    service = TestBed.inject(BusService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should setSelectedBusId", () => {
    service.setSelectedBusId("1");
    service.selectedBusIdOb.subscribe(id => {
      expect(id).toEqual("1");
    });
  });
  it("should getBuses", () => {
    service.getBuses().subscribe(res => {
      expect(res.length).toBeGreaterThan(0);
    });
  });
  it("should getBusByRouteId when there's a match", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of([mockData]));
    const res = service.getBusByRouteId("3fa85f64-5717-4562-b3fc-2c963f66afa6");
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res).toBeTruthy();
  });
  it("should getBusByRouteId when no match", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of([mockData]));
    const res = service.getBusByRouteId("abc");
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res).toBeFalsy();
  });
  it("should getBusByBusName", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of([mockData]));
    const res = service.getBusByBusName("bus");
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res.length).toBeGreaterThan(0);
  });
  it("should getBusByBusName return no results", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of([mockData]));
    const res = service.getBusByBusName("test");
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res.length).toEqual(0);
  });

  it("should getBusByIDandDriver", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of([mockData]));
    const res = service.getBusByIDandDriver("1", "Smith");
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res.length).toBeGreaterThan(0);
  });
  it("should getBusByIDandDriver return no results", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of([mockData]));
    const res = service.getBusByIDandDriver("0", "test");
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res.length).toEqual(0);
  });
  it("should getBusesSortedByName when sorted is false", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(
      of([
        mockData,
        {
          ...mockData,
          vehicle: {
            ...mockData.vehicle,
            properties: {
              ...mockData.vehicle.properties,
              name: "Bus 12Z",
            },
          },
        },
      ])
    );
    const res = service.getBusesSortedByName("bus", false);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res).toEqual([
      {
        ...mockData,
        vehicle: {
          ...mockData.vehicle,
          properties: {
            ...mockData.vehicle.properties,
            name: "Bus 12Z",
          },
        },
      },
      mockData,
    ]);
  });
  it("should getBusesSortedByName when sorted is true", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(
      of([
        mockData,
        {
          ...mockData,
          vehicle: {
            ...mockData.vehicle,
            properties: {
              ...mockData.vehicle.properties,
              name: "Bus 12Z",
            },
          },
        },
      ])
    );
    const res = service.getBusesSortedByName("bus", true);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res).toEqual([
      mockData,
      {
        ...mockData,
        vehicle: {
          ...mockData.vehicle,
          properties: {
            ...mockData.vehicle.properties,
            name: "Bus 12Z",
          },
        },
      },
    ]);
  });
  it("should getNearByBusesSorted when sorted is false", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(
      of([
        mockData,
        {
          ...mockData,
          vehicle: {
            ...mockData.vehicle,
            properties: {
              ...mockData.vehicle.properties,
              name: "Bus 12Z",
            },
          },
        },
      ])
    );
    const res = service.getNearByBusesSorted(false);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res).toEqual([
      {
        ...mockData,
        vehicle: {
          ...mockData.vehicle,
          properties: {
            ...mockData.vehicle.properties,
            name: "Bus 12Z",
          },
        },
      },
      mockData,
    ]);
  });
  it("should getNearByBusesSorted when sorted is true", () => {
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(
      of([
        mockData,
        {
          ...mockData,
          vehicle: {
            ...mockData.vehicle,
            properties: {
              ...mockData.vehicle.properties,
              name: "Bus 12Z",
            },
          },
        },
      ])
    );
    const res = service.getNearByBusesSorted(true);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(res).toEqual([
      mockData,
      {
        ...mockData,
        vehicle: {
          ...mockData.vehicle,
          properties: {
            ...mockData.vehicle.properties,
            name: "Bus 12Z",
          },
        },
      },
    ]);
  });
  it("should return sorted buses by name in ascending order", () => {
    const buses = [
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus A" } } },
      { vehicle: { properties: { name: "Bus C" } } },
    ];
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of(buses));
    const results = service.getBusesSortedByName("bus", true);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(results).toEqual([
      { vehicle: { properties: { name: "Bus A" } } },
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus C" } } },
    ]);
  });

  it("should return sorted buses by name in descending order", () => {
    const buses = [
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus A" } } },
      { vehicle: { properties: { name: "Bus C" } } },
    ];
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of(buses));
    const results = service.getBusesSortedByName("bus", false);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(results).toEqual([
      { vehicle: { properties: { name: "Bus C" } } },
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus A" } } },
    ]);
  });

  it("should return nearby sorted buses by name in ascending order", () => {
    const buses = [
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus A" } } },
      { vehicle: { properties: { name: "Bus C" } } },
    ];
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of(buses));
    const results = service.getNearByBusesSorted(true);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(results).toEqual([
      { vehicle: { properties: { name: "Bus A" } } },
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus C" } } },
    ]);
  });

  it("should return nearby sorted buses by name in descending order", () => {
    const buses = [
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus A" } } },
      { vehicle: { properties: { name: "Bus C" } } },
    ];
    const getBusesSpy = spyOn(service, "getBuses").and.returnValue(of(buses));
    const results = service.getNearByBusesSorted(false);
    expect(getBusesSpy).toHaveBeenCalled();
    expect(results).toEqual([
      { vehicle: { properties: { name: "Bus C" } } },
      { vehicle: { properties: { name: "Bus B" } } },
      { vehicle: { properties: { name: "Bus A" } } },
    ]);
  });
});
