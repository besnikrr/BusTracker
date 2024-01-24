import { subHours } from "date-fns";

import {
  convertTimeToMinutes,
  formatTimeInHours,
  formatTimeRange,
} from "src/app/utilities/date.format";

describe("Date Format Utility Functions", () => {
  const formattedTime = "13:45";
  const timeInMinutes = 13 * 60 + 45;

  it("convert time to minutes", () => {
    expect(convertTimeToMinutes(formattedTime)).toEqual(timeInMinutes);
  });

  it("format time in hours", () => {
    expect(formatTimeInHours(timeInMinutes)).toEqual(formattedTime);
  });

  it("format time range", () => {
    const start = subHours(new Date(), 1);
    const end = new Date();

    const result = formatTimeRange(start, end);

    expect(result).toMatch(/\d{2}:\d{2} - \d{2}:\d{2}/);
  });
});
