import { DurationPipe } from "./formatDateDuration.pipe";

describe("foramtDateDuration pipe", () => {
  const pipe = new DurationPipe();

  it("should return the minutes and seconds if difference is greater then 0", () => {
    const actualDeparture = "2023-02-23T17:38:01.000";
    const actualArrival = "2023-02-23T17:35:00.000";
    const duration = pipe.transform(actualDeparture, actualArrival);
    expect(duration).toBe("3 m 1 s");
  });
  it("should return the duration in hours if the difference is greater or equal to 3600 sec (60 minutes)", () => {
    const actualDeparture = "2023-02-23T19:20:01.000";
    const actualArrival = "2023-02-23T17:38:00.000";
    const duration = pipe.transform(actualDeparture, actualArrival);
    expect(duration).toBe("1 h 42 m 1 s");
  });
  it("should return an empty string if the difference is less than 0 seconds", () => {
    const actualDeparture = "2023-02-23T17:35:04.000";
    const actualArrival = "2023-02-23T17:35:05.000";
    const duration = pipe.transform(actualDeparture, actualArrival);
    expect(duration).toBe("");
  });
});
