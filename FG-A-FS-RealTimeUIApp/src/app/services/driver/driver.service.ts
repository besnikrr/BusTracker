import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Bus } from "../bus/bus.service";
import data from "../../../assets/data.json";
import { of } from "rxjs";

export interface driver {
  id: string;
  name: string;
  clockedIn: string;
  vehicleId: string;
  phoneNumber: string;
  routeNumber: string;
  runsTotal: number;
  runsCompleted: number;
  plannedRouteTime: string;
}
@Injectable({
  providedIn: "root",
})
export class DriverService {
  constructor() {
    /// get data
    this.getDrivers();
  }
  selectedDriverId = new BehaviorSubject<string>("");
  selectedDriverIdOb = this.selectedDriverId.asObservable();

  getDrivers() {
    return of(data.items);
  }
  setSelectedDriverId(value: string) {
    this.selectedDriverId.next(value);
  }
  getDriverByName(name: string) {
    let results: Array<any> = [];
    let data: any = [];
    this.getDrivers().subscribe(drivers => {
      data = drivers;
    });
    results = data.filter((driver: Bus) => {
      if (
        driver.driver.lastName.replaceAll(" ", "").toLowerCase().includes(name) ||
        driver.driver.firstName.replaceAll(" ", "").toLowerCase().includes(name)
      )
        return driver;
      else return;
    });
    return results;
  }
  getDriversSortedByName(name: string, sortAZ: boolean) {
    let data: any = [];
    data = this.getDriverByName(name);

    if (sortAZ) {
      return data.sort(function (a: Bus, b: Bus) {
        let x = "";
        let y = "";
        // if same last name sort by first name
        if (a.driver.lastName != b.driver.lastName) {
          x = a.driver.lastName;
          y = b.driver.lastName;
        } else {
          x = a.driver.firstName;
          y = b.driver.firstName;
        }
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      return data.sort(function (a: Bus, b: Bus) {
        let x = "";
        let y = "";
        if (a.driver.lastName != b.driver.lastName) {
          x = a.driver.lastName;
          y = b.driver.lastName;
        } else {
          x = a.driver.firstName;
          y = b.driver.firstName;
        }
        return x > y ? -1 : x < y ? 1 : 0;
      });
    }
  }
}
