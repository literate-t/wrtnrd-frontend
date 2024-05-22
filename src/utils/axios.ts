import axios from "axios";
import { SIGN_URL } from "@/utils/urls";
import {
  ERROR_FORBIDDEN_403,
  ERROR_UNAUTHENTICATED_401,
} from "@/utils/constants";
import { locate } from "@/utils/common";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.headers["Content-Type"] = "application/json";

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log({ error });
    const {
      response: { status },
    } = error;

    if (ERROR_UNAUTHENTICATED_401 == status) {
      locate(SIGN_URL);
    } else if (ERROR_FORBIDDEN_403 == status) {
      return getNewTokens(error);
    }

    return error;
  }
);

const getNewTokens = (config: any) => {
  const {
    config: { url: targetUrl, method },
  } = config;

  return axiosInstance("/api/auth/new-tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    return axiosInstance(targetUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res;
    });
  });
};

const setValueInSessionStorage = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export default axiosInstance;
