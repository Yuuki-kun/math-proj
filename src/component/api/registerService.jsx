import { ApiUrl } from "../../config/apiUrl";
import axios from "../../config/axios/axios";

export const RegistrationService = async (user) => {
  try {
    console.log("user", user);

    const response = await axios.post(ApiUrl.auth.register, user, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};
