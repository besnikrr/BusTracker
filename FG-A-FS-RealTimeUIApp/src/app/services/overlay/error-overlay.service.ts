import { Injectable } from "@angular/core";
import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ErrorOverlayComponent } from "../../components/error-overlay/error-overlay.component";
import { format } from "date-fns";
import { TIME_FORMAT } from "src/app/utilities/date.format";
import { BehaviorSubject } from "rxjs";

interface ErrorOverlayServiceConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: ErrorOverlayServiceConfig = {
  hasBackdrop: true,
  backdropClass: "dark-backdrop",
  panelClass: "error-panel",
};
@Injectable({
  providedIn: "root",
})
export class ErrorOverlayService {
  lastPing = new BehaviorSubject<string>(format(new Date(), TIME_FORMAT));

  constructor(private overlay: Overlay) {}
  setLastPing(time: string) {
    this.lastPing.next(time);
  }
  getlastPing() {
    return this.lastPing.getValue();
  }
  open() {
    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(DEFAULT_CONFIG);

    // Instantiate remote control
    const dialogRef = new ErrorOverlayRef(overlayRef);
    // Create ComponentPortal that can be attached to a PortalHost
    const filePreviewPortal = new ComponentPortal(ErrorOverlayComponent);
    document
      .getElementsByClassName("cdk-overlay-container")[0]
      .classList.add("errorPanelContainer");
    // Attach ComponentPortal to PortalHost
    overlayRef.attach(filePreviewPortal);
    return dialogRef;
  }

  createOverlay(config: ErrorOverlayServiceConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  getOverlayConfig(config: ErrorOverlayServiceConfig): OverlayConfig {
    const positionStrategy = this.overlay.position().global().top("60px");

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }
}
class ErrorOverlayRef {
  constructor(private overlayRef: OverlayRef) {}

  close(): void {
    this.overlayRef.dispose();
  }
}
