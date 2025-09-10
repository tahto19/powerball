import moment from "moment";
import OTP from "../../../models/OTP.model.js";
import {
  cSend,
  decryptPassword,
  encrpytPassword,
  generateRandomChar,
  generateRandomNumber,
  getPath,
  randomLetters,
  uploadImage,
} from "../../../util/util.js";
import otp from "../../OTP/Class/OTP.class.js";
import uc from "../lib/User.class.js";
import fc from "../../freeTickets/lib/FreeTickets.class.js";
import tdc from "../../Ticket/lib/Ticket.class.js";
import fs from "fs";
import AuditTrail from "../../../models/AuditTrail.js";
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
  const checkEmailExists = await uc.FetchOne([
    {
      filter: encrpytPassword(emailAddress),
      type: "string_eq",
      field: "emailAddress",
    },
  ]);
  if (checkEmailExists) throw new Error("x909");
  const checkMobile = await uc.FetchOne([
    { filter: mobileNumber, type: "string_eq", field: "mobileNumber" },
  ]);
  if (checkMobile) throw new Error("x908");
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
    city,
    province,
    barangay,
    hbnandstr,
    gender,
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
    city,
    province,
    barangay,
    hbnandstr,
    gender,
  };
  const checkEmailExists = await uc.FetchOne([
    {
      filter: encrpytPassword(emailAddress),
      type: "string_eq",
      field: "emailAddress",
    },
  ]);

  if (checkEmailExists) {
    let v = checkEmailExists.toJSON();
    if (data.id !== v.id) throw new Error("errorcode x909");
  }

  const checkMobile = await uc.FetchOne([
    { filter: mobileNumber, type: "string_eq", field: "mobileNumber" },
  ]);
  if (checkMobile) {
    let v = checkMobile.toJSON();
    if (data.id !== v.id) throw new Error("errorcode x908");
  }
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
  console.log(data);
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
    // handle adding  free tickets
    // check if theres a free ticket
    console.log(r);
    let findFreeTickets = await fc.findDate_range();
    let getToday = moment().format("MMDDYYYYhhmmss");
    for (let val of findFreeTickets) {
      let i = val.toJSON();
      let b = await tdc.Insert({
        ticket_info: { details: "free" },
        entries: i.value,
        entries_used: 0,
        user_id: r,
        ticket_code: `FREE-TICKET-${randomLetters(4)}-${getToday}`,
        VIN: `FREE-${randomLetters(4)}-${getToday}`,
        alpha_code: "free",
      });
      await AuditTrail.create({
        performedBy: r,
        targetId: b,
        path: "free tickets",
        typeOfRequest: "free tickets",
        status: 1,
      });
    }
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
