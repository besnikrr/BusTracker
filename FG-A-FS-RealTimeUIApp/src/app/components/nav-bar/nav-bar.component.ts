import { RestAPI } from "@aws-amplify/api-rest";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { Api } from "src/app/app-config";
import { BusinessUnitApi, BusinessUnit, User } from "src/first-student-api";
import { UserService } from "src/app/services/user/user.service";
import { AppStateService } from "src/app/services/state/app-state.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NavBarComponent implements OnInit {
  user?: User;
  businessUnits?: BusinessUnit[];
  validUnits = [10216, 20319, 11202, 31960, 11458, 20181];
  constructor(private appStateService: AppStateService, private userService: UserService) {}

  get selectedBusinessUnit(): BusinessUnit {
    return this.appStateService.selectedBusinessUnit;
  }

  set selectedBusinessUnit(value: BusinessUnit) {
    this.appStateService.selectedBusinessUnit = value;
  }

  ngOnInit() {
    Promise.all([this.getBusinessUnits(), this.getUserProfile()]).then(() =>
      this.userAssignedBusinessUnit()
    );
  }

  async getBusinessUnits() {
    this.businessUnits = await RestAPI.get(Api.ADB, BusinessUnitApi.businessUnitsAll, {});
    const validBusinessUnit: Array<BusinessUnit> = [];
    this.businessUnits?.forEach(unit => {
      if (this.validUnits.includes(unit.id!)) {
        validBusinessUnit.push(unit);
      }
    });
    //shift valid ones to first positions
    validBusinessUnit.forEach(unit => {
      this.businessUnits?.splice(this.businessUnits.indexOf(unit), 1);
      this.businessUnits?.unshift(unit);
    });
    //remove duplicates
    this.businessUnits = [...new Map(this.businessUnits?.map(u => [u.id, u])).values()];
  }

  async getUserProfile() {
    this.user = await this.userService.getUserProfile();
  }

  userAssignedBusinessUnit() {
    if (this.selectedBusinessUnit) {
      return;
    }
    // user's assigned business unit could be invalid
    const userAssignedBusinessUnit =
      this.businessUnits?.find(value => value.id === this.user?.assignedBusinessUnitId) ||
      this.businessUnits?.find(first => !!first);
    this.selectedBusinessUnit = userAssignedBusinessUnit!;
  }

  onLogout() {
    this.userService.logout();
  }
}
