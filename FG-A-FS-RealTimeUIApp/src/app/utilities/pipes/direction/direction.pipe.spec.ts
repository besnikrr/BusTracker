import { DirectionPipe } from "./direction.pipe";

describe("foramtDateDuration pipe", () => {
  const pipe = new DirectionPipe();

  it("should return direction", () => {
    const direction = pipe.transform(113);
    expect(direction).toContain("South");
  });
});
