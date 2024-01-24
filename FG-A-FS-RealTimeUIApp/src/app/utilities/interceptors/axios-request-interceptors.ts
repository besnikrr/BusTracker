import { Injectable } from "@angular/core";
import { Auth } from "@aws-amplify/auth";
import { AxiosInstance, AxiosRequestConfig } from "axios";

import { AxiosInterceptor } from "src/app/utilities/interceptors/axios-factory";
import { AppStateService } from "src/app/services/state/app-state.service";

export class CommonRequestHeaders {
  static readonly Accept = "Accept";
  static readonly Authoriztion = "Authorization";
  static readonly ContentType = "Content-Type";
}

export class CustomRequestHeaders {
  static readonly BusinessUnitId = "X-FG-Business-Unit-Id";
}

const withRequest = (request: AxiosRequestConfig) => {
  const builder = {
    addHeader: (name: string, value: string | number | boolean) => {
      request.headers = { ...request.headers, [name]: value };
      return builder;
    },
    build: (): AxiosRequestConfig => {
      return request;
    },
  };
  return builder;
};

@Injectable({ providedIn: "root" })
export class AuthenticationInterceptor implements AxiosInterceptor {
  intercept(instance: AxiosInstance) {
    instance.interceptors.request.use(async request => {
      const jwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
      return withRequest(request)
        .addHeader(CommonRequestHeaders.Authoriztion, `Bearer ${jwtToken}`)
        .build();
    });
  }
}

@Injectable({ providedIn: "root" })
export class BusinessUnitInterceptor implements AxiosInterceptor {
  constructor(private appStateService: AppStateService) {}

  onSet(): boolean {
    return !!this.appStateService.selectedBusinessUnit?.id;
  }

  intercept(instance: AxiosInstance) {
    instance.interceptors.request.use(
      async request => {
        const businessUnitId = this.appStateService.selectedBusinessUnit?.id;
        return withRequest(request)
          .addHeader(CustomRequestHeaders.BusinessUnitId, businessUnitId!)
          .build();
      },
      undefined,
      { runWhen: () => this.onSet() }
    );
  }
}

@Injectable({ providedIn: "root" })
export class JsonAcceptInterceptor implements AxiosInterceptor {
  onNotSet(request: AxiosRequestConfig): boolean {
    return !request.headers?.[CommonRequestHeaders.Accept];
  }

  intercept(instance: AxiosInstance) {
    instance.interceptors.request.use(
      async request => {
        return withRequest(request)
          .addHeader(CommonRequestHeaders.Accept, "application/json")
          .build();
      },
      undefined,
      { runWhen: this.onNotSet }
    );
  }
}

@Injectable({ providedIn: "root" })
export class JsonContentTypeInterceptor implements AxiosInterceptor {
  onNotSet(request: AxiosRequestConfig): boolean {
    return !request.headers?.[CommonRequestHeaders.ContentType];
  }

  intercept(instance: AxiosInstance) {
    instance.interceptors.request.use(
      async request => {
        return withRequest(request)
          .addHeader(CommonRequestHeaders.ContentType, "application/json; charset=UTF-8")
          .build();
      },
      undefined,
      { runWhen: this.onNotSet }
    );
  }
}
