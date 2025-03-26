import OTP from "../../../models/OTP.model.js";
import { cSend, decryptPassword } from "../../../util/util.js";
import otp from "../lib/OTP.class.js";
import uc from "../lib/User.class.js";
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
    const parts = req.parts();

    for await (const part of parts) {
      if (part.type === "field") {
        if (part.fieldname === "emailAddress") {
          let a = await otp.upsert(
            [
              {
                field: "ip_address",
                type: "string",
                filter: ip_address,
              },

              {
                field: "platform",
                type: "string",
                filter: platform,
              },
              {
                field: "platformversion",
                type: "string",
                filter: platformversion,
              },
            ],
            {
              platform,
              platformversion,
              mobile,
              ip_address,
              emailAddress: part.value,
            }
          );
          res.send(cSend(a));
        }
      }
      console.log("1");
    }
    console.log(body_, "here2");
  } catch (err) {
    throw err;
  }
};
