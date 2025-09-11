//@ts-nocheck
import { bodyDecrypt, randomLetters } from "@/utils/util";
import { getTicket } from "./../redux/reducers/ticket/asyncCalls";
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
import { ImageState2, ImageState } from "@/components/ImagePage/interface";
import { getDeviceInfo } from "@/utils/util";
import axios from "axios";
import { veriyCode } from "./types/user";
import {
  adminType,
  getData,
  getDataV2,
  ticketState,
  TicketDraw,
  exportDataState,
  freeTickets_,
  updateDataUserType,
} from "@/types/allTypes";
import {
  enterEntries,
  postEntries,
} from "@/components/2ndChance_iFrame/Raffles/interface";
import { data } from "react-router-dom";
import moment from "moment";

interface Credentials {
  email: string;
  password: string;
}

let apiClient: any;
const base_url = import.meta.env.VITE_API_BASE_URL;
// Initialize apiClient asynchronously
async function initApiClient() {
  const getDI = await getDeviceInfo();
  apiClient = axios.create({
    baseURL: base_url,
    headers: {
      "pm-scratch-it-m": getDI?.model || "none",
      platformVersion: getDI?.platformVersion || "none",
      platform: getDI?.platform || "none",
    },
    withCredentials: true,
  });
}
function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Strip prefix data:*/*;base64,
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Unexpected reader result type"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
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
  logout: async () => {
    // setAuthToken(null);
    const response = await apiClient.post("/api/logout", {});
    return response;
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
    const res = apiClient.post("/api/game-maintenance/all", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },
  get2ndChanceGMListAll: async (d: fetchAll, token: string | null) => {
    const res = apiClient.post("/api/game-maintenance/2nd-chance/list", {
      data: bodyEncrypt(d, token),
    });
    return res;
  },

  createImage: async (d: ImageState2, token: string | null) => {
    let fd = new FormData();

    fd.append("data", bodyEncrypt(d, token));
    fd.append("file", d.file[0]);
    const res = apiClient.post("/api/file/image", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  },

  updateImage: async (d: ImageState2, token: string | null) => {
    let fd = new FormData();

    fd.append("data", bodyEncrypt(d, token));
    fd.append("file", d.file[0]);
    console.log(d.file[0]);
    const res = apiClient.put("/api/file/image", fd, {});
    // const file = d.file[0];
    // const base64File = await fileToBase64(file);

    // const jsonPayload = {
    //   data: bodyEncrypt(d, token),
    //   file: {
    //     filename: file.name,
    //     mimetype: file.type,
    //     base64: base64File,
    //   },
    // };

    // const res = await apiClient.put("/api/file/image", jsonPayload, {
    //   headers: { "Content-Type": "application/json" },
    // });

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
    try {
      const fd = new FormData();
      for (const _d in d) {
        const value = d[_d as keyof typeof d];
        console.log(_d, d[_d as keyof typeof d]);
        if (value !== null) {
          if (typeof value === "string") {
            fd.append(_d, value); // Append string directly
          } else if (Array.isArray(value) && value.length > 0) {
            fd.append(_d, value[0]); // Append first file if array is not empty
          } else if (_d !== "file") {
            throw new Error(`${_d} has null`);
          }
        } else if (
          _d !== "file" &&
          _d !== "emailAddress" &&
          _d !== "password"
        ) {
          throw new Error(`${_d} has null`);
        }
      }

      const _r = await apiClient.post("/api/users/createUser", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(_r);
      return _r;
    } catch (err) {
      throw err;
    }
  },
  createOTP: async (d: userState) => {
    return apiClient.post("/api/otp", {
      emailAddress: d.emailAddress,
    });
  },
  createOTPForMobileNumber: async (d: userState) => {
    return apiClient.post("/api/otp", {
      mobileNumber: d.mobileNumber,
    });
  },
  verifyOTP: async (data: veriyCode) => {
    return apiClient.post("/api/otp/verify", data);
  },
  insertAdmin: async (data: adminType, token: string) => {
    try {
      let r = await apiClient.post("/api/users", {
        data: bodyEncrypt(JSON.stringify(data), token),
      });

      return bodyDecrypt(r.data, token);
    } catch (err) {
      throw err;
    }
  },
  updateAdmin: async (d: adminType, token: string | null) => {
    const data = [
      "firstname",
      "lastname",
      "emailAddress",
      "birthdate",
      "file",
      "mobileNumber",
      "password",
      "isAdmin",
      "city",
      "barangay",
      "province",
      "hbnandstr",
    ];
    const fd = new FormData();

    fd.append("data", bodyEncrypt(d, token));
    if (d.file) {
      fd.append("file", d.file[0]);
    }

    return apiClient.put("api/users", fd);
  },
  getAdmin: async (data: getDataV2, token: string) => {
    return apiClient.post("/api/users/admin", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  getCostumer: async (data: getData, token?: string | null) => {
    return apiClient.post("/api/users/users", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  getUser: async () => {
    return apiClient.get("/api/users/");
  },
  // getRaffleEntry
  getRaffleEntry: async ({
    data,
    alpha_code,
  }: {
    data: string | undefined;
    alpha_code: string | undefined;
  }) => {
    let params = alpha_code ? { alpha_code } : {};

    if (data && data === "myEntries")
      return apiClient.get("api/ticket/myEntries", { params });
    else return apiClient.get("api/ticket/entries", { params });
  },
  getRaffleEntryList: async (data: getDataV2, token: string, url: string) => {
    return apiClient.post(
      `api/raffleHistory/${url === "myEntries" ? "myEntries" : "allEntries"}`,
      {
        data: bodyEncrypt(JSON.stringify(data), token),
      }
    );
  },
  // post raffleentry
  postRaffleEntry: async (data: postEntries, token: string | null) => {
    return apiClient.post("api/raffleHistory/insert", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },

  getParticipantByRaffle: async (data: getDataV2, token: string | null) => {
    return apiClient.post("api/raffleHistory/getRaffleEntries", {
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
  getTicketDetails: async (data, token: string | null) => {
    return apiClient.post("api/ticket/myTicketDetails", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },

  // audit trail here
  getAudit: async (data: getDataV2, token: string) => {
    return apiClient.post("api/ticket", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  //winner api
  getWinnerList: async (
    data: getDataV2,
    token: string | null,
    url: string | undefined | null
  ) => {
    return apiClient.post(`api/winner/${url}`, {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  // for token
  checkSession: async () => {
    return apiClient.get("/api/login/checkSession");
  },

  // winner here
  getWinner: async (data, token: string | null) => {
    return apiClient.post("api/winner/getDataAll", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },

  getWinnerByRaffle: async (data, token: string | null) => {
    return apiClient.post("api/winner/getWinnersMerge", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
  },
  //forgot password
  forgotPassword: async (data: { email: string }) => {
    const response = await apiClient.post("/api/password-reset/reset", data);
    return response;
  },

  //forgot password
  resetPassword: async (data) => {
    const response = await apiClient.post("/api/password-reset/confirm", data);
    return response;
  },
  exportData: async (data: exportDataState, token: string) => {
    const response = await apiClient.post("api/export", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });

    return bodyDecrypt(response.data, token);
  },
  // alpha code
  getAlphaCode: async (data, token) => {
    const response = await apiClient.post("api/alphacode/", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
    return bodyDecrypt(response.data, token);
  },
  postAlphaCode: async (data, token) => {
    const response = await apiClient.post("api/alphacode/insert", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
    return bodyDecrypt(response.data, token);
  },
  putAlphaCode: async (data, token) => {
    const response = await apiClient.put("api/alphacode/update", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
    return bodyDecrypt(response.data, token);
  },
  getAllAlphaCode: async (token) => {
    const response = await apiClient.get("api/alphacode/");
    return bodyDecrypt(response.data, token);
  },
  getFreeTickets: async (data: getDataV2, token) => {
    const r_ = await apiClient.post("api/freetickets", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
    return bodyDecrypt(r_.data, token);
  },
  postFreeTickets: async (data: freeTickets_, token) => {
    const r_ = await apiClient.post("api/freetickets/insert", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });

    return bodyDecrypt(r_.data, token);
  },
  patchFreeTickets: async (data: freeTickets_, token) => {
    const r_ = await apiClient.put("api/freetickets/patch", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });

    return bodyDecrypt(r_.data, token);
  },
  getUserTypeByUserId: async (id: number, token: string | null) => {
    const r_ = await apiClient.get("api/UserType/byUser", {
      params: { data: bodyEncrypt(JSON.stringify({ id }), token) },
      headers: { secure: true },
    });
    return bodyDecrypt(r_.data, token);
  },
  patchUserType: async (data: updateDataUserType, token: string | null) => {
    const r_ = await apiClient.put("api/UserType", {
      data: bodyEncrypt(JSON.stringify(data), token),
    });
    return bodyDecrypt(r_.data, token);
  },
  getMyUserType: async (id, token) => {
    const r_ = await apiClient.get("api", {
      params: { data: bodyEncrypt(JSON.stringify({ id }), token) },
      headers: { secure: true },
    });
    return bodyDecrypt(r_.data, token);
  },
  postInquiry: async (data) => {
    const response = await apiClient.post("api/inquiry/send", data);
    return response.data;
  },
  postSentOtpForLogin: async (mobileNumber: String) => {
    let time = moment().format("MM dd yyyy") + "-" + randomLetters(25);
    const headers = {
      time,
    };
    // this api is setting the otp
    const response = await apiClient.post(
      "/api/login/mobileLogin",
      {
        data: bodyEncrypt(mobileNumber, time),
      },
      { headers }
    );
    return response.data;
  },
  postForMobileLogin: async (mobileNumber: String, otp: String) => {
    let time = moment().format("MM dd yyyy") + "-" + randomLetters(30);
    const headers = {
      time,
    };
    const response = await apiClient.post(
      "/api/login/loginUsingMobileNumber",
      {
        data: {
          ta_: bodyEncrypt(mobileNumber, time),
          tb_: bodyEncrypt(otp, time),
        },
      },
      { headers }
    );
    return response.data;
  },
};

export default apiService;
