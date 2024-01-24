import { AxiosFactory, AxiosInterceptor } from "./axios-factory";

describe("AxiosFactory", () => {
  it("should create", () => {
    const interceptor: AxiosInterceptor = jasmine.createSpyObj("AxiosInterceptor", ["intercept"]);

    AxiosFactory(interceptor, interceptor)();

    expect(interceptor.intercept).toHaveBeenCalledTimes(2);
  });
});
