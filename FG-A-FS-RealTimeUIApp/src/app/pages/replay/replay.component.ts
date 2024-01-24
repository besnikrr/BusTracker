import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppStateService } from "src/app/services/state/app-state.service";

@Component({
  selector: "app-replay",
  templateUrl: "./replay.component.html",
  styleUrls: ["./replay.component.scss"],
})
export class ReplayComponent implements OnInit, OnDestroy {
  constructor(private appStateService: AppStateService, private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.appStateService.setSelectedTaskId(params["taskId"]);
      this.appStateService.setSelectedRunId(params["runId"]);
    });
  }
  ngOnDestroy(): void {
    this.appStateService.setSelectedTaskId("");
    this.appStateService.setSelectedRunId("");
  }
}
