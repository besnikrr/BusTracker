import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import data from "../../../assets/data.json";
import { ErrorOverlayService } from "../overlay/error-overlay.service";

export interface Bus {
  route: {
    id: string;
    templateId: string;
    name: string;
    status: string;
    scheduledStartTime: string;
    actualStartTime: string;
    scheduledEndTime: string;
    actualEndTime: string;
    completeRuns: number;
    totalRuns: number;
    activeRunId: string;
    direction: string;
    destination: string;
    runStatus: string;
  };
  driver: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    scheduledStartTime: string;
    actualStartTime: string;
    scheduledEndTime: string;
    actualEndTime: string;
    phoneNumber: string;
  };
  vehicle: {
    type: string;
    bbox: [number];
    geometry: {
      type: string;
      bbox: [number];
      coordinates: [number, number];
    };
    properties: {
      id: string;
      type: string;
      name: string;
      heading: number;
      speed: 32;
      speedUnit: string;
      gpsLastUpdatedTime: string;
      lastPowerOnTime: string;
      lastPowerOffTime: string;
    };
    id: 1;
  };
  nextStop: any;
  previousStop: any[];
}
export const mockData: Bus = {
  route: {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    templateId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "XXX000",
    status: "On Time",
    scheduledStartTime: "2023-02-17T10:05:49.844Z",
    actualStartTime: "2023-02-17T10:05:49.844Z",
    scheduledEndTime: "2023-02-17T10:05:49.844Z",
    actualEndTime: "2023-02-17T10:05:49.844Z",
    completeRuns: 0,
    totalRuns: 4,
    activeRunId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    direction: "East",
    destination: "Whilmer High School",
    runStatus: "En Route",
  },
  driver: {
    id: "1",
    firstName: "Anna",
    middleName: "",
    lastName: "Smith",
    scheduledStartTime: "2023-02-17T10:05:49.844Z",
    actualStartTime: "2023-02-17T10:05:49.844Z",
    scheduledEndTime: "2023-02-17T10:05:49.844Z",
    actualEndTime: "2023-02-17T10:05:49.844Z",
    phoneNumber: "555-555-555",
  },
  vehicle: {
    type: "Feature",
    bbox: [0],
    geometry: {
      type: "Feature",
      bbox: [0],
      coordinates: [-93, 40],
    },
    properties: {
      id: "1",
      type: "Type A",
      name: "Bus 12A",
      heading: 0,
      speed: 32,
      speedUnit: "MHP",
      gpsLastUpdatedTime: "2023-02-17T10:05:49.844Z",
      lastPowerOnTime: "2023-02-17T10:05:49.844Z",
      lastPowerOffTime: "2023-02-17T10:05:49.844Z",
    },
    id: 1,
  },
  nextStop: {
    type: "Feature",
    bbox: [0],
    geometry: {
      type: "Feature",
      bbox: [0],
    },
    properties: {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      templateId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      type: "string",
      name: "12 N Main Street",
      description: "string",
      number: 0,
      scheduledArrivalTime: "2023-02-17T10:05:49.844Z",
      estimatedArrivalTime: "2023-02-17T10:05:49.844Z",
      actualArrivalTime: "2023-02-17T10:05:49.844Z",
      scheduledDepartureTime: "2023-02-17T10:05:49.844Z",
      actualDepartureTime: "2023-02-17T10:05:49.844Z",
      stopTime: "4",
      completed: false,
    },
    id: 0,
  },
  previousStop: [
    {
      type: "Feature",
      bbox: [0],
      geometry: {
        type: "Feature",
        bbox: [0],
      },
      properties: {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        templateId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        type: "string",
        name: "string",
        description: "string",
        number: 0,
        scheduledArrivalTime: "2023-02-17T10:05:49.845Z",
        estimatedArrivalTime: "2023-02-17T10:05:49.845Z",
        actualArrivalTime: "2023-02-17T10:05:49.845Z",
        scheduledDepartureTime: "2023-02-17T10:05:49.845Z",
        actualDepartureTime: "2023-02-17T10:05:49.844Z",
        stopTime: "4",
        completed: false,
      },
      id: 0,
    },
  ],
};

@Injectable({
  providedIn: "root",
})
export class BusService {
  constructor(private errorService: ErrorOverlayService) {
    /// get data
    this.getBuses();
  }
  selectedBusId = new BehaviorSubject<string>("");
  selectedBusIdOb = this.selectedBusId.asObservable();

  getBuses(): Observable<Array<any>> {
    if (!Array.from(data.items)) {
      this.errorService.open();
      return of([]);
    }
    return of(Array.from(data.items));
  }
  getBusByRouteId(routeId: string): Bus | undefined {
    let res: Bus[] = [];
    let filtered: Bus[] = [];
    this.getBuses().subscribe(buses => {
      res = buses;
    });
    filtered = res.filter(bus => bus.route.id == routeId);
    return filtered[0];
  }
  setSelectedBusId(value: string) {
    this.selectedBusId.next(value);
  }
  getBusByBusName(name: string) {
    let results: Array<any> = [];
    let data: any = [];
    this.getBuses().subscribe(buses => {
      data = buses;
    });
    results = data.filter((bus: Bus) => {
      if (bus.vehicle.properties?.name.replaceAll(" ", "").toLowerCase().includes(name)) return bus;
      else return false;
    });
    return results;
  }
  getBusesSortedByName(name: string, sortAZ: boolean) {
    let data: any = [];
    this.getBuses().subscribe(buses => {
      data = buses;
    });
    const results = data.filter((bus: Bus) => {
      if (bus.vehicle.properties?.name.replaceAll(" ", "").toLowerCase().includes(name)) return bus;
      else return;
    });
    if (sortAZ) {
      return results.sort(function (a: Bus, b: Bus) {
        const x = a.vehicle.properties?.name;
        const y = b.vehicle.properties?.name;
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      return results.sort(function (a: Bus, b: Bus) {
        const x = a.vehicle.properties?.name;
        const y = b.vehicle.properties?.name;
        return x > y ? -1 : x < y ? 1 : 0;
      });
    }
  }
  getBusByIDandDriver(busID: string, driver: string) {
    let results: Array<Bus> = [];
    let data: any = [];
    this.getBuses().subscribe(buses => {
      data = buses;
    });
    results = data.filter((bus: Bus) => {
      if (bus.vehicle.properties?.id == busID && bus.driver.lastName == driver) return bus;
      else return;
    });
    return results;
  }
  getNearByBusesSorted(sortAZ: boolean) {
    let data: any = [];
    this.getBuses().subscribe(buses => {
      data = buses;
    });
    if (sortAZ) {
      return data.sort(function (a: Bus, b: Bus) {
        const x = a.vehicle.properties?.name;
        const y = b.vehicle.properties?.name;
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      return data.sort(function (a: Bus, b: Bus) {
        const x = a.vehicle.properties?.name;
        const y = b.vehicle.properties?.name;
        return x > y ? -1 : x < y ? 1 : 0;
      });
    }
  }
}
