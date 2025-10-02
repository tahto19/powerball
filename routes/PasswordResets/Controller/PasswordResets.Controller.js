import { cSend, decryptPassword, encrpytPassword } from "../../../util/util.js";
import prc from "../lib/PasswordResets.Class.js";
import moment from "moment";
import uc from "../../User/lib/User.class.js";
import OTPClass from "../../OTP/Class/OTP.class.js";

export const forgotPassword = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");

  const { email } = req.body;

  let filter = [{ field: "emailAddress", filter: email, type: "string" }];
  let user = await prc.FindUser(filter);
  if (!user) throw new Error("ErrorCODE x75");

  //avoid using previous token when creating a new token.
  let updateBulk = await prc.EditBulk({ used: true }, { user_id: user.id });
  console.log(updateBulk);

  const expires_at = moment().add(15, "minutes").format("YYYY-MM-DD HH:mm:ss");
  let data = {
    user_id: user.id,
    expires_at,
  };

  let create = await prc.Insert(data);
  const token_details = {
    id: create.id,
  };

  let token = await res.jwtSign(token_details);
  let encryptToken = await encrpytPassword(token);
  data = {
    id: create.id,
    token: encryptToken,
  };

  let update = await prc.Edit(data);
  const emailSender = await update.emailPasswordResetLink();

  if (!emailSender) throw new Error("ErrorCODE X741");

  res.send(cSend("SENT"));
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!password || password.trim() === "") throw new Error("ErrorCODE x764");

  let decrypt = await decryptPassword(token);
  if (!decrypt) throw new Error("ErrorCODE x761");

  let getTokenDetails = await req.jwtVerfiy(decrypt);
  if (!getTokenDetails) throw new Error("ErrorCODE x33");

  let filter = [{ field: "id", filter: getTokenDetails.id, type: "number" }];
  let resetDetails = await prc.Find(filter);

  if (resetDetails.used) throw new Error("ErrorCODE x763");

  if (moment().isAfter(resetDetails.expires_at))
    throw new Error("ErrorCODE x763");

  const _data = {
    id: resetDetails.user_id,
    password: password,
  };
  const _data2 = {
    id: getTokenDetails.id,
    used: true,
  };

  await uc.Edit(_data); //update user password
  await prc.Edit(_data2); // update token to "used"

  res.send(cSend("UPDATED"));
};

export const verifyResetPasswordOTP = async (req, res) => {
  try {
    const { mobileNumber, password, otp } = req.body;
    if (!password || password.trim() == "") throw new Error("ErrorCode x764");
    if (!otp || otp.trim() == "") throw new Error("OTP not found");
    if (!mobileNumber || mobileNumber.trim() == "")
      throw new Error("ErrorCODE x414");

    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;

    let dd =
      mobileNumber.charAt(0) == "0"
        ? "63" + mobileNumber.slice(1)
        : mobileNumber;

    let findMobile = await uc.FetchOneV2([
      {
        filter: dd,
        field: "mobileNumber",
        type: "string",
      },
    ]);

    if (!findMobile) throw new Error("ErrorCODE x910");

    let getOTP = await OTPClass.FetchOne([
      {
        filter: mobileNumber,
        field: "mobileNumber",
        type: "string_eq",
      },
      {
        filter: false,
        field: "auth",
        type: "boolean",
      },
      {
        filter: otp,
        field: "code",
        type: "string_eq",
      },
      {
        filter: platform,
        field: "platform",
        type: "string_eq",
      },
      {
        filter: platformversion,
        field: "platformversion",
        type: "string_eq",
      },
      {
        filter: mobile,
        field: "mobile",
        type: "string_eq",
      },
      {
        filter: ip_address,
        field: "ip_address",
        type: "string_eq",
      },
    ]);
    if (!getOTP) throw new Error("ErrorCode x58");
    // console.log(getOTP.toJSON());
    let otpDetails = getOTP.toJSON();
    let userDetails = findMobile.toJSON();
    console.log(">>>>>>>>>>", userDetails);
    let getTime = moment(moment()).diff(otpDetails.updatedAt, "minutes");
    if (getTime > 5) {
      throw new Error("ErrorCode x944");
    }
    // update OTP
    await OTPClass.Edit({ auth: true, id: getOTP.id });
    // update password
    await uc.Edit({ id: userDetails.id, password: password });
    res.send({ message: "successful" });
  } catch (err) {
    throw err;
  }
};
export const resetPasswordOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber || mobileNumber === "") throw new Error("ErrorCode x414");
    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;

    let dd =
      mobileNumber.charAt(0) == "0"
        ? "63" + mobileNumber.slice(1)
        : mobileNumber;
    console.log(dd);
    let findMobile = await uc.FetchOneV2([
      {
        filter: dd,
        field: "mobileNumber",
        type: "string",
      },
    ]);
    console.log(findMobile);
    if (!findMobile) throw new Error("ErrorCODE x910");

    let getID = await OTPClass.upsert(
      [
        {
          filter: mobileNumber,
          field: "mobileNumber",
          type: "string_eq",
        },
        {
          filter: false,
          field: "auth",
          type: "boolean",
        },
        {
          filter: platform,
          field: "platform",
          type: "string_eq",
        },
        {
          filter: platformversion,
          field: "platformversion",
          type: "string_eq",
        },
        {
          filter: mobile,
          field: "mobile",
          type: "string_eq",
        },
        {
          filter: ip_address,
          field: "ip_address",
          type: "string_eq",
        },
      ],
      { platform, platformversion, mobile, ip_address, mobileNumber }
    );

    if (!getID)
      throw new Error("error in upsert check here it should not be error");
    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
