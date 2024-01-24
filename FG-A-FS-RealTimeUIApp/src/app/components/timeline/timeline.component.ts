import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { RouteTaskRunStop } from "src/first-student-api";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TaskService } from "src/app/services/task/task.service";
import { AppStateService } from "src/app/services/state/app-state.service";
import { Subscription, combineLatest } from "rxjs";

export enum STATUS_VALUES {
  COMPLETED = "Completed",
  EN_ROUTE = "En Route",
  NOT_STARTED = "Not Started",
}
enum TASK_STATUS {
  TP = "TP",
  FKOE = "FKOE",
  FKOSI = "FKOSI",
  DTSI = "DTSI",
  DR = "DR",
  DTSO = "DTSO",
  FKOSO = "FKOSO",
  DD = "DD",
}
export enum RUN_STATUS {
  COMPLETED = "Completed", //Stands for Completed run
  ACTIVE = "Active", //Stands for En Route run
  INACTIVE = "Inactive", //Stands for Not Started run
}
enum STOP_TYPE {
  DEPOT_STOP = "DP",
  STUDENT_STOP = "ST",
  SCHOOL_STOP = "SC",
}
@Component({
  selector: "app-timeline",
  templateUrl: "./timeline.component.html",
  styleUrls: ["./timeline.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class TimelineComponent implements OnInit, OnDestroy {
  runs: any[] = [];
  task?: RouteTaskRunStop;
  routeStatus = "En Route";
  taskStatus: typeof TASK_STATUS = TASK_STATUS;
  runStatus: typeof RUN_STATUS = RUN_STATUS;
  stopType: typeof STOP_TYPE = STOP_TYPE;
  statusValues: typeof STATUS_VALUES = STATUS_VALUES;
  subscription?: Subscription;
  taskId = "";
  runId = "";
  expandedRuns: boolean[] = [];

  constructor(private taskService: TaskService, private appStateService: AppStateService) {}
  async ngOnInit(): Promise<void> {
    this.subscription = combineLatest([
      this.appStateService.selectedBusinessUnit$,
      this.appStateService.selectedTaskId,
      this.appStateService.selectedRunId,
    ]).subscribe(async values => {
      if (values[0] && values[1] && values[2]) {
        this.taskId = values[1];
        this.runId = values[2];
        await this.getTaskRuns();
        this.setRouteStatus(this.task);
        this.expandedRuns = this.runs.map((run, index) => this.isExpanded(run, index));
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  async getTaskRuns() {
    const res: RouteTaskRunStop = await this.taskService.runStops(this.taskId);
    res.runs?.forEach(run => {
      if (run.id === this.runId) {
        this.appStateService.setSelectedStatus(run.status);
      }
    });
    this.task = res;
    this.runs = res.runs ? res.runs : [];
  }
  logit(expansion: any) {
    return !expansion._expanded;
  }
  setRouteStatus(task: any) {
    switch (task?.status) {
      case TASK_STATUS.TP:
      case TASK_STATUS.FKOE:
      case TASK_STATUS.FKOSI:
      case TASK_STATUS.DTSI:
        this.routeStatus = STATUS_VALUES.NOT_STARTED;
        break;
      case TASK_STATUS.DR:
      case TASK_STATUS.DTSO:
      case TASK_STATUS.FKOSO:
        this.routeStatus = STATUS_VALUES.COMPLETED;
        break;
      case TASK_STATUS.DD:
        this.routeStatus = STATUS_VALUES.EN_ROUTE;
        break;
    }
  }
  isExpanded(run: any, index: number): boolean {
    const hasActive = this.runs.filter((run: any) => run.status === RUN_STATUS.ACTIVE).length !== 0;
    if (run.status === RUN_STATUS.ACTIVE) {
      return true;
    } else if (run.status === RUN_STATUS.INACTIVE && index === 0 && !hasActive) {
      return true;
    } else {
      return false;
    }
  }
}
