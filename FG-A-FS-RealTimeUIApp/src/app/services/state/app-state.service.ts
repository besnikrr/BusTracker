import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { BusinessUnit } from "src/first-student-api";
import { StateService } from "src/app/services/state/state.service";

interface AppState {
  selectedBusinessUnit: BusinessUnit;
}

@Injectable({ providedIn: "root" })
export class AppStateService extends StateService<AppState> {
  selectedBusinessUnit$: Observable<BusinessUnit> = this.select(
    state => state.selectedBusinessUnit
  );
  selectedTaskId = new BehaviorSubject<string>("");
  selectedTaskIdOb = this.selectedTaskId.asObservable();
  selectedRunId = new BehaviorSubject<string>("");
  selectedRunIdOb = this.selectedRunId.asObservable();
  selectedRunStatus = new BehaviorSubject<string>("");
  selectedRunStatusOb = this.selectedRunStatus.asObservable();

  setSelectedTaskId(id: string) {
    this.selectedTaskId.next(id);
  }

  setSelectedRunId(id: string) {
    this.selectedRunId.next(id);
  }

  setSelectedStatus(status: string) {
    this.selectedRunStatus.next(status);
  }

  public get selectedBusinessUnit(): BusinessUnit {
    return super.state.selectedBusinessUnit;
  }

  public set selectedBusinessUnit(value: BusinessUnit) {
    super.state = { selectedBusinessUnit: value };
  }
}
