import moment from "moment";
import OTP from "../../../models/OTP.model.js";
import {
  cSend,
  decryptPassword,
  generateRandomChar,
  generateRandomNumber,
  getPath,
  uploadImage,
} from "../../../util/util.js";
import otp from "../../OTP/Class/OTP.class.js";
import uc from "../lib/User.class.js";
import fs from "fs";
export const getController = async (req, res) => {
  const { limit, offset } = req.query;
  //   if (!limit || !offset) throw new Error("limit or offset is required");
  let a = await uc.FetchOne(offset, limit);
  let b = a.list.toJSON();

  res.send(cSend(a));
};

export const insertController = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");
  const { firstname, lastname, password, emailAddress, mobileNumber } =
    req.body;
  let a = await uc.Insert({
    firstname,
    lastname,
    password,
    emailAddress,
    mobileNumber,
  });

  res.send(cSend(a));
};
export const updateController = async (req, res) => {
  const { firstname, lastname, password, emailAddress, mobileNumber } =
    req.body;

  let a = await uc.Edit(req.body);
  res.send(cSend(a));
};
export const createUser = async (req, res) => {
  try {
    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
    const data = await req.file();
    const {
      firstname,
      file,
      lastname,
      mobileNumber,
      birthdate,
      emailAddress,
      password,
    } = data.fields;
    if (!file.mimetype.startsWith("image/")) throw new Error("ErrorCODE x91c");

    let newFileName = `${moment().format(
      "MM-DD-YYYY"
    )}-${generateRandomNumber()}-${generateRandomChar(5)}-${file.filename}`;
    let _path = getPath("/uploads/ids/" + newFileName);

    let iUp = await uploadImage(file);
    if (!password || !emailAddress)
      throw new Error("password or email is not set");
    let r = await uc.Insert({
      firstname: firstname.value,
      lastname: lastname.value,
      password: password.value,
      emailAddress: emailAddress.value,
      mobileNumber: mobileNumber.value,
      birthdate: birthdate.value,
      idPath: iUp.filename,
    });
    res.send(cSend(_path));
  } catch (err) {
    throw err;
  }
};
