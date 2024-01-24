import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { mockData } from "../bus/bus.service";

import { DriverService } from "./driver.service";

describe("DriverService", () => {
  let service: DriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    });
    service = TestBed.inject(DriverService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should setSelectedDriverId", () => {
    service.setSelectedDriverId("1");
    service.selectedDriverIdOb.subscribe(id => {
      expect(id).toEqual("1");
    });
  });
  it("should getDrivers", () => {
    service.getDrivers().subscribe(res => {
      expect(res.length).toBeGreaterThan(0);
    });
  });

  it("should getDriverByName", () => {
    const getDriversSpy = spyOn(service, "getDrivers").and.returnValue(of([mockData]));
    const res = service.getDriverByName("smith");
    expect(getDriversSpy).toHaveBeenCalled();
    expect(res.length).toBeGreaterThan(0);
  });
  it("should getDriverByName when no match", () => {
    const getDriversSpy = spyOn(service, "getDrivers").and.returnValue(of([mockData]));
    const res = service.getDriverByName("test");
    expect(getDriversSpy).toHaveBeenCalled();
    expect(res.length).toEqual(0);
  });
  it("should getDriversSortedByName when sort is false", () => {
    const getDriverByNameSpy = spyOn(service, "getDriverByName").and.returnValue([
      mockData,
      {
        ...mockData,
        driver: {
          ...mockData.driver,
          lastName: "Zmith",
        },
      },
    ]);
    const res = service.getDriversSortedByName("smith", false);
    expect(getDriverByNameSpy).toHaveBeenCalled();
    expect(res).toEqual([
      {
        ...mockData,
        driver: {
          ...mockData.driver,
          lastName: "Zmith",
        },
      },
      mockData,
    ]);
  });
  it("should getDriversSortedByName when sort is true", () => {
    const getDriverByNameSpy = spyOn(service, "getDriverByName").and.returnValue([
      mockData,
      {
        ...mockData,
        driver: {
          ...mockData.driver,
          lastName: "Zmith",
        },
      },
    ]);
    const res = service.getDriversSortedByName("smith", true);
    expect(getDriverByNameSpy).toHaveBeenCalled();
    expect(res).toEqual([
      mockData,
      {
        ...mockData,
        driver: {
          ...mockData.driver,
          lastName: "Zmith",
        },
      },
    ]);
  });

  it("should sort drivers by firstName + lastName in ascending order when sortAZ is true", () => {
    const drivers = [
      { driver: { lastName: "Smith", firstName: "John" } },
      { driver: { lastName: "Smith", firstName: "Alice" } },
      { driver: { lastName: "Smitz", firstName: "Abbie" } },
    ];
    const getDriverByNameSpy = spyOn(service, "getDriverByName").and.returnValue(drivers);
    const sortedDrivers = service.getDriversSortedByName("sm", true);
    expect(getDriverByNameSpy).toHaveBeenCalled();
    expect(sortedDrivers[0].driver.firstName).toBe("Alice");
    expect(sortedDrivers[1].driver.firstName).toBe("John");
    expect(sortedDrivers[2].driver.lastName).toBe("Smitz");
  });

  it("should sort drivers by firstName + lastName in descending order when sortAZ is false", () => {
    const drivers = [
      { driver: { lastName: "Smith", firstName: "John" } },
      { driver: { lastName: "Smith", firstName: "Alice" } },
      { driver: { lastName: "Smitz", firstName: "Abbie" } },
    ];
    const getDriverByNameSpy = spyOn(service, "getDriverByName").and.returnValue(drivers);
    const sortedDrivers = service.getDriversSortedByName("sm", false);
    expect(getDriverByNameSpy).toHaveBeenCalled();
    expect(sortedDrivers[0].driver.lastName).toBe("Smitz");
    expect(sortedDrivers[1].driver.firstName).toBe("John");
    expect(sortedDrivers[2].driver.firstName).toBe("Alice");
  });
});
