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
  const c_ = code
    .toLowerCase()
    .replace(/errorcode|error/g, "")
    .trim();
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
    case "x73":
      return "End date must be set after the start date. Please choose a valid end date.";
    case "x74":
      return "Draw date must be after the end date.";
    case "x75":
      return "Email does not exists";
    case "x761":
      return "Invalid token.";
    case "x762":
      return "Reset token has already been used.";
    case "x763":
      return "Password reset link has expired. Please request a new one.";
    case "x764":
      return "Empty password";
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
    case "x984":
      return "Invalid draw. Prize not found.";
    case "x911":
      return "All winning spots are now occupied";
    case "x675":
      return "Theres no entry on this ticket";
    case "x268":
      return "no active ticket or no more entries";
    case "x930":
      return "No Alpha Code On this Game";
    case "x138":
      return "This is Invalid URL";
    case "x921":
      return "No Entries Inserted";
    case "x923":
      return "A problem has been detected on your computer. Please contact your administrator for assistance. 923";
    case "x77":
      return "Already Exists";
    case "x369":
      return "entries is more than the total remaining entries";
    case "x663":
      return "This event is already drawn";
    case "x999":
      return "Error Encountered!";
    case "x351":
      return "A problem has been detected on your computer. Please contact your administrator for assistance. ";
    case "x910":
      return "Your mobile number is not registered";
    case "x933":
      return "This user is not allowed here";
    case "x908":
      return "Mobile Number Already Exists";
    case "x12":
      return "Scan Error. Please call (0917) 188 5885 or (0919) 099 1999 for assistance";
    case "x13":
      return "Not a valid Ticket";
    case "x876":
      return "No eligible tickets found for the draw";
    case "x15":
      return "No Data";
    case "x314":
      return "This is an invalid ticket";
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
    : error.message
    ? error.message
    : error;

  return errorMessage;
};

export const getDeviceInfo = async () => {
  const UserAgent = {
    model: mobileModel,
    platform: browserName,
    platformVersion: browserVersion,
  };

  return UserAgent;
};

export const bodyDecrypt = (
  data: string | null | undefined,
  token: string | null
): any | null => {
  if (!data || (typeof data === "string" && !data.trim())) {
    // Ensure data is not empty or just whitespace
    console.error("Decryption failed: Empty data.");
    throw new Error("Decryption failed: Empty data.");
  }
  if (!token) {
    // Handle missing token
    console.error("Decryption failed: Missing token doesn't exists.");
    throw new Error("Decryption failed: Empty data.");
  }
  try {
    const bytes = CryptoJS.AES.decrypt(data, token);

    const cipherData = bytes.toString(CryptoJS.enc.Utf8);

    if (!cipherData) {
      // Handle incorrect decryption. (returns an empty string, it does not throw an exception)
      console.error("Decryption failed: Invalid or corrupt data.");
      throw new Error("Decryption failed: Invalid or corrupt data..");
    }

    return JSON.parse(cipherData);
  } catch (error) {
    console.error("Decryption failed: ", error);
    throw error;
  }
};

export const bodyEncrypt = (
  d: string | null | undefined,
  token: string | null
): any | null => {
  const data =
    (typeof d === "string") | (typeof d === "number")
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
    const bytes = CryptoJS.AES.encrypt(data.toString(), token).toString();
    if (!bytes) {
      // Handle incorrect decryption. (returns an empty string, it does not throw an exception)
      console.error("Encryption failed: Invalid or corrupt data.");
      throw new Error("Encryption failed");
    }

    return bytes;
  } catch (error) {
    console.error("Decryption failed: ", error);

    throw error;
  }
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;

  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export const formatToPesos = (number: number) => {
  return new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
  }).format(number);
};
export const base64ToFile = (
  base64,
  filename,
  mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
) => {
  // Remove "data:*/*;base64," prefix if present
  const base64Data = base64.replace(/^data:.+;base64,/, "");

  // Convert base64 to binary
  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);

  // Create blob and download
  const blob = new Blob([byteArray], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
export const localEncrypt = (d) => {
  const e = btoa(d);
  return e;
};
export const localDecrypt = (d) => {
  const e = atob(d);
  return e;
};
export const randomLetters = (length) => {
  let mixed =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@$%^&()_";
  let a = "";
  for (let i = 0; i < length; i++) {
    let indexOfMixed = Math.floor(Math.random() * mixed.length);
    a += mixed[indexOfMixed];
  }
  return a;
};
