import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { RouteDetailsComponent } from "../route-details/route-details.component";
import { BusDetailsComponent } from "../bus-details/bus-details.component";
import { DriverDetailsComponent } from "../driver-details/driver-details.component";
import { RecentsComponent } from "../recents/recents.component";
import { RouteDetailsService } from "src/app/services/route-details/route-details.service";
import { BusService } from "src/app/services/bus/bus.service";
import { DriverService } from "src/app/services/driver/driver.service";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SearchBarComponent, TasksStatus } from "./search-bar.component";
import { TaskService } from "src/app/services/task/task.service";
import { VehicleService } from "../../services/vehicle/vehicle.service";
import { VehicleSearchPageable } from "src/first-student-api";

describe("SearchBarComponent", () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let vehicleService: VehicleService;
  let driverService: DriverService;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBarComponent,
        RouteDetailsComponent,
        BusDetailsComponent,
        DriverDetailsComponent,
        RecentsComponent,
      ],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        RouteDetailsService,
        DriverService,
        BusService,
        TaskService,
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: "" }]),
          },
        },

        { provide: VehicleService, useValue: { search: () => Promise.resolve({ items: [] }) } },
        { provide: DriverService, useValue: { getDriversSortedByName: () => [] } },
        { provide: TaskService, useValue: { getTasksSortedByName: () => [] } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService);
    driverService = TestBed.inject(DriverService);
  });

  it("should set the previous search type", async () => {
    localStorage.setItem("prevSearchType", "Bus");
    await component.ngOnInit();
    expect(component.searchType).toBe("Bus");
  });

  it("should update the search type", () => {
    const event = { value: "Driver" } as MatSelectChange;
    component.onSelectionChange(event);
    expect(component.searchType).toBe("Driver");
  });

  it("should clear the search term and results", () => {
    component.searchTerm = "test";
    component.results = [];
    component.clear();
    expect(component.searchTerm).toBe("");
    expect(component.results).toEqual([]);
  });

  it("should reset the error message and remove the error class", () => {
    spyOn(component, "removeErrorClass");
    component.errorMsg = "error message";
    component.clear();
    expect(component.errorMsg).toBe("");
    expect(component.removeErrorClass).toHaveBeenCalled();
  });

  it("should call clear when search term is empty", () => {
    spyOn(component, "clear");
    component.clear();
    expect(component.clear).toHaveBeenCalled();
  });
  it('should add the "borderRed" class to the searchInputContainer and selectContainer', () => {
    document.body.innerHTML = `
      <div class="selectContainer">
        <div></div>
      </div>
      <div class="searchInputContainer"></div>
    `;
    component.addErrorClass();
    const selectContainer = document.getElementsByClassName("selectContainer")[0];
    const searchInputContainer = document.getElementsByClassName("searchInputContainer")[0];
    expect(selectContainer.children[0].classList).toContain("borderRed");
    expect(searchInputContainer.classList).toContain("borderRed");
  });

  it("should set errorMsg when searchType is Bus and no results are found", fakeAsync(() => {
    component.searchType = "Bus";
    component.searchTerm = "example";
    const res = { items: [] };
    spyOn(vehicleService, "search").and.returnValue(Promise.resolve(res));
    component.onSearchIconClick();
    expect(vehicleService.search).toHaveBeenCalledWith("example");
    expect(component.busData).toEqual({});
    expect(component.errorMsg).toBe("");
  }));
  it("should call onSortChange() and change sortDirection", async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    component.results = [];
    fixture.detectChanges();
    const sortElementDb = fixture.debugElement.query(By.css("#sortSelect"));
    const mockEvent: MatSelectChange = {
      source: sortElementDb?.nativeElement,
      value: "Name (Z-A)",
    };
    sortElementDb?.triggerEventHandler("selectionChange", mockEvent);
    fixture.detectChanges();
    expect(component.sortAZ).toEqual(true);
  });

  it('should return true if prevSearchType is "Bus" and startSearch is false', () => {
    component.startSearch = true;
    const result = component.isBusResult();
    expect(result).toBe;
  });

  it('should return false if prevSearchType is not "Bus"', () => {
    spyOn(localStorage, "getItem").and.returnValue("Driver");
    component.startSearch = false;
    const result = component.isBusResult();
    expect(result).toBeFalse();
  });

  it("should return false if startSearch is true", () => {
    component.startSearch = true;
    const result = component.isBusResult();
    expect(result).toBeFalse();
  });
  it('should return true if prevSearchType is "Driver" and startSearch is false', () => {
    component.startSearch = true;
    const result = component.isDriverResult();
    expect(result).toBe(false);
  });

  it('should return false if prevSearchType is not "Driver"', () => {
    spyOn(localStorage, "getItem").and.returnValue("Task");
    component.startSearch = false;
    const result = component.isDriverResult();
    expect(result).toBeFalse();
  });

  it("should return false if startSearch is true", () => {
    component.startSearch = true;
    const result = component.isDriverResult();
    expect(result).toBeFalse();
  });
  it("should return false if startSearch is false", () => {
    spyOn(localStorage, "getItem").and.returnValue("Driver");
    component.startSearch = true;
    const result = component.isDriverResult();
    expect(result).toBeFalse();
  });
  it("should search for a search term with one character and get error message", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const searchInputElement = fixture.debugElement.query(By.css("#searchInput")).nativeElement;
    searchInputElement.value = "a";
    component.minCharacters = 2;
    const searchIcon = fixture.debugElement.query(By.css(".searchMatIcon"));

    spyOn(component, "onSearchIconClick").and.callThrough();
    spyOn(component, "addErrorClass").and.callThrough();
    searchIcon.triggerEventHandler("click", {});
    component.onSearchIconClick();
    expect(component.onSearchIconClick).toHaveBeenCalled();
    expect(component.errorMsg.length).toBeGreaterThan(0);
    expect(component.addErrorClass).toHaveBeenCalled();
  });
  it('should set errorMsg to "No Results found" if busData length is 0', () => {
    spyOn(vehicleService, "search").and.returnValue(Promise.resolve({ items: [] }));
    component.busData = {};
    component.searchTerm = "non-existing-term";
    component.searchType = "Bus";
    component.onSearchIconClick();
    expect(component.errorMsg).toBe("");
  });
  it('should set errorMsg to "No Results found" if no driver matches the search term', () => {
    spyOn(driverService, "getDriversSortedByName").and.returnValue([]);
    component.busData = {};
    component.searchTerm = "non-existing-term";
    component.searchType = "Driver";
    component.onSearchIconClick();
    expect(component.errorMsg).toBe("Enter at least 2 characters to search");
  });
  it("should set isLoading to true and save the search type to local storage", () => {
    component.searchTerm = "test";
    component.searchType = "Bus";
    component.minCharacters = 3;
    component.onSearchIconClick();
    expect(component.isLoading).toBe(true);
    expect(localStorage.getItem("prevSearchType")).toBe("Bus");
  });

  it("should show an error message if the search term is too short", () => {
    component.searchTerm = "te";
    component.searchType = "Bus";
    component.minCharacters = 3;
    component.onSearchIconClick();
    expect(component.isLoading).toBe(false);
    expect(component.errorMsg).toBe("Enter at least 3 characters to search");
  });
  it("should not throw error if busData or items is not defined", () => {
    component.busData = {};
    component.getCompletedRuns();
    expect(component.busData).toEqual({});

    component.busData = { items: [] };
    component.getCompletedRuns();
    expect(component.busData.items).toEqual([]);
  });

  it("should set task status to COMPLETED for DR", () => {
    const mockBusData: VehicleSearchPageable = {
      offset: 1,
      limit: 10,
      total: 1,
      sort: ["assetNumber,asc"],
      items: [
        {
          id: "142595",
          assetNumber: "142595",
          tasks: [{ status: "DR", driver: {}, totalRuns: 4, completedRuns: 0 }],
        },
      ],
    };
    component.busData = mockBusData;
    if (component.busData && component.busData.items) {
      component.getCompletedRuns();
      if (component.busData.items[0] && component.busData.items[0].tasks) {
        expect(component.busData.items[0].tasks[0].status).toEqual(TasksStatus.COMPLETED);
      } else {
        fail("tasks is undefined");
      }
    } else {
      fail("busData or items is undefined");
    }
  });
  it("should set task status to COMPLETED for DR", () => {
    const mockBusDataEnRoute: VehicleSearchPageable = {
      offset: 1,
      limit: 10,
      total: 1,
      sort: ["assetNumber,asc"],
      items: [
        {
          id: "142595",
          assetNumber: "142595",
          tasks: [{ status: "DD", driver: {}, totalRuns: 4, completedRuns: 0 }],
        },
      ],
    };
    component.busData = mockBusDataEnRoute;
    if (component.busData && component.busData.items) {
      component.getCompletedRuns();
      if (component.busData.items[0] && component.busData.items[0].tasks) {
        expect(component.busData.items[0].tasks[0].status).toEqual(TasksStatus.EN_ROUTE);
      } else {
        fail("tasks is undefined");
      }
    } else {
      fail("busData or items is undefined");
    }
  });
  it("should set task status to COMPLETED for DR", () => {
    const mockBusDataNotStarted: VehicleSearchPageable = {
      offset: 1,
      limit: 10,
      total: 1,
      sort: ["assetNumber,asc"],
      items: [
        {
          id: "142595",
          assetNumber: "142595",
          tasks: [{ status: "TP", driver: {}, totalRuns: 4, completedRuns: 0 }],
        },
      ],
    };
    component.busData = mockBusDataNotStarted;
    if (component.busData && component.busData.items) {
      component.getCompletedRuns();
      if (component.busData.items[0] && component.busData.items[0].tasks) {
        expect(component.busData.items[0].tasks[0].status).toEqual(TasksStatus.NOT_STARTED);
      } else {
        fail("tasks is undefined");
      }
    } else {
      fail("busData or items is undefined");
    }
  });
});
