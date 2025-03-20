import pino from "pino";
import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";
import CryptoJS from "crypto-js";
export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
const algorithm = "aes-256-cbc";
const key = "12345678912345678912345678912345"; // Key must be 32 bytes for AES-256
const iv = "1234567891011133"; // IV must be 16 bytes
export const encrpytPassword = async (_d) => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(_d, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
export const decryptPassword = async (_d) => {
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
          let multiplewherefilters = this.WhereFilters(
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
        case "boolean":
          wherefilters[f.field] = f.filter;
          break;
        case "array":
          wherefilters[f.field] = {
            [Op.in]: f.filter,
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
  return { success: "success", data };
};
export const encryptData = (data, token) => {
  var encrypted = CryptoJS.AES.encrypt(data, token).toString();

  return encrypted;
};
