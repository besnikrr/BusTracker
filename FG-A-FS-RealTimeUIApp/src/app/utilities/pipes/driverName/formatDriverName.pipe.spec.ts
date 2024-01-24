import { DriverFullNamePipe } from "./formatDriverName.pipe";

describe("foramtDateDuration pipe", () => {
  const pipe = new DriverFullNamePipe();

  it("should return driver full name", () => {
    const driver = {
      firstName: "Isabel",
      middleName: "Abc",
      lastName: "Sanchez",
    };
    const fullname = pipe.transform(driver);
    expect(fullname).toBe("Sanchez, Isabel A. ");
  });
});
