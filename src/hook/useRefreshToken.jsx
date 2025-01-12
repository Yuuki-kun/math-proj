import React from "react";
import useAuth from "./useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../config/axios/axios";
import { ApiUrl } from "../config/apiUrl";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  console.log("refresh token = " + localStorage.getItem("refreshToken"));

  const refresh = async () => {
    console.log("refresh token = " + localStorage.getItem("refreshToken"));
    try {
      console.log("post to " + ApiUrl.auth.refreshToken);

      const response = await axios.post(ApiUrl.auth.refreshToken, {
        withCredentials: true,
      });

      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        console.log(response.data);
        console.log("new access token = " + response.data.access_token);
        return {
          ...prev,
          email: response.data.email,
          roles: response.data.roles,
          accessToken: response.data.access_token,
          cartId: response.data.cartId,
          userId: response.data.userId,
        };
      });

      if (response.data.refresh_token !== undefined) {
        localStorage.setItem("refreshToken", response.data.refresh_token);
      }
      return response.data.access_token;
    } catch (error) {
      // console.error("error from use refresh: " + error);

      if (error?.response?.status === 403) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  return refresh;
};

export default useRefreshToken;
