import { ApiUrl } from "../../config/apiUrl";
import axios from "../../config/axios/axios";

export const LoginService = async (user) => {
  try {
    const response = await axios.post(ApiUrl.auth.login, user, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
