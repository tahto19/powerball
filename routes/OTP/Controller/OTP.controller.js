import {
  cSend,
  encrpytPassword,
  generateRandomNumber,
  replaceFirstZeroWith63,
} from "../../../util/util.js";
import UserClass from "../../User/lib/User.class.js";
import OTPClass from "../Class/OTP.class.js";

export const createOTPController = async (req, res) => {
  try {
    const { emailAddress, outside, mobileNumber } = req.body;
    console.log(req.body);
    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;

    let r = await OTPClass.FetchOne([
      { filter: mobile, type: "string_eq", field: "mobile" },
      {
        filter: [mobileNumber, replaceFirstZeroWith63(mobileNumber)],
        type: "array-or",
        field: "mobileNumber",
      },
      { filter: ip_address, type: "string_eq", field: "ip_address" },
      { filter: platformversion, type: "string_eq", field: "platformversion" },
      { filter: platform, type: "string_eq", field: "platform" },
    ]);

    if (!outside) {
      if (emailAddress) {
        let findUser = await UserClass.FetchOne([
          {
            filter: encrpytPassword(emailAddress),
            field: "emailAddress",
            type: "string",
          },
        ]);

        if (findUser !== null) throw new Error("ErrorCODE x909");
      }
      if (mobileNumber) {
        let findUser = await UserClass.FetchOneV2([
          {
            filter: replaceFirstZeroWith63(mobileNumber),
            field: "mobileNumber",
            type: "string_eq",
          },
        ]);

        if (findUser !== null) throw new Error("ErrorCODE x908");
      }
    }
    if (r) {
      await OTPClass.Edit({
        platform,
        mobile,
        platformversion,
        ip_address,
        emailAddress: emailAddress || "",
        mobileNumber,
        id: r.id,
        code: generateRandomNumber(),
      });
    } else
      r = await OTPClass.Insert({
        platform,
        mobile,
        platformversion,
        ip_address,
        emailAddress: emailAddress || "",
        mobileNumber: replaceFirstZeroWith63(mobileNumber),
      });
    if (mobileNumber) {
      await r.mobileCode();
    }
    if (emailAddress) {
      await r.emailCode();
    }

    res.send(cSend(r.id));
  } catch (err) {
    throw err;
  }
};
export const updateOTPController = async (req, res) => {
  try {
    const { id, emailAddress } = req.body;
    const r = await OTPClass.Edit({
      id,
      emailAddress,
      code: generateRandomNumber,
    });
    res.send(cSend(r));
  } catch (err) {
    throw err;
  }
};
export const verifyCodeController = async (req, res) => {
  try {
    if (req.body.code === undefined) throw new Error("ErrorCODE X556");
    if (req.body.id === undefined) throw new Error("ErrorCODE x557");
    const _r = await OTPClass.findAndUpdateAuth({
      code: req.body.code,
      id: req.body.id,
    });
    if (_r === null) throw new Error("ErrorCODE x58");
    else res.send(cSend("VERIFIED"));
  } catch (err) {
    throw err;
  }
};
