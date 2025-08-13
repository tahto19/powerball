import cookieChecker from "../../../authentication/helper/cookieChecker.js";
import {
  cSend,
  decryptData,
  decryptPassword,
  encrpytPassword,
  generateRandomNumber,
} from "../../../util/util.js";
import OTPClass from "../../OTP/Class/OTP.class.js";
import UserClass from "../../User/lib/User.class.js";

export const LoginController = async (req, res) => {
  try {
    let a = await UserClass.FetchOne([
      {
        filter: encrpytPassword(req.body.email),
        type: "string",
        field: "emailAddress",
      },
    ]);
    if (a === null) throw new Error("ErrorCODE X999");
    let b = await a.validPassword(req.body.password);
    if (!b) throw new Error("ErrorCODE X999");
    let changeDetails = a.toJSON();

    delete changeDetails["password"];
    delete changeDetails["active"];
    delete changeDetails["block"];
    delete changeDetails["createdAt"];
    delete changeDetails["updatedAt"];
    delete changeDetails["deletedAt"];
    changeDetails["pm-scratch-it-m"] = req.headers["pm-scratch-it-m"];
    changeDetails["platformversion"] = req.headers["platformversion"];
    changeDetails["platform"] = req.headers["platform"];
    changeDetails["login"] = new Date();

    let token = await res.jwtSign(changeDetails);
    let encryptToken = await encrpytPassword(token);

    res
      .setCookie("cookie_pb_1271", encryptToken, {
        domain: "",
        path: "/",
        secure: true,
        httpOnly: true,
      })
      .send({ result: "success", token: encryptToken });
  } catch (err) {
    throw err;
  }
};
export const getMyDetailsController = async (req, res) => {
  try {
    let a = await cookieChecker(req);
    delete a["password"];
    res.send(cSend(a));
  } catch (err) {
    throw err;
  }
};
export const checkSessionController = async (req, res) => {
  try {
    await cookieChecker(req);
    res.send(req.cookies.cookie_pb_1271);
  } catch (err) {
    throw err;
  }
};
export const mobileNumberController = async (req, res) => {
  try {
    const { data } = req.body;
    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
    let dd_ = decryptData(data, req.headers.time);
    let dd = dd_.charAt(0) == "0" ? "63" + dd_.slice(1) : dd_;

    let findMobile = await UserClass.FetchOne([
      {
        filter: dd,
        field: "mobileNumber",
        type: "string",
      },
    ]);
    if (!findMobile) throw new Error("ErrorCODE x910");
    // check if already created otp
    let r = await OTPClass.FetchOne([
      { filter: mobile, type: "string", field: "mobile" },
      { filter: ip_address, type: "string", field: "ip_address" },
      { filter: platformversion, type: "string", field: "platformversion" },
      { filter: platform, type: "string", field: "platform" },
      { filter: dd, type: "string", field: "mobileNumber" },
      { filter: true, type: "boolean", field: "isLogin" },
      { filter: false, type: "boolean", field: "auth" },
    ]);
    // if null create new otp
    let otp;
    if (!r) {
      otp = await OTPClass.Insert({
        platform,
        mobile,
        platformversion,
        ip_address,
        mobileNumber: dd,
        isLogin: true,
      });
    } else {
      await OTPClass.Edit({
        platform,
        mobile,
        platformversion,
        ip_address,
        id: r.id,
        code: generateRandomNumber(),
      });
    }
    await r.mobileCode();
    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const loginUsingMobileNumberController = async (req, res) => {
  try {
    const { data } = req.body;
    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
    let dd_ = decryptData(data.ta_, req.headers.time);
    let dd = dd_.charAt(0) == "0" ? "63" + dd_.slice(1) : dd_;
    let otp = decryptData(data.tb_, req.headers.time);

    let r = await OTPClass.FetchOne([
      { filter: mobile, type: "string", field: "mobile" },
      { filter: ip_address, type: "string", field: "ip_address" },
      { filter: platformversion, type: "string", field: "platformversion" },
      { filter: platform, type: "string", field: "platform" },
      { filter: dd, type: "string", field: "mobileNumber" },
      { filter: otp, type: "string", field: "code" },
      { filter: true, type: "boolean", field: "isLogin" },
      { filter: false, type: "boolean", field: "auth" },
    ]);

    if (!r) throw new Error("ErrorCODE x58");
    let getUserDetails = await UserClass.FetchOne([
      {
        filter: dd,
        type: "string",
        field: "mobileNumber",
      },
    ]);
    if (!getUserDetails) throw new Error("ErrorCODE x999");
    let changeDetails = getUserDetails.toJSON();

    delete changeDetails["password"];
    delete changeDetails["active"];
    delete changeDetails["block"];
    delete changeDetails["createdAt"];
    delete changeDetails["updatedAt"];
    delete changeDetails["deletedAt"];
    changeDetails["pm-scratch-it-m"] = req.headers["pm-scratch-it-m"];
    changeDetails["platformversion"] = req.headers["platformversion"];
    changeDetails["platform"] = req.headers["platform"];
    changeDetails["login"] = new Date();
    let token = await res.jwtSign(changeDetails);

    let encryptToken = await encrpytPassword(token);

    res.setCookie("cookie_pb_1271", encryptToken, {
      domain: "",
      path: "/",
      secure: true,
      httpOnly: true,
    });
  } catch (err) {
    throw err;
  }
};
