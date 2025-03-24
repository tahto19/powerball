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
};
