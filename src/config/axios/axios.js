import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_BE_API_URL,
  // timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
