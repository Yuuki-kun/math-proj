import axios from "axios";

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BE_API_URL,
  // timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});
