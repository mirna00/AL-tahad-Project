import axios from "axios";
import { localStorageServices } from "./tokenService";

export const _axios = axios.create({
  baseURL: "http://91.144.20.117:7109/",
});

_axios.defaults.headers.common[
  "Authorization"
] = `Bearer  ${localStorageServices.getToken()}`;
