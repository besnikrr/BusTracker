import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-recents",
  templateUrl: "./recents.component.html",
  styleUrls: ["./recents.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RecentsComponent {
  @Input() recentsList?: Array<{ type: string; text: string }>;
}
