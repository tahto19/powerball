import {
  browserName,
  browserVersion,
  isMobile,
  mobileModel,
} from "mobile-device-detect";

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
  console.log(mobileModel);
  const UserAgent = {
    model: mobileModel,
    platform: browserName,
    platformVersion: browserVersion,
  };

  console.log(UserAgent);
  return UserAgent;
};
