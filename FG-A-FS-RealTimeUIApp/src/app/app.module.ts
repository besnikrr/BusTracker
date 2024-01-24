import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AxiosFactory } from "src/app/utilities/interceptors/axios-factory";
import {
  AuthenticationInterceptor,
  BusinessUnitInterceptor,
  JsonAcceptInterceptor,
  JsonContentTypeInterceptor,
} from "src/app/utilities/interceptors/axios-request-interceptors";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

import { AuthGuard } from "./auth.guard";

import { NgxSpinnerModule } from "ngx-spinner";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { RecentsComponent } from "./components/recents/recents.component";
import { TimelineComponent } from "./components/timeline/timeline.component";
import { RouteDetailsComponent } from "./components/route-details/route-details.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { BusDetailsComponent } from "./components/bus-details/bus-details.component";
import { DriverDetailsComponent } from "./components/driver-details/driver-details.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { ReplayComponent } from "./pages/replay/replay.component";
import { ErrorOverlayComponent } from "./components/error-overlay/error-overlay.component";

import { ReplayMapComponent } from "./components/replay-map/replay-map.component";
import { DashboardMapComponent } from "./components/dashboard-map/dashboard-map.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { TaskDetailsComponent } from "./components/task-details/task-details.component";
import { NgxSliderModule } from "ngx-slider-v2";
import { TimeSliderComponent } from "./components/time-slider/time-slider.component";
import { FormatTimePipe } from "./utilities/pipes/time/formatTime.pipe";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DriverFullNamePipe } from "./utilities/pipes/driverName/formatDriverName.pipe";
import { DurationPipe } from "./utilities/pipes/date/formatDateDuration.pipe";
import { FormatDatePipe } from "./utilities/pipes/date/formatDate.pipe";
import { DirectionPipe } from "./utilities/pipes/direction/direction.pipe";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavBarComponent,
    SearchBarComponent,
    RecentsComponent,
    TimelineComponent,
    RouteDetailsComponent,
    BusDetailsComponent,
    DriverDetailsComponent,
    ReplayComponent,
    ErrorOverlayComponent,
    ReplayMapComponent,
    DashboardMapComponent,
    TaskDetailsComponent,
    TimeSliderComponent,
    DurationPipe,
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: AxiosFactory,
      deps: [
        AuthenticationInterceptor,
        BusinessUnitInterceptor,
        JsonAcceptInterceptor,
        JsonContentTypeInterceptor,
      ],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule,
    NgxSpinnerModule.forRoot({ type: "ball-clip-rotate" }),
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormatDatePipe,
    MatCheckboxModule,
    MatButtonModule,
    NgxSliderModule,
    FormatTimePipe,
    DriverFullNamePipe,
    DirectionPipe,
    MatProgressBarModule,
  ],
})
export class AppModule {}
