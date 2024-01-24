import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { DashboardComponent } from "./dashboard.component";
import { SearchBarComponent } from "src/app/components/search-bar/search-bar.component";
import { NgxSpinnerService } from "ngx-spinner";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormatDatePipe } from "src/app/utilities/pipes/date/formatDate.pipe";
import { DashboardMapComponent } from "src/app/components/dashboard-map/dashboard-map.component";
import { BusDetailsComponent } from "src/app/components/bus-details/bus-details.component";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        SearchBarComponent,
        DashboardMapComponent,
        BusDetailsComponent,
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
        FormatDatePipe,
      ],
      providers: [NgxSpinnerService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
