import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { NgxSliderModule } from "ngx-slider-v2";

import { TimeSliderComponent } from "./time-slider.component";

describe("TimeSliderComponent", () => {
  let component: TimeSliderComponent;
  let fixture: ComponentFixture<TimeSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSliderComponent],
      imports: [MatIconModule, NgxSliderModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should formatLabel", () => {
    const res = component.formatLabel(360);
    expect(res).toEqual("06:00");
  });
  it("should decrementByMin ", () => {
    component.timeValue = 10;
    component.timeRangeOptions.floor = 10;
    component.disabledDec = false;
    component.disabledInc = false;
    component.decrementByMin();
    expect(component.disabledDec).toBeTruthy();
    component.timeValue = 15;
    component.decrementByMin();
    expect(component.timeValue).toEqual(14);
  });
  it("should incrementByMin", () => {
    component.timeValue = 10;
    component.timeRangeOptions.ceil = 10;
    component.disabledDec = false;
    component.disabledInc = false;
    component.incrementByMin();
    expect(component.disabledInc).toBeTruthy();
    component.timeValue = 2;
    component.incrementByMin();
    expect(component.timeValue).toEqual(3);
  });
});
