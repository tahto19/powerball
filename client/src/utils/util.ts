import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const getErrorsStatus = (code: string) => {
  const c_ = code.toLowerCase().replace("errorcode", "").trim();
  switch (c_) {
    case "x1":
      return "Filter is not set";

    case "x2":
      return "your requests is not valid";
    case "x3":
      return "your requests is not valid";
    case "x4":
      return "your requests is not valid";
    case "x33":
      return "you need to clear your cookie";
    case "x44":
      return "you need to clear your cookie";
    case "x55":
      return "needs relogin";
    case "x66":
      return "needs relogin";
    case "x999":
      return "invalid credentials";
    default:
      return code;
  }
};

export const getMessage = (error: any) => {
  const errorMessage = error?.response?.data?.result
    ? getErrorsStatus(error?.response?.data?.message)
    : error?.data && error?.data?.message
    ? getErrorsStatus(error?.data?.message)
    : error;
  return errorMessage;
};

export const getDeviceInfo = async () => {
  const UserAgent = await navigator.userAgentData.getHighEntropyValues([
    "architecture",
    "model",
    "platform",
    "platformVersion",
    "fullVersionList",
  ]);
  console.log(UserAgent);
  return UserAgent;
};

export const bodyDecrypt = (data: string): any | null => {
  if(!data.trim()){// Ensure data is not empty or just whitespace
    console.error("Decryption failed: Empty data.");
    return null;
  } 
  const token = Cookies.get("cookie_pb_1271");
  if(!token){// Handle missing token
    console.error("Decryption failed: Missing token doesn't exists.");
    return null; 
  }
  try {
    var bytes = CryptoJS.AES.decrypt(data, token);
    var cipherData = bytes.toString(CryptoJS.enc.Utf8);

    if (!cipherData) { // Handle incorrect decryption. (returns an empty string, it does not throw an exception)
      console.error("Decryption failed: Invalid or corrupt data.");
      return null;
    }

    return JSON.parse(cipherData);
  } catch (error) {
    console.error("Decryption failed: ", error)
    return null
  }
}
