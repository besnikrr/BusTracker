import { TestBed } from "@angular/core/testing";
import { Auth } from "@aws-amplify/auth";
import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import { AppStateService } from "src/app/services/state/app-state.service";
import { BusinessUnit } from "src/first-student-api";

import {
  AuthenticationInterceptor,
  BusinessUnitInterceptor,
  JsonAcceptInterceptor,
  JsonContentTypeInterceptor,
  CommonRequestHeaders,
  CustomRequestHeaders,
} from "./axios-request-interceptors";

describe("Axios Request Interceptors", () => {
  let axiosInstance: AxiosInstance;
  let axiosMock: MockAdapter;
  let appStateService: AppStateService;

  beforeEach(() => {
    axiosInstance = axios.create();
    axiosMock = new MockAdapter(axiosInstance);
    appStateService = TestBed.inject(AppStateService);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it("should add authorization request header", async () => {
    const jwtToken = "<jwtToken>";

    const currentSession = spyOn(Auth, "currentSession");
    const cognitoUserSession = jasmine.createSpyObj("CognitoUserSession", ["getIdToken"]);
    const cognitoIdToken = jasmine.createSpyObj("CognitoIdToken", ["getJwtToken"]);

    currentSession.and.returnValue(cognitoUserSession);
    cognitoUserSession.getIdToken.and.returnValue(cognitoIdToken);
    cognitoIdToken.getJwtToken.and.returnValue(jwtToken);

    const interceptor = new AuthenticationInterceptor();

    interceptor.intercept(axiosInstance);

    axiosMock.onGet("/url").reply(request => {
      expect(request.headers?.[CommonRequestHeaders.Authoriztion]).toEqual(`Bearer ${jwtToken}`);

      return [200, {}];
    });

    await axiosInstance("/url");

    expect(currentSession).toHaveBeenCalled();
    expect(cognitoUserSession.getIdToken).toHaveBeenCalled();
    expect(cognitoIdToken.getJwtToken).toHaveBeenCalled();
  });

  it("should add business unit id request header", async () => {
    const businessUnit: BusinessUnit = { id: 1, name: "<name>" };

    appStateService.selectedBusinessUnit = businessUnit;

    const interceptor = new BusinessUnitInterceptor(appStateService);

    interceptor.intercept(axiosInstance);

    axiosMock.onGet("/url").reply(request => {
      expect(request.headers?.[CustomRequestHeaders.BusinessUnitId]).toEqual(businessUnit.id);

      return [200, {}];
    });

    await axiosInstance("/url");
  });

  it("should add accept request header", async () => {
    const interceptor = new JsonAcceptInterceptor();

    interceptor.intercept(axiosInstance);

    axiosMock.onGet("/url").reply(request => {
      expect(request.headers?.[CommonRequestHeaders.Accept]).toEqual("application/json");

      return [200, {}];
    });

    await axiosInstance("/url");
  });

  it("should add content-type request header", async () => {
    const interceptor = new JsonContentTypeInterceptor();

    interceptor.intercept(axiosInstance);

    axiosMock.onGet("/url").reply(request => {
      expect(request.headers?.[CommonRequestHeaders.ContentType]).toEqual(
        jasmine.stringMatching(/^application\/json/)
      );

      return [200, {}];
    });

    await axiosInstance("/url");
  });
});
