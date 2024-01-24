import { Options } from "ngx-slider-v2";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { formatTimeInHours } from "src/app/utilities/date.format";

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: "app-time-slider",
  templateUrl: "./time-slider.component.html",
  styleUrls: ["./time-slider.component.scss"],
})
export class TimeSliderComponent {
  timeValue = 360;
  @Input() timeRangeOptions: Options = {
    floor: 360,
    ceil: 600,
    step: 1,
    tickStep: 1,
    translate: (value: number): string => {
      if (value != this.timeRangeOptions.ceil && value != this.timeRangeOptions.floor) {
        this.disabledDec = false;
        this.disabledInc = false;
      }
      return formatTimeInHours(value);
    },
    showTicks: true,
    showTicksValues: true,
  };
  disabledDec = false;
  disabledInc = false;

  incrementByMin() {
    if (this.timeValue == this.timeRangeOptions.ceil) {
      this.disabledInc = true;
    } else {
      this.timeValue = this.timeValue + 1;
      this.disabledDec = false;
      this.disabledInc = false;
    }
  }
  decrementByMin() {
    if (this.timeValue == this.timeRangeOptions.floor) {
      this.disabledDec = true;
    } else {
      this.timeValue = this.timeValue - 1;
      this.disabledDec = false;
      this.disabledInc = false;
    }
  }
  formatLabel(value: number) {
    return formatTimeInHours(value);
  }
}
