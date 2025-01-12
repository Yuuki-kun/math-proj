import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

import { axiosPrivate } from "../config/axios/axiosPrivate";

const usePrivateRequest = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  // const axiosPrivate = axios.create({
  //   baseURL: process.env.REACT_APP_BE_API_URL, // Đặt URL gốc cho API
  //   headers: {
  //     // Cấu hình các header nếu cần thiết, ví dụ: Authorization token
  //   },
  // });

  // debugger;
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        console.log("error=" + JSON.stringify(error));

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          console.log("Token expired, refreshing token");

          prevRequest.sent = true;
          const newAccessToken = await refresh();
          console.log("newtoken=" + newAccessToken);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          console.log(`new token = Bearer ${newAccessToken}`);

          return axiosPrivate(prevRequest);
        }
        if (error?.response?.status === 401) {
          window.location.href = "/math-proj/#/authentication/login";
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default usePrivateRequest;
