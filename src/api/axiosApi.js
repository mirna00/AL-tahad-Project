import axios from "axios";
import { localStorageServices } from "./tokenService";

export const _axios = axios.create({
  baseURL: "http://161.35.27.202",
  withCredentials: false,
  headers:{
    "Access-Control-Allow-Origin":"*"
  }
});

_axios.defaults.headers.common[
  "Authorization"
] = `Bearer  ${localStorageServices.getToken()}`;
