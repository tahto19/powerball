import { userState } from "@/components/AddUser/Types";
import { PrizeState } from "@/components/PrizeList/interface";

import { getDeviceInfo } from "@/utils/util";
import axios from "axios";
import Cookies from "js-cookie";
import { veriyCode } from "./types/user";

interface Credentials {
  email: string;
  password: string;
}
// Create Axios instance
const getDI = await getDeviceInfo();
const apiClient = axios.create({
  baseURL: "http://localhost:5128",
  headers: {
    "Content-Type": "application/json",
    "pm-scratch-it-m": getDI?.model || "none",
    platformVersion: getDI?.platformVersion || "none",
    platform: getDI?.platform || "none",
  },
  withCredentials: true,
});

// Function to set the auth token (Call this after login)
// export const setAuthToken = () => {
//   const token = Cookies.get('pb_user');
//   if (token) {
//     apiClient.defaults.headers.Cookie = `sessionid=${token}`;
//   } else {
//     delete apiClient.defaults.headers.Cookie;
//   }
// };

// Automatically set auth token if stored in localStorage

// const getToken = () => localStorage.getItem("toekn");
// if (getToken()) setAuthToken(getToken());

// API service with all CRUD operations
export const apiService = {
  // ================ Sample ===================
  // GET requests
  getUsers: () => apiClient.get("/users"),
  getGraphs: () => apiClient.get("/graphs"),
  // POST request (e.g., create a new user)
  // createUser: (userData) => apiClient.post("/users", userData),
  // PUT request (e.g., update user details)
  updateUser: (userId: string | number, userData) =>
    apiClient.put(`/users/${userId}`, userData),
  // DELETE request (e.g., delete a user)
  deleteUser: (userId: string | number) => apiClient.delete(`/users/${userId}`),
  // =================== End =====================

  // Login API (Returns token & stores it)
  login: async (credentials: Credentials) => {
    console.log(credentials);
    const response = await apiClient.post("/api/login", credentials);
    // setAuthToken(response.data.token);
    // localStorage.setItem("token", response.data.token);
    return response;
  },
  // Logout (Clears token)
  logout: () => {
    // setAuthToken(null);
    localStorage.removeItem("token");
  },

  createPrizeList: async (d: PrizeState) => {
    const token = Cookies.get("pb_user");
    // const res = apiClient.post('/api/prize-list/', d, {headers: {
    //   "Cookie": `cookie_pb_1271=${token}`,
    // }})
    const res = apiClient.post("/api/prize-list/", d);
    // const res = apiClient.post('/api/prize-list/', d)

    return res;
  },

  // for creating user in the outside
  createUser: async (d: userState) => {
    const fd = new FormData();
    for (const _d in d) {
      const value = d[_d as keyof typeof d];
      console.log(_d, d[_d as keyof typeof d]);
      if (value !== null) {
        if (typeof value === "string") {
          fd.append(_d, value); // Append string directly
        } else if (Array.isArray(value) && value.length > 0) {
          fd.append(_d, value[0]); // Append first file if array is not empty
        } else {
          throw new Error(`${_d} has null`);
        }
      } else throw new Error(`${_d} has null`);
    }

    const _r = await apiClient.post("/api/users/createUser", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return _r;
  },
  createOTP: async (d: userState) => {
    return apiClient.post("/api/otp", {
      emailAddress: d.emailAddress,
    });
  },
  verifyOTP: async (data: veriyCode) => {
    return apiClient.post("/api/otp/verify", data);
  },
};

export default apiService;
