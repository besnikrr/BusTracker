import { TestBed } from "@angular/core/testing";
import { Auth } from "aws-amplify";
import { ICredentials } from "@aws-amplify/core";
import { RestAPI } from "@aws-amplify/api-rest";

import { Api, authConfig } from "src/app/app-config";
import { UserApi } from "src/first-student-api";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = TestBed.inject(UserService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("authenticated", async () => {
    const currentAuthenticatedUser = spyOn(Auth, "currentAuthenticatedUser").and.returnValue(
      Promise.resolve({})
    );

    await service.authenticated();

    expect(currentAuthenticatedUser).toHaveBeenCalled();
  });

  it("login", async () => {
    const state = "<redirect-url>";

    const federatedSignIn = spyOn(Auth, "federatedSignIn").and.returnValue(
      Promise.resolve({} as ICredentials)
    );

    service.login(state);

    expect(federatedSignIn).toHaveBeenCalledOnceWith({
      customProvider: authConfig.provider,
      customState: state,
    });
  });

  it("getUserProfile", async () => {
    const userProfile = spyOn(RestAPI, "get").and.returnValue(Promise.resolve({}));

    await service.getUserProfile();

    expect(userProfile).toHaveBeenCalledOnceWith(Api.ADB, UserApi.userProfile, {});
  });

  it("logout", async () => {
    const signOut = spyOn(Auth, "signOut").and.returnValue(Promise.resolve({}));

    service.logout();

    expect(signOut).toHaveBeenCalled();
  });
});
