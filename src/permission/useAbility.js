import React from "react";
import { permission } from "./permission";
import { useContext } from "react";
import { localStorageServices } from "../api/tokenService";

const useAbility = () => {
  const role = localStorageServices.getUser()?.role;

  const can = (func, module) => {
    return !!permission[role]?.[module]?.map((i) => i === func);
  };
  return can;
};

export default useAbility;
