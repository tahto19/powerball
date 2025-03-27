import { cSend, generateRandomNumber } from "../../../util/util.js";
import OTPClass from "../Class/OTP.class.js";

export const createOTPController = async (req, res) => {
  try {
    const { emailAddress } = req.body;
    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;

    let r = await OTPClass.FetchOne([
      { filter: mobile, type: "string", field: "code" },
      { filter: req.body.emailAddress, type: "string", field: "code" },
      { filter: ip_address, type: "string", field: "ip_address" },
      { filter: platformversion, type: "string", field: "platformversion" },
      { filter: platform, type: "string", field: "platform" },
    ]);
    if (r) {
      await OTPClass.Edit({
        platform,
        mobile,
        platformversion,
        ip_address,
        emailAddress,
        id: r.id,
        code: generateRandomNumber(),
      });
    } else
      r = await OTPClass.Insert({
        platform,
        mobile,
        platformversion,
        ip_address,
        emailAddress,
      });

    let checkEmail = await r.emailCode();
    if (!checkEmail) throw new Error("ErrorCODE X741");
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
