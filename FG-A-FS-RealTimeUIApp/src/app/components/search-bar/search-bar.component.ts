import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatSelectChange, MAT_SELECT_CONFIG } from "@angular/material/select";
import { searchConfig } from "src/app/app-config";
import { VehicleService } from "../../services/vehicle/vehicle.service";
import { VehicleSearch, VehicleSearchPageable } from "src/first-student-api";
export enum TasksStatus {
  DEPOT_DEPART = "DD",
  DEPORT_RETURN = "DR",
  DRIVER_TABLET_SIGN_OUT = "DTSO",
  FIRST_KIOSK_SIGN_OUT = "FKOSO",
  TASK_PLANNED = "TP",
  FIRST_KIOSK_ELIGIBLE = "FKOE",
  FIRST_KIOSK_SIGN_IN = "FKOSI",
  DRIVER_TABLET_SIGN_IN = "DTSI",
  COMPLETED = "Completed",
  EN_ROUTE = "En Route",
  NOT_STARTED = "Not Started",
}
@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: "sortDropPanel" },
    },
  ],
})
export class SearchBarComponent implements OnInit {
  email?: string;
  searchTerm = "";
  minCharacters: number = searchConfig.minCharacters;
  startSearch!: boolean;
  searchType = "Bus";
  isLoading = false;
  results: VehicleSearch[] | undefined = [];
  errorMsg = "";
  sortAZ!: boolean;
  busData: VehicleSearchPageable = {};

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.sortAZ = true;
    localStorage.setItem("prevSearchType", this.searchType);
  }

  onSelectionChange(event: MatSelectChange) {
    this.searchType = event.value;
  }
  onSortChange(event: MatSelectChange) {
    this.sortAZ = event.value.includes("A-Z");
    this.onSearchIconClick();
  }
  clear() {
    this.searchTerm = "";
    this.errorMsg = "";
    this.startSearch = true;
    this.removeErrorClass();
    this.busData = {};
    this.results = [];
    this.isLoading = false;
  }

  addErrorClass() {
    const selectContainer = document.getElementsByClassName("selectContainer")[0];
    const searchInputContainer = document.getElementsByClassName("searchInputContainer")[0];
    searchInputContainer.classList.add("borderRed");
    selectContainer.children[0].classList.add("borderRed");
  }
  removeErrorClass() {
    const selectContainer = document.getElementsByClassName("selectContainer")[0];
    const searchInputContainer = document.getElementsByClassName("searchInputContainer")[0];
    searchInputContainer.classList.remove("borderRed");
    selectContainer.children[0].classList.remove("borderRed");
  }
  onSearchIconClick() {
    this.isLoading = true;
    this.errorMsg = "";
    localStorage.setItem("prevSearchType", this.searchType);
    if (this.searchTerm?.length >= this.minCharacters && this.searchType == "Bus") {
      this.vehicleService.search(this.searchTerm).then((res: VehicleSearchPageable) => {
        if (res.items?.length === 0) {
          this.errorMsg = "No Results found";
          this.isLoading = false;
          this.busData = {};
          this.results = [];
          return;
        }
        this.busData = res;
        this.isLoading = false;
        this.results = this.busData.items;
        this.getCompletedRuns();
        this.errorMsg = "";
      });
      return;
    }
    this.isLoading = false;
    this.addErrorClass();
    this.errorMsg = `Enter at least ${this.minCharacters} characters to search`;
  }
  isBusResult() {
    return localStorage.getItem("prevSearchType")?.toString() == "Bus" && !this.startSearch;
  }
  isDriverResult() {
    return localStorage.getItem("prevSearchType")?.toString() == "Driver" && !this.startSearch;
  }
  getCompletedRuns() {
    if (this.busData && this.busData.items) {
      this.busData.items.forEach(item => {
        if (item.tasks) {
          item.tasks.forEach(task => {
            switch (task.status) {
              case "TP":
              case "FKOE":
              case "FKOSI":
              case "DTSI":
                task.status = TasksStatus.NOT_STARTED;
                break;
              case "DD":
                task.status = TasksStatus.EN_ROUTE;
                break;
              case "DR":
              case "DTSO":
              case "FKOSO":
                task.status = TasksStatus.COMPLETED;
                break;
              default:
                break;
            }
          });
        }
      });
    }
  }
}
