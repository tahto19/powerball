//@ts-nocheck

import CryptoJS from "crypto-js";

import {
  browserName,
  browserVersion,
  isMobile,
  mobileModel,
} from "mobile-device-detect";

const getErrorsStatus = (code: string) => {
  if (!code) return false;
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
      return "needs re-login";
    case "x66":
      return "needs re-login";
    case "x58":
      return "code is invalid";
    case "x71":
      return "Raffle ID already exists";
    case "x72":
      return "Image does not exists";
    case "x999":
      return "invalid credentials";
    case "x91c":
      return "File is not image";
    case "x909":
      return "Email is already used";
    case "x11":
      return "not login";
    case "x891":
      return "Server Error";
    case "268":
      return "No Active Ticket or no more entries available";
    case "x741":
      return "Generated OTP but the system email sender has a problem please contact administrator";
    default:
      return false;
  }
};

export const getMessage = (error: any) => {
  const getErrorMessage = getErrorsStatus(error?.response?.data?.message);

  const errorMessage = getErrorMessage
    ? getErrorMessage
    : error?.response?.data?.message
    ? error?.response?.data?.message
    : error;
  console.log(errorMessage);
  return errorMessage;
};

export const getDeviceInfo = async () => {
  console.log(mobileModel);
  const UserAgent = {
    model: mobileModel,
    platform: browserName,
    platformVersion: browserVersion,
  };

  console.log(UserAgent);
  return UserAgent;
};

export const bodyDecrypt = (
  data: string | null | undefined,
  token: string | null
): any | null => {
  if (!data || (typeof data === "string" && !data.trim())) {
    // Ensure data is not empty or just whitespace
    console.error("Decryption failed: Empty data.");
    return null;
  }

  if (!token) {
    // Handle missing token
    console.error("Decryption failed: Missing token doesn't exists.");
    return null;
  }
  try {
    const bytes = CryptoJS.AES.decrypt(data, token);

    const cipherData = bytes.toString(CryptoJS.enc.Utf8);

    if (!cipherData) {
      // Handle incorrect decryption. (returns an empty string, it does not throw an exception)
      console.error("Decryption failed: Invalid or corrupt data.");
      return null;
    }

    return JSON.parse(cipherData);
  } catch (error) {
    console.error("Decryption failed: ", error);
    return null;
  }
};

export const bodyEncrypt = (
  d: string | null | undefined,
  token: string | null
): any | null => {
  const data =
    typeof d === "string"
      ? d
      : typeof d === "array" || typeof d === "object"
      ? JSON.stringify(d)
      : d;
  if (!data || (typeof data === "string" && !data.trim())) {
    // Ensure data is not empty or just whitespace
    console.error("Decryption failed: Empty data.");
    throw new Error("Encryption  failed: Empty data.");
  }

  if (!token) {
    // Handle missing token
    console.error("Decryption failed: Missing token doesn't exists.");
    throw new Error('Encryption  failed: Missing token doesn"t exists.');
  }
  try {
    const bytes = CryptoJS.AES.encrypt(data, token).toString();
    if (!bytes) {
      // Handle incorrect decryption. (returns an empty string, it does not throw an exception)
      console.error("Encryption failed: Invalid or corrupt data.");
      throw new Error("Encryption failed");
    }

    return bytes;
  } catch (error) {
    console.error("Decryption failed: ", error);
    return null;
  }
};
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
