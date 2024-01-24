import { Injectable } from "@angular/core";
import { Auth } from "aws-amplify";
import { RestAPI } from "@aws-amplify/api-rest";

import { Api, authConfig } from "src/app/app-config";
import { UserApi, User } from "src/first-student-api";

@Injectable({
  providedIn: "root",
})
export class UserService {
  async authenticated() {
    return Auth.currentAuthenticatedUser();
  }

  login(state?: string) {
    Auth.federatedSignIn({
      customProvider: authConfig.provider,
      customState: state,
    });
  }

  async getUserProfile(): Promise<User> {
    return RestAPI.get(Api.ADB, UserApi.userProfile, {});
  }

  logout() {
    Auth.signOut();
  }
}
