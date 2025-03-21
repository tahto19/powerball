import { userState } from "@/components/AddUser/Types";
import axios from "axios";

interface Credentials {
  email: string;
  password: string;
}
// Create Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5128",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set the auth token (Call this after login)
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.Aithorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.Authorization;
  }
};

// Automatically set auth token if stored in localStorage

// const getToken = () => localStorage.getItem("toekn");
// if (getToken()) setAuthToken(getToken());

// API service with all CRUD operations
export const apiService = {
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
    setAuthToken(null);
    localStorage.removeItem("token");
  },

  // for creating user in the outside
  createUser: async (d: userState) => {
    const fd = new FormData();
    for (const _d in d) {
      console.log(d[_d], "  ", _d);
      fd.append(_d, d[_d]);
    }
    // const _r = await apiClient.post("/", fd, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });
    // console.log(_r);
  },
};
export const apiServiceUser = {};
export default apiService;
