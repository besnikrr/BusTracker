import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-error-overlay",
  templateUrl: "./error-overlay.component.html",
  styleUrls: ["./error-overlay.component.scss"],
})
export class ErrorOverlayComponent implements OnInit {
  minAgo!: number;
  ngOnInit(): void {
    this.getLastConnectedMinutes();
  }
  getLastConnectedMinutes() {
    this.minAgo = 8;
  }
}
