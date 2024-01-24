import { FormatDatePipe } from "./formatDate.pipe";

describe("formatDate pipe", () => {
  const pipe = new FormatDatePipe();

  it("transforms a date to mm/dd/yyyy", () => {
    expect(pipe.transform(new Date("03/13/2023"))).toBe("03/13/2023");
  });
});
