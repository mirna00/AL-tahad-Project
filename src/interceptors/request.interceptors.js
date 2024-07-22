import { _axios } from "./../api/axiosApi";
import { localStorageServices } from "../api/tokenService";

export const httpRequestInterceptors = () => {
  console.log("first");
  return _axios.interceptors.request.use(
    function (config) {
      const accessToken = localStorageServices.getToken();

      if (accessToken && config.headers) {
        config.headers["authorization"] = `Bearer ${accessToken}`;
      }

      // todo Check access token and refresh if it expired

      if (!config.data) return config;

      return config;

      //   // Do something before request is sent
      //   if (!!localStorageServices.getToken())
      //     config.headers[
      //       "Authorization"
      //     ] = `Bearer  ${localStorageServices.getToken()}`;
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
};
