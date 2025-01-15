import axios from "axios";
export const BASE_URL = "https://agentexperience.up.railway.app";
// export const BASE_URL =
//   "https://des-unavailable-birmingham-phone.trycloudflare.com";

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
