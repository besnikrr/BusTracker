import axios, { AxiosInstance } from "axios";

export interface AxiosInterceptor {
  intercept(instance: AxiosInstance): void;
}

export const AxiosFactory = (...interceptors: AxiosInterceptor[]) => {
  return () => interceptors.forEach(interceptor => interceptor.intercept(axios));
};
