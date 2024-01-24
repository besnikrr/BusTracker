import { Amplify } from "aws-amplify";

import { AppConfig } from "src/app/app-config";

describe("AppConfig", () => {
  it("should create", () => {
    const configure = spyOn(Amplify, "configure");

    AppConfig.configure();

    expect(configure).toHaveBeenCalled();
  });
});
