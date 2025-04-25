import { getTicket } from "./../redux/reducers/ticket/asyncCalls";
//@ts-nocheck
import _ from "lodash";
import { bodyEncrypt } from "@/utils/util";
import { userState } from "@/components/addUser/TypesHere";
import {
  PrizeState,
  PrizePaginationState,
} from "@/components/PrizeList/interface";
import {
  RaffleState,
  RafflePaginationState,
  PayloadState,
} from "@/components/GameMaintenance/interface";
import {
  ImageState2,ImageState
} from "@/components/ImagePage/interface";
import { getDeviceInfo } from "@/utils/util";
import axios from "axios";
import { veriyCode } from "./types/user";
import { adminType, getData, getDataV2, ticketState, TicketDraw } from "@/types/allTypes";
import { enterEntries } from "@/components/2ndChance_iFrame/Raffles/interface";

interface Credentials {
  email: string;
  password: string;
}

let apiClient: any;

// Initialize apiClient asynchronously
async function initApiClient() {
  const getDI = await getDeviceInfo();
  apiClient = axios.create({
    baseURL: "http://localhost:5128",
    headers: {
      "Content-Type": "application/json",
      "pm-scratch-it-m": getDI?.model || "none",
      platformVersion: getDI?.platformVersion || "none",
      platform: getDI?.platform || "none",
    },
    withCredentials: true,
  });
}

// Call the initialization function
initApiClient();

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
    return response;
  },
  // Logout (Clears token)
  logout: () => {
    // setAuthToken(null);
    localStorage.removeItem("token");
  },

  createPrizeList: async (d: PrizeState, token: string | null) => {
    // const res = apiClient.post('/api/prize-list/', d, {headers: {
    //   "Cookie": `cookie_pb_1271=${token}`,
    // }})
    const res = apiClient.post("/api/prize-list/create", {
      data: bodyEncrypt(d, token),
    });
    // const res = apiClient.post('/api/prize-list/', d)

    return res;
  },
  updatePrizeList: async (d: PrizeState, token: string | null) => {
    const res = apiClient.put("/api/prize-list/", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  getPrizeList: async (d: getData, token: string | null) => {
    const res = apiClient.post("/api/prize-list/", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  getPrizeListAll: async (d: fetchAll, token: string | null) => {
    console.log(d);

    const res = apiClient.post("/api/prize-list/all", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },

  createGM: async (d: PayloadState, token: string | null) => {
    const res = apiClient.post("/api/game-maintenance/create", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  updateGM: async (d: PayloadState, token: string | null) => {
    const res = apiClient.put("/api/game-maintenance/", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  getGMList: async (d: getData, token: string | null) => {
    const res = apiClient.post("/api/game-maintenance/", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  getGMListAll: async (d: fetchAll, token: string | null) => {
    console.log(d);

    const res = apiClient.post("/api/game-maintenance/all", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  get2ndChanceGMListAll: async (d: fetchAll, token: string | null) => {
    console.log(d);

    const res = apiClient.post("/api/game-maintenance/2nd-chance/list", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },

  createImage: async (d: ImageState2, token: string | null) => {
    let fd = new FormData();

    fd.append('data', bodyEncrypt(d, token))
    fd.append('file', d.file[0])
    const res = apiClient.post("/api/file/image", fd,{
      headers: {
        "Content-Type": "multipart/form-data",
      }});
    return res;
  },

  
  updateImage: async (d: ImageState2, token: string | null) => {
    let fd = new FormData();

    fd.append('data', bodyEncrypt(d, token))
    fd.append('file', d.file[0])
    const res = apiClient.put("/api/file/image", fd,{
      headers: {
        "Content-Type": "multipart/form-data",
      }});
    return res;
  },

  getFile: async (d: getDataV2, token: string | null) => {
    const res = apiClient.post("/api/file/", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  serveFile: async (id) => {
    const res = apiClient.get("/api/file/serve/image/" + id);
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
  insertAdmin: async (data: adminType) => {
    return apiClient.post("/api/users", { data });
  },
  updateAdmin: async (data: adminType) => {
    return apiClient.put("api/users", { data });
  },
  getAdmin: async (data: getDataV2, token: string) => {
    return apiClient.post("/api/users/admin", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  getCostumer: async (data: getData, token: string) => {
    return apiClient.post("/api/users/users", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  // getRaffleEntry
  getRaffleEntry: async () => {
    return apiClient.get("api/ticket/entries");
  },
  // post raffleentry
  postRaffleEntry: async (data: enterEntries, token: string | null) => {
    console.log(data);
    return apiClient.post("api/raffleHistory/insert", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  // ticket here
  getTicketList: async (data: getDataV2, token: string | null) => {
    return apiClient.post("api/ticket/user", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  postTicketList: async (data: ticketState, token: string | null) => {
    return apiClient.post("api/ticket", {
      data: bodyEncrypt(JSON.stringify({ ticket_id: data }), token),
    });
  },
  ticketDraw: async (data: TicketDraw, token: string | null) => {
    return apiClient.post("api/ticket/draw", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  // for token
  checkSession: async () => {
    return apiClient.get("/api/login/checkSession");
  },
};

export default apiService;
