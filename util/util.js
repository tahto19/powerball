import pino from "pino";
import { createCipheriv, createDecipheriv } from "crypto";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";
import CryptoJS from "crypto-js";
import nodemailer from "nodemailer";
import moment from "moment";
import fs from "fs";
import telerivet from "telerivet";
const transport = nodemailer.createTransport({
  host: process.env.EMAILHOST,
  port: process.env.EMAILPORT,
  secure: true,
  auth: {
    user: process.env.EMAILUSERNAME,
    pass: process.env.EMAILPASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});
export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
const algorithm = "aes-256-cbc";
const key = process.env.DB_KEY; //  this must not change it will change the value of the db
const iv = process.env.DB_IV; // this must not change it will change the value of the db
export const encrpytPassword = (_d) => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(_d, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
export const decryptPassword = (_d) => {
  try {
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(_d, "hex", "utf8");

    decrypted += decipher.final("utf8"); // Fix: This should be called correctly
    return decrypted;
  } catch (err) {
    return false;
  }
};
export const WhereFilters = (filters = []) => {
  let wherefilters = {};

  if (filters && filters instanceof Array && filters.length > 0) {
    for (var x = 0; x < filters.length; x++) {
      const f = filters[x];

      switch (f.type.toString().toLowerCase()) {
        case "multiple-string":
        case "multiple-boolean":
        case "multiple-array":
        case "multiple-date":
          let multiplewherefilters = WhereFilters(
            f.field.map((i) => {
              return {
                field: i,
                filter: f.filter,
                type: f.type.toString().toLowerCase().replace("multiple-", ""),
              };
            })
          );

          wherefilters = Object.assign({}, wherefilters, multiplewherefilters);
          break;
        case "string":
          wherefilters[f.field] = {
            [Op.substring]: f.filter.toString(),
          };
          break;
        case "not_empty_string":
          wherefilters[f.field] = { [Op.ne]: "" };
          break;
        case "string_eq":
          wherefilters[f.field] = {
            [Op.eq]: f.filter.toString(),
          };
          break;
        case "boolean":
          wherefilters[f.field] = f.filter;
          break;
        case "array":
          wherefilters[f.field] = {
            [Op.in]: f.filter,
          };
        case "array-or":
          wherefilters[f.field] = {
            [Op.or]: f.filter,
          };
        case "number":
          wherefilters[f.field] = f.filter;
          break;
        case "isnot":
          wherefilters[f.field] = { [Op.ne]: f.filter };
          break;
        case "future_date":
          const currentDate = moment().startOf("day").format("YYYY-MM-DD");
          wherefilters[f.field] = {
            [Op.gt]: `${currentDate} 23:59:59`,
          };
          break;
        case "current_or_after":
          wherefilters[f.field] = {
            [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss"), // current datetime
          };
          break;
        case "date":
          if (
            f.filter.start &&
            f.filter.start.toString().length > 0 &&
            moment(f.filter.start.toString()).isValid()
          ) {
            if (
              f.filter.end &&
              f.filter.end.toString().length > 0 &&
              moment(f.filter.end.toString()).isValid()
            ) {
              wherefilters[f.field] = {
                [Op.gte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 00:00:00`,
                [Op.lte]: `${moment(f.filter.end.toString()).format(
                  "YYYY-MM-DD"
                )} 23:59:59`,
              };
            } else {
              wherefilters[f.field] = {
                [Op.gte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 00:00:00`,
                [Op.lte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 23:59:59`,
              };
            }
          }
          break;
      }
    }
  }

  return wherefilters;
};
export const getPath = (_d) => {
  let _P = _d ? _d : "";
  const __filename = fileURLToPath(import.meta.url);
  return path.join(__filename, "../../", _P);
};
export const cSend = (data) => {
  return { success: "success", success: "success", data };
};
export const encryptData = (data, token) => {
  let encrypted = CryptoJS.AES.encrypt(data, token).toString();

  return encrypted;
};
export const decryptData = (data, token) => {
  var decrypt = CryptoJS.AES.decrypt(data, token).toString(CryptoJS.enc.Utf8);

  return decrypt;
};
export const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
};
export const generateRandomChar = (n_) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < n_) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const emailSender = async (data) => {
  try {
    const { from, to, subject, text, html } = data;
    if (!subject || !to) throw new Error("ErrorCODE x231");
    logger.info("Sending Email to: " + to);
    const info = await transport.sendMail({
      from: !from ? process.env.EMAILUSERNAME : from, // Sender address
      to: to, // Receiver email
      subject: subject, // Email subject
      text: text, // Plain text
      html: html, // HTML body
    });
    logger.info("Sending Email Successfull");
    return info;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
export const mobileSender = async (data) => {
  try {
    // "k9h0E_hv7GZInBxYDhitdo8nATIriTz9zI0j"
    // process.env.OTP_API_KEY

    var tr = new telerivet.API(process.env.OTP_API_KEY);
    var project = tr.initProjectById(process.env.OTP_PROJECT_ID);
    project.sendMessage(
      {
        to_number: data.number,
        content: `Your One-Time Password (OTP) for this login: ${data.otp}

This code can only be used once and will change every time you log in.
If you did not request to log in to the Scratch It website, please ignore this message and do not share this code with anyone.`,
        route_id: process.env.OTP_ROUTE_ID,
      },
      function (err, message) {
        if (err) throw err;
      }
    );
  } catch (err) {
    console.log(err);
  }
};
export const uploadImage = async (file, filename) => {
  let fName = filename;
  if (!filename)
    fName = `${moment().format(
      "MM-DD-YYYY"
    )}-${generateRandomNumber()}-${generateRandomChar(5)}-${file.filename}`;
  let _path = getPath("/uploads/ids/" + fName);
  let toBuffer_ = await file.toBuffer();
  let uploadeImage = await fs.writeFileSync(_path, toBuffer_);
  return { uploadeImage, filename: fName };
};

export const uploadImage2 = async (file, filename, type = "image") => {
  let fName = filename;
  if (!filename)
    fName = `${moment().format(
      "MM-DD-YYYY"
    )}-${generateRandomNumber()}-${generateRandomChar(5)}-${file.filename}`;

  const folder =
    type === "video" ? "/uploads/video_page/" : "/uploads/image_page/";
  let _path = getPath(folder + fName);
  let toBuffer_ = await file.toBuffer();
  let uploadeImage = await fs.writeFileSync(_path, toBuffer_);
  return { uploadeImage, filename: fName, _path };
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
