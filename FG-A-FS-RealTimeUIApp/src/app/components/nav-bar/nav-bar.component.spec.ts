import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { RestAPI } from "@aws-amplify/api-rest";

import { Api } from "src/app/app-config";
import { BusinessUnitApi, BusinessUnit, User } from "src/first-student-api";
import { NavBarComponent } from "./nav-bar.component";
import { UserService } from "src/app/services/user/user.service";

describe("NavbarComponent", () => {
  let fixture: ComponentFixture<NavBarComponent>;
  let component: NavBarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatMenuModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
  });

  it("should create", async () => {
    expect(component).toBeTruthy();
  });

  it("should create with default business unit", async () => {
    const businessUnit1: BusinessUnit = { id: 1, name: "<name>" };
    const businessUnit2: BusinessUnit = { id: 2, name: "<name>" };
    const user: User = { firstName: "<first-fame>", lastName: "<last-name>" };

    const getBusinessUnits = spyOn(RestAPI, "get").and.returnValue(
      Promise.resolve([businessUnit1, businessUnit2])
    );
    const getUserProfile = spyOn(UserService.prototype, "getUserProfile").and.returnValue(
      Promise.resolve(user)
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(getBusinessUnits).toHaveBeenCalledOnceWith(
      Api.ADB,
      BusinessUnitApi.businessUnitsAll,
      {}
    );
    expect(getUserProfile).toHaveBeenCalled();
    expect(component.user).toEqual(user);
    expect(component.selectedBusinessUnit).toEqual(businessUnit1);
  });

  it("should create with user's assigned business unit", async () => {
    const businessUnit1: BusinessUnit = { id: 1, name: "<name>" };
    const businessUnit2: BusinessUnit = { id: 2, name: "<name>" };
    const user: User = {
      firstName: "<first-fame>",
      lastName: "<last-name>",
      assignedBusinessUnitId: businessUnit2.id,
    };

    const getBusinessUnits = spyOn(RestAPI, "get").and.returnValue(
      Promise.resolve([businessUnit1, businessUnit2])
    );
    const getUserProfile = spyOn(UserService.prototype, "getUserProfile").and.returnValue(
      Promise.resolve(user)
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(getBusinessUnits).toHaveBeenCalledOnceWith(
      Api.ADB,
      BusinessUnitApi.businessUnitsAll,
      {}
    );
    expect(getUserProfile).toHaveBeenCalled();
    expect(component.user).toEqual(user);
    expect(component.selectedBusinessUnit).toEqual(businessUnit2);
  });

  it("should create and ignore user's assigned business unit if already selected", async () => {
    const businessUnit1: BusinessUnit = { id: 1, name: "<name>" };
    const businessUnit2: BusinessUnit = { id: 2, name: "<name>" };
    const user: User = {
      firstName: "<first-fame>",
      lastName: "<last-name>",
      assignedBusinessUnitId: businessUnit2.id,
    };

    const getBusinessUnits = spyOn(RestAPI, "get").and.returnValue(
      Promise.resolve([businessUnit1, businessUnit2])
    );
    const getUserProfile = spyOn(UserService.prototype, "getUserProfile").and.returnValue(
      Promise.resolve(user)
    );

    component.selectedBusinessUnit = businessUnit1;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getBusinessUnits).toHaveBeenCalledOnceWith(
      Api.ADB,
      BusinessUnitApi.businessUnitsAll,
      {}
    );
    expect(getUserProfile).toHaveBeenCalled();
    expect(component.user).toEqual(user);
    expect(component.selectedBusinessUnit).toEqual(businessUnit1);
  });

  it("should create and ignore invalid user's assigned business unit", async () => {
    const businessUnit1: BusinessUnit = { id: 1, name: "<name>" };
    const businessUnit2: BusinessUnit = { id: 2, name: "<name>" };
    const invalidBusinessUnitId = -1;
    const user: User = {
      firstName: "<first-fame>",
      lastName: "<last-name>",
      assignedBusinessUnitId: invalidBusinessUnitId,
    };

    const getBusinessUnits = spyOn(RestAPI, "get").and.returnValue(
      Promise.resolve([businessUnit1, businessUnit2])
    );
    const getUserProfile = spyOn(UserService.prototype, "getUserProfile").and.returnValue(
      Promise.resolve(user)
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(getBusinessUnits).toHaveBeenCalledOnceWith(
      Api.ADB,
      BusinessUnitApi.businessUnitsAll,
      {}
    );
    expect(getUserProfile).toHaveBeenCalled();
    expect(component.user).toEqual(user);
    expect(component.selectedBusinessUnit).toEqual(businessUnit1);
  });

  it("getBusinessUnits", async () => {
    const getBusinessUnits = spyOn(RestAPI, "get").and.returnValue(
      Promise.resolve([{ id: 10216, name: "Canby" }])
    );
    component.validUnits = [10216, 20319, 11202, 31960, 11458, 20181];
    component.businessUnits = [{ id: 10216, name: "Canby" }];
    await component.getBusinessUnits();

    expect(getBusinessUnits).toHaveBeenCalledOnceWith(
      Api.ADB,
      BusinessUnitApi.businessUnitsAll,
      {}
    );
  });

  it("getUserProfile", async () => {
    const user: User = { firstName: "<first-fame>", lastName: "<last-name>" };

    const getUserProfile = spyOn(UserService.prototype, "getUserProfile").and.returnValue(
      Promise.resolve(user)
    );

    await component.getUserProfile();

    expect(getUserProfile).toHaveBeenCalled();
  });

  it("onLogout", () => {
    const logout = spyOn(UserService.prototype, "logout");

    component.onLogout();

    expect(logout).toHaveBeenCalled();
  });
});
