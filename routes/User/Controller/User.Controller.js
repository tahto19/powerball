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
  const { offset, limit, sort, filter } = req.body;

  let changeFilter = req.url.includes("/users/admin")
    ? [...filter, { field: "isAdmin", filter: true, type: "boolean" }]
    : [...filter, { field: "isAdmin", filter: false, type: "boolean" }];

  let r = await uc.FetchAndCount(offset, limit, sort, changeFilter);

  res.send(cSend(r));
};

export const insertController = async (req, res) => {
  const { firstname, lastname, password, emailAddress, mobileNumber, isAdmin } =
    req.body;
  let a = await uc.Insert({
    firstname,
    lastname,
    password,
    emailAddress,
    mobileNumber,
    isAdmin: isAdmin ? isAdmin : false,
  });

  res.send(cSend(a));
};
export const updateController = async (req, res) => {
  const {
    id,
    firstname,
    file,
    lastname,
    mobileNumber,
    birthdate,
    emailAddress,
    password,
    isAdmin,
  } = req.body;

  let data = {
    id,
    firstname,
    lastname,
    password,
    emailAddress,
    mobileNumber,
    birthdate,
    isAdmin,
  };

  if (file) {
    if (!file.mimetype.startsWith("image/")) throw new Error("ErrorCODE x91c");

    let newFileName = `${moment().format(
      "MM-DD-YYYY"
    )}-${generateRandomNumber()}-${generateRandomChar(5)}-${file.filename}`;
    let _path = getPath("/uploads/ids/" + newFileName);

    let iUp = await uploadImage(file);
    data = {
      ...data,
      idPath: iUp.filename,
    };
  }

  let a = await uc.Edit(data);
  res.send(cSend(a));
};

export const createUser = async (req, res) => {
  try {
    let platform = req.headers.platform;
    let platformversion = req.headers.platformversion;
    let mobile = req.headers["pm-scratch-it-m"];
    let ip_address =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;

    const {
      firstname,
      file,
      lastname,
      mobileNumber,
      birthdate,
      emailAddress,
      password,
    } = req.body;

    let fields = [];
    if (file) {
      if (!file.mimetype.startsWith("image/"))
        throw new Error("ErrorCODE x91c");
      var newFileName = `${moment().format(
        "MM-DD-YYYY"
      )}-${generateRandomNumber()}-${generateRandomChar(5)}-${file.filename}`;
      var _path = getPath("/uploads/ids/" + newFileName);
      var iUp = await uploadImage(file);
    }

    let r = await uc.Insert({
      firstname: firstname.value,
      lastname: lastname.value,
      password: password?.value || "",
      emailAddress: emailAddress?.value || "",
      mobileNumber: mobileNumber.value,
      birthdate: birthdate.value,
      idPath: file ? iUp.filename : null,
    });
    res.send(cSend(_path));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const checkUser = async (req, res) => {
  try {
    const { filter } = req.body;
    const getUser = await uc.FetchOne(filter);
    return;
  } catch (err) {
    throw err;
  }
};

export const getUserController = async (req, res) => {
  try {
    var user_id = req.user_id;
    let filter = [{ type: "number", field: "id", filter: user_id }];

    const getUser = await uc.FetchOne(filter);
    // getUser.password = "";
    res.send(cSend(getUser));
  } catch (err) {
    throw err;
  }
};
