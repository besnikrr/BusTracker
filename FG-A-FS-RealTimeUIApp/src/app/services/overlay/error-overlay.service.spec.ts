import { Overlay } from "@angular/cdk/overlay";
import { TestBed } from "@angular/core/testing";
import { ErrorOverlayService } from "./error-overlay.service";

describe("ErrorOverlayService", () => {
  let service: ErrorOverlayService;
  const DEFAULT_CONFIG = {
    hasBackdrop: true,
    backdropClass: "dark-backdrop",
    panelClass: "error-panel",
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Overlay],
    });
    service = TestBed.inject(ErrorOverlayService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should setLastPing", () => {
    service.setLastPing("08:31");
    const res = service.getlastPing();
    expect(res).toEqual("08:31");
  });
  it("should open", () => {
    const res = service.open();
    expect(res).toBeDefined();
  });
  it("should createOverlay", () => {
    const res = service.createOverlay(DEFAULT_CONFIG);
    expect(res).toBeDefined();
  });
  it("should getOverlayConfig", () => {
    const overlayConfig = service.getOverlayConfig(DEFAULT_CONFIG);
    expect(overlayConfig.hasBackdrop).toEqual(true);
  });
  it("should close", () => {
    const res = service.open();
    res.close();
    spyOn(res, "close");
    res.close();
    expect(res.close).toHaveBeenCalled();
  });
});
