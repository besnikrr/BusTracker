import { FormatTimePipe } from "./formatTime.pipe";

describe("formatTime pipe", () => {
  const pipe = new FormatTimePipe();

  it("transforms a date to hh:mm", () => {
    expect(pipe.transform("2023-02-17T10:05:49.844", "short")).toBe("10:05");
  });
  it("should formatRunTimeLong", () => {
    const regexPattern = /\d{2}:\d{2}:\d{2}/;
    const time = pipe.transform("2023-02-17T10:05:49.844", "long");
    expect(regexPattern.test(time)).toBe(true);
  });
  it("should formatRunTime distance", () => {
    const time = pipe.transform("2023-02-17T10:05:49.844", "distance");
    expect(time).toContain("ago");
  });
});
